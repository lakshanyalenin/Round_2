/**
 * ECOMART — Master Application Bootstrapper
 * Coordinates navigation, countdown timer, theme switching, search popup, and toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Managers
  window.cartManager = new CartManager();
  window.shopManager = new ShopManager();
  window.featuredCarousel = new FeaturedCarousel();
  window.impactManager = new ImpactManager();
  window.aboutManager = new AboutManager();
  window.leafCursor = new LeafCursor();

  // Setup Theme
  initTheme();

  // Setup Navigation & Routing
  initNavigation();

  // Setup Platform 12 Countdown
  initCountdown();

  // Setup Global Search Modal
  initGlobalSearch();

  // Setup Toast Listener
  initToasts();

  // Setup Scroll Effects
  initScrollHeader();

  // Setup Hero CTAs & Cross Links
  initHeroActions();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */
function initTheme() {
  const store = window.ecomartStore;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = `
          <svg style="width: 20px; height: 20px; fill: currentColor;" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
        `;
        themeToggleBtn.setAttribute('title', 'Switch to Dark Emerald Futurism');
      }
    } else {
      document.body.classList.remove('light-theme');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = `
          <svg style="width: 20px; height: 20px; fill: currentColor;" viewBox="0 0 24 24">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/>
          </svg>
        `;
        themeToggleBtn.setAttribute('title', 'Switch to Clean Botanical Luxury');
      }
    }
  };

  applyTheme(store.theme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.play('toggle');
      const newTheme = store.toggleTheme();
      applyTheme(newTheme);
    });
  }
}

/* ==========================================================================
   Navigation & View Routing
   ========================================================================== */
function initNavigation() {
  const store = window.ecomartStore;
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  // Handle mobile drawer
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.play('click');
      mobileDrawer.classList.toggle('open');
    });
  }

  // Switch view function
  const navigateTo = (route) => {
    if (window.soundEffects) window.soundEffects.play('click');

    // Handle product detail route: product/:id
    if (route.startsWith('product/') || route.startsWith('/product/')) {
      const prodId = route.replace(/^\/?product\//, '');
      const prod = ECOMART_PRODUCTS.find(p => p.id === prodId) || ECOMART_PRODUCTS[0];
      
      store.setActiveTab('product');

      // Update active nav links (keep shop active)
      navLinks.forEach(link => link.classList.toggle('active', link.dataset.target === 'shop'));
      mobileNavLinks.forEach(link => link.classList.toggle('active', link.dataset.target === 'shop'));
      if (mobileDrawer) mobileDrawer.classList.remove('open');

      // Hide landing sections and show dedicated product page
      ['view-home', 'view-shop', 'view-impact', 'view-about'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
      const prodSec = document.getElementById('view-product');
      if (prodSec) prodSec.classList.remove('hidden');

      if (window.shopManager) {
        window.shopManager.renderProductPage(prod);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', `#/product/${prod.id}`);
      return;
    }

    const tabName = route.replace(/^\/?/, '') || 'home';
    store.setActiveTab(tabName);

    // Unhide main landing sections
    ['view-home', 'view-shop', 'view-impact', 'view-about'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
    });
    const prodSec = document.getElementById('view-product');
    if (prodSec) prodSec.classList.add('hidden');

    // Update active nav links
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === tabName);
    });

    mobileNavLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === tabName);
    });

    // Close mobile drawer if open
    if (mobileDrawer) mobileDrawer.classList.remove('open');

    // Smooth scroll to target section
    const targetEl = document.getElementById(`view-${tabName}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Sync hash
    history.replaceState(null, '', tabName === 'home' ? '#/' : `#/${tabName}`);
  };

  // Back to marketplace button
  const backBtn = document.getElementById('product-page-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigateTo('shop'));
  }

  // Nav link click listeners
  [...navLinks, ...mobileNavLinks].forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      navigateTo(target);
    });
  });

  // Subscribe to navigation events
  store.subscribe((event, tabName) => {
    if (event === 'navigation') {
      navigateTo(tabName);
    }
  });

  // Hash route resolver
  const resolveCurrentHash = () => {
    let hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash || hash === '') hash = 'home';

    if (hash.startsWith('product/')) {
      navigateTo(hash);
    } else if (['home', 'shop', 'impact', 'about'].includes(hash)) {
      navigateTo(hash);
    } else {
      navigateTo('home');
    }
  };

  // Check initial URL hash and listen to changes
  resolveCurrentHash();
  window.addEventListener('hashchange', resolveCurrentHash);
}

/* ==========================================================================
   Platform 12 Live Digital Countdown Timer
   ========================================================================== */
function initCountdown() {
  const hrEl = document.getElementById('countdown-hr');
  const minEl = document.getElementById('countdown-min');
  const secEl = document.getElementById('countdown-sec');

  // Calculate target countdown 14 hours ahead from now
  let remainingSeconds = (14 * 3600) + (38 * 60) + 24;

  const updateCountdown = () => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
    } else {
      remainingSeconds = 24 * 3600; // loop
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    if (hrEl) hrEl.textContent = String(hours).padStart(2, '0');
    if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
    if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Platform 12 "Browse Now" button
  const browseBtn = document.getElementById('browse-now-btn');
  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      const viewShop = document.getElementById('view-shop');
      if (viewShop) {
        viewShop.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'shop.html';
      }
    });
  }

  // Hero explore and impact buttons
  const heroExploreBtn = document.getElementById('hero-explore-btn');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', () => {
      const viewShop = document.getElementById('view-shop');
      if (viewShop) {
        viewShop.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'shop.html';
      }
    });
  }

  const heroImpactBtn = document.getElementById('hero-impact-btn');
  if (heroImpactBtn) {
    heroImpactBtn.addEventListener('click', () => {
      const viewImpact = document.getElementById('view-impact');
      if (viewImpact) {
        viewImpact.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'impact.html';
      }
    });
  }

  const heroSteelAddBtn = document.getElementById('hero-steel-quick-add');
  if (heroSteelAddBtn) {
    heroSteelAddBtn.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.play('add-to-cart');
      window.ecomartStore.addToCart('prod-02', 1);
    });
  }
}

/* ==========================================================================
   Global Search Overlay & Autocomplete
   ========================================================================== */
function initGlobalSearch() {
  const searchBackdrop = document.getElementById('search-modal-backdrop');
  const searchTriggerBtn = document.getElementById('search-trigger-btn');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInputField = document.getElementById('search-input-field');
  const searchResultsContainer = document.getElementById('search-results-list');

  if (!searchBackdrop || !searchInputField || !searchResultsContainer) return;

  const openSearch = () => {
    searchBackdrop.classList.add('open');
    searchInputField.value = '';
    renderSearchResults('');
    setTimeout(() => searchInputField.focus(), 100);
    document.body.style.overflow = 'hidden';
  };

  const closeSearch = () => {
    searchBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (searchTriggerBtn) searchTriggerBtn.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

  searchBackdrop.addEventListener('click', (e) => {
    if (e.target === searchBackdrop) closeSearch();
  });

  // Keyboard shortcut "/"
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchBackdrop.classList.contains('open')) {
      closeSearch();
    }
  });

  const renderSearchResults = (query) => {
    const q = query.toLowerCase().trim();
    const matches = q
      ? ECOMART_PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      : ECOMART_PRODUCTS.slice(0, 5); // default suggestions

    if (matches.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="search-empty-state">
          No sustainable swaps found.
        </div>
      `;
      return;
    }

    searchResultsContainer.innerHTML = matches.map(p => `
      <div class="search-result-item" data-product-id="${p.id}">
        <img class="search-result-thumb" src="${p.image}" alt="${p.name}" />
        <div class="search-result-info">
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-category">${p.category} • ${p.replaces}</div>
        </div>
        <div class="search-result-price">$${p.price}</div>
      </div>
    `).join('');

    searchResultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const prod = ECOMART_PRODUCTS.find(p => p.id === item.dataset.productId);
        closeSearch();
        if (prod) {
          window.location.hash = `#/product/${prod.id}`;
        }
      });
    });
  };

  searchInputField.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */
function initToasts() {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C22 3 10 4 6.66 9.47L8.2 10.42C10.74 6.75 17 8 17 8Z"/>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  };

  window.ecomartStore.subscribe((event, data) => {
    if (event === 'toast' && data && data.message) {
      showToast(data.message);
    }
  });
}

/* ==========================================================================
   Header Scroll Blur
   ========================================================================== */
function initScrollHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ==========================================================================
   Hero Actions & Interactive CTAs
   ========================================================================== */
function initHeroActions() {
  const heroShopBtn = document.getElementById('hero-explore-btn');
  const heroImpactBtn = document.getElementById('hero-impact-btn');
  const heroCardAddBtn = document.getElementById('hero-card-add-btn');
  const heroCardInspectBtn = document.getElementById('hero-card-inspect-btn');

  if (heroShopBtn) {
    heroShopBtn.addEventListener('click', () => {
      window.ecomartStore.setActiveTab('shop');
    });
  }

  if (heroImpactBtn) {
    heroImpactBtn.addEventListener('click', () => {
      window.ecomartStore.setActiveTab('impact');
    });
  }

  if (heroCardAddBtn) {
    heroCardAddBtn.addEventListener('click', () => {
      window.ecomartStore.addToCart('prod-02', 1); // Insulated Steel Bottle
    });
  }

  if (heroCardInspectBtn) {
    heroCardInspectBtn.addEventListener('click', () => {
      const prod = ECOMART_PRODUCTS.find(p => p.id === 'prod-02');
      if (window.shopManager && prod) {
        window.shopManager.openProductModal(prod);
      }
    });
  }
}
