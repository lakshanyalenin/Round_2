/**
 * ECOMART — Reactive State Store
 * Manages cart, active filters, search, theme, and view routing with localStorage sync.
 */

class EcomartStore {
  constructor() {
    this.cart = this.loadCart();
    this.theme = localStorage.getItem('ecomart_theme') || 'dark';
    this.activeTab = 'home';
    this.filters = {
      search: '',
      category: 'All',
      maxPrice: 100,
      sortBy: 'recommended',
      minRating: 0
    };
    this.listeners = new Set();
  }

  // Load cart from localStorage or initialize with popular starter swap
  loadCart() {
    try {
      const saved = localStorage.getItem('ecomart_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error loading cart from storage', e);
    }
    // Default starter item for instant delight if empty
    return [
      { id: 'prod-02', quantity: 1 } // Insulated Steel Bottle
    ];
  }

  saveCart() {
    try {
      localStorage.setItem('ecomart_cart', JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Error saving cart', e);
    }
    this.notify('cart');
  }

  saveTheme() {
    localStorage.setItem('ecomart_theme', this.theme);
    this.notify('theme');
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, data) {
    for (const listener of this.listeners) {
      listener(event, data, this);
    }
  }

  // Cart actions
  addToCart(productId, quantity = 1) {
    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ id: productId, quantity });
    }
    this.saveCart();
    this.notify('toast', {
      type: 'success',
      message: `Added to your eco-cart!`
    });
  }

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      this.saveCart();
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.notify('toast', {
      type: 'info',
      message: 'Item removed from eco-cart.'
    });
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartDetails() {
    return this.cart.map(item => {
      const product = ECOMART_PRODUCTS.find(p => p.id === item.id);
      return {
        ...item,
        product: product || {
          id: item.id,
          name: 'Sustainable Item',
          price: 0,
          image: 'assets/images/insulated_steel_bottle.jpg',
          category: 'Eco'
        },
        itemTotal: product ? product.price * item.quantity : 0
      };
    });
  }

  getCartSubtotal() {
    return this.getCartDetails().reduce((sum, item) => sum + item.itemTotal, 0);
  }

  getCartImpact() {
    const details = this.getCartDetails();
    let totalCO2 = 0;
    let plasticItemsAvoided = 0;

    details.forEach(({ product, quantity }) => {
      if (!product) return;
      const co2Num = parseFloat(product.co2Saved) || 3.5;
      totalCO2 += co2Num * quantity;
      
      if (product.id === 'prod-01') plasticItemsAvoided += 4 * quantity;
      else if (product.id === 'prod-02') plasticItemsAvoided += 150 * quantity;
      else if (product.id === 'prod-03') plasticItemsAvoided += 400 * quantity;
      else if (product.id === 'prod-04') plasticItemsAvoided += 1000 * quantity;
      else if (product.id === 'prod-05') plasticItemsAvoided += 12 * quantity;
      else if (product.id === 'prod-06') plasticItemsAvoided += 3 * quantity;
      else if (product.id === 'prod-07') plasticItemsAvoided += 10 * quantity;
      else if (product.id === 'prod-08') plasticItemsAvoided += 25 * quantity;
      else if (product.id === 'prod-09') plasticItemsAvoided += 100 * quantity;
      else if (product.id === 'prod-10') plasticItemsAvoided += 40 * quantity;
      else if (product.id === 'prod-11') plasticItemsAvoided += 4 * quantity;
      else if (product.id === 'prod-12') plasticItemsAvoided += 500 * quantity;
    });

    return {
      co2Kg: totalCO2.toFixed(1),
      plasticUnits: plasticItemsAvoided
    };
  }

  // Filter & Search actions
  setFilter(key, value) {
    this.filters[key] = value;
    this.notify('filters');
  }

  resetFilters() {
    this.filters = {
      search: '',
      category: 'All',
      maxPrice: 100,
      sortBy: 'recommended',
      minRating: 0
    };
    this.notify('filters');
  }

  getFilteredProducts() {
    let result = [...ECOMART_PRODUCTS];

    // Search text match
    if (this.filters.search.trim()) {
      const q = this.filters.search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.materials.some(m => m.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (this.filters.category && this.filters.category !== 'All') {
      const cat = this.filters.category.toLowerCase();
      result = result.filter(p => {
        const pCat = p.category.toLowerCase();
        if (pCat === cat) return true;
        if (cat === 'home' && ['cleaning', 'stationery', 'kitchen', 'outdoor', 'drinkware'].includes(pCat)) return true;
        if (cat === 'solar' && ['solar', 'outdoor'].includes(pCat)) return true;
        return false;
      });
    }

    // Price filter
    if (this.filters.maxPrice) {
      result = result.filter(p => p.price <= this.filters.maxPrice);
    }

    // Rating filter
    if (this.filters.minRating > 0) {
      result = result.filter(p => p.rating >= this.filters.minRating);
    }

    // Sorting
    switch (this.filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating || b.sustainabilityScore - a.sustainabilityScore);
        break;
      case 'sustainability-desc':
        result.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.sustainabilityScore - a.sustainabilityScore);
        break;
    }

    return result;
  }

  // Theme toggle
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.saveTheme();
    return this.theme;
  }

  // View Navigation
  setActiveTab(tabName) {
    if (['home', 'shop', 'impact', 'about'].includes(tabName)) {
      this.activeTab = tabName;
      this.notify('navigation', tabName);
    }
  }
}

// Global singleton instance
window.ecomartStore = new EcomartStore();
