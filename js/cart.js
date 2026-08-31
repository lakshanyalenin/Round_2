/**
 * ECOMART — Cart Drawer & Checkout Module
 * Handles cart UI rendering, item mutations, drawer animations, and checkout modal.
 */

class CartManager {
  constructor() {
    this.drawerBackdrop = document.getElementById('cart-drawer-backdrop');
    this.drawer = document.getElementById('cart-drawer');
    this.cartItemsList = document.getElementById('cart-items-container');
    this.cartBadge = document.getElementById('cart-badge');
    this.cartSubtotalEl = document.getElementById('cart-subtotal-val');
    this.cartImpactCo2El = document.getElementById('cart-impact-co2');
    this.cartImpactPlasticsEl = document.getElementById('cart-impact-plastics');
    this.cartShippingMsgEl = document.getElementById('cart-shipping-msg');
    this.checkoutModal = document.getElementById('checkout-modal-backdrop');

    this.initEventListeners();
    this.render();

    // Subscribe to state changes
    window.ecomartStore.subscribe((event) => {
      if (event === 'cart') {
        this.render();
      }
    });
  }

  initEventListeners() {
    // Open cart
    const cartTriggerBtn = document.getElementById('cart-trigger-btn');
    if (cartTriggerBtn) {
      cartTriggerBtn.addEventListener('click', () => this.openCart());
    }

    // Close cart
    const cartCloseBtn = document.getElementById('cart-close-btn');
    if (cartCloseBtn) {
      cartCloseBtn.addEventListener('click', () => this.closeCart());
    }

    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === this.drawerBackdrop) {
          this.closeCart();
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.openCheckout());
    }

    // Checkout modal close
    const checkoutCloseBtn = document.getElementById('checkout-close-btn');
    if (checkoutCloseBtn) {
      checkoutCloseBtn.addEventListener('click', () => this.closeCheckout());
    }

    // Checkout form submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit();
      });
    }
  }

  openCart() {
    if (this.drawer && this.drawerBackdrop) {
      this.drawerBackdrop.classList.add('open');
      this.drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCart() {
    if (this.drawer && this.drawerBackdrop) {
      this.drawerBackdrop.classList.remove('open');
      this.drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  render() {
    const store = window.ecomartStore;
    const count = store.getCartCount();
    const subtotal = store.getCartSubtotal();
    const impact = store.getCartImpact();
    const items = store.getCartDetails();

    // Update nav badge
    if (this.cartBadge) {
      this.cartBadge.textContent = count;
      this.cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    // Update totals
    if (this.cartSubtotalEl) {
      this.cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    if (this.cartImpactCo2El) {
      this.cartImpactCo2El.textContent = `${impact.co2Kg} kg CO₂`;
    }

    if (this.cartImpactPlasticsEl) {
      this.cartImpactPlasticsEl.textContent = `${impact.plasticUnits} single-use items`;
    }

    // Shipping threshold
    if (this.cartShippingMsgEl) {
      const threshold = 50;
      if (subtotal >= threshold) {
        this.cartShippingMsgEl.innerHTML = `🌿 <strong>Unlocked:</strong> Free Carbon-Neutral Shipping!`;
      } else {
        const remaining = (threshold - subtotal).toFixed(2);
        this.cartShippingMsgEl.innerHTML = `📦 Add <strong>$${remaining}</strong> for <strong>Free Carbon-Neutral Express</strong>`;
      }
    }

    // Render list or empty state
    if (!this.cartItemsList) return;

    if (items.length === 0) {
      this.cartItemsList.innerHTML = `
        <div class="cart-empty-wrapper">
          <svg class="cart-empty-icon" viewBox="0 0 24 24">
            <path d="M12 2L15 9H22L16.5 13.5L18.5 20.5L12 16L5.5 20.5L7.5 13.5L2 9H9L12 2Z"/>
          </svg>
          <div class="cart-empty-text">Your cart is waiting for a small swap.</div>
          <div class="cart-empty-subtext">Every sustainable choice keeps plastic out of landfills and reduces carbon.</div>
          <button class="btn btn-primary" id="cart-browse-btn" style="margin-top: 12px;">
            Browse Products
          </button>
        </div>
      `;

      const browseBtn = document.getElementById('cart-browse-btn');
      if (browseBtn) {
        browseBtn.addEventListener('click', () => {
          this.closeCart();
          window.location.href = 'shop.html';
        });
      }

      const checkoutBtn = document.getElementById('cart-checkout-btn');
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) checkoutBtn.disabled = false;

    this.cartItemsList.innerHTML = items.map(({ id, quantity, product, itemTotal }) => `
      <div class="cart-item-card" data-product-id="${id}">
        <img class="cart-item-img" src="${product.image}" alt="${product.name}" />
        <div class="cart-item-details">
          <div class="cart-item-top">
            <div>
              <div class="cart-item-name">${product.name}</div>
              <span class="badge badge-neon" style="margin-top: 4px; font-size: 0.68rem;">${product.category}</span>
            </div>
            <button class="cart-item-remove-btn" data-action="remove" title="Remove item">&times;</button>
          </div>
          <div class="cart-item-bottom">
            <div class="cart-item-price">$${(product.price * quantity).toFixed(2)}</div>
            <div class="cart-qty-control">
              <button class="cart-qty-btn" data-action="decrease" title="Decrease quantity">−</button>
              <span class="cart-qty-value">${quantity}</span>
              <button class="cart-qty-btn" data-action="increase" title="Increase quantity">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach item listeners
    this.cartItemsList.querySelectorAll('.cart-item-card').forEach(card => {
      const prodId = card.dataset.productId;
      card.querySelector('[data-action="remove"]').addEventListener('click', () => {
        if (window.soundEffects) window.soundEffects.play('remove');
        store.removeFromCart(prodId);
      });
      card.querySelector('[data-action="decrease"]').addEventListener('click', () => {
        if (window.soundEffects) window.soundEffects.play('click');
        store.updateQuantity(prodId, -1);
      });
      card.querySelector('[data-action="increase"]').addEventListener('click', () => {
        if (window.soundEffects) window.soundEffects.play('click');
        store.updateQuantity(prodId, 1);
      });
    });
  }

  openCheckout() {
    this.closeCart();
    if (window.soundEffects) window.soundEffects.play('click');
    if (this.checkoutModal) {
      const store = window.ecomartStore;
      const subtotal = store.getCartSubtotal();
      const impact = store.getCartImpact();

      const modalSubtotal = document.getElementById('checkout-modal-subtotal');
      const modalCo2 = document.getElementById('checkout-modal-co2');
      const modalPlastics = document.getElementById('checkout-modal-plastics');

      if (modalSubtotal) modalSubtotal.textContent = `$${subtotal.toFixed(2)}`;
      if (modalCo2) modalCo2.textContent = `${impact.co2Kg} kg`;
      if (modalPlastics) modalPlastics.textContent = `${impact.plasticUnits} units`;

      this.checkoutModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCheckout() {
    if (this.checkoutModal) {
      this.checkoutModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  handleCheckoutSubmit() {
    const store = window.ecomartStore;
    const impact = store.getCartImpact();
    if (window.soundEffects) window.soundEffects.play('chime');
    
    // Simulate high-tech order confirmation
    const checkoutBody = document.getElementById('checkout-modal-body');
    const orderNumber = `ECO-${Math.floor(100000 + Math.random() * 900000)}`;

    if (checkoutBody) {
      checkoutBody.innerHTML = `
        <div style="text-align: center; padding: 24px 0; display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(0, 255, 136, 0.15); border: 2px solid var(--accent-neon); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 24px var(--accent-neon);">
            <svg style="width: 32px; height: 32px; fill: var(--accent-neon);" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <h3 style="font-size: 1.8rem; font-weight: 900; color: var(--text-primary);">Thank you for making a better swap. 🌿</h3>
          <p style="color: var(--text-secondary); max-width: 380px;">
            Your order has been routed through our 100% solar-powered fulfillment hub with zero virgin plastics.
          </p>
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 16px 24px; width: 100%; text-align: left; margin: 10px 0;">
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-neon); letter-spacing: 0.1em; text-transform: uppercase;">
              Eco-Certificate #${orderNumber}
            </div>
            <div style="font-size: 1.05rem; font-weight: 700; margin-top: 6px;">
              🌱 Diverted ${impact.plasticUnits} single-use items & ${impact.co2Kg} kg CO₂
            </div>
          </div>
          <div style="display: flex; gap: 12px; width: 100%; margin-top: 8px;">
            <button class="btn btn-secondary" id="checkout-share-btn" style="flex: 1; padding: 14px; font-size: 0.88rem;">
              Copy Eco-Badge
            </button>
            <button class="btn btn-primary" id="checkout-done-btn" style="flex: 1; padding: 14px; font-size: 0.88rem;">
              Explore More
            </button>
          </div>
        </div>
      `;

      document.getElementById('checkout-share-btn').addEventListener('click', () => {
        const text = `🌿 I just placed a 100% carbon-neutral order on Ecomart (${orderNumber}) and diverted ${impact.plasticUnits} single-use items & ${impact.co2Kg} kg CO₂! #ShopBetterLiveSustainably`;
        navigator.clipboard?.writeText(text);
        store.notify('toast', {
          type: 'success',
          message: 'Eco-badge text copied to clipboard!'
        });
      });

      document.getElementById('checkout-done-btn').addEventListener('click', () => {
        store.clearCart();
        this.closeCheckout();
        window.location.reload();
      });
    }
  }
}

window.cartManager = null;
