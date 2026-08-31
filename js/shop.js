/**
 * ECOMART — Marketplace & Product Catalog Controller
 * Handles real-time search, category & price filtering, leaf rating filters, product modal, and reviews.
 */

// Helper to generate visual row of 5 leaf icons with active states
function renderLeafScore(rating, showLabel = true) {
  let leavesHtml = '';
  for (let i = 1; i <= 5; i++) {
    const isActive = i <= rating;
    leavesHtml += `
      <svg class="leaf-icon ${isActive ? 'active' : ''}" viewBox="0 0 24 24">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C22 3 10 4 6.66 9.47L8.2 10.42C10.74 6.75 17 8 17 8Z"/>
      </svg>
    `;
  }

  const labelHtml = showLabel ? `<span class="leaf-rating-label">${rating}-Leaf Rated</span>` : '';
  return `<div class="leaf-rating">${leavesHtml}${labelHtml}</div>`;
}

// Mock Verified Customer Reviews
const PRODUCT_REVIEWS = {
  'prod-01': [
    { author: 'Elena V.', location: 'Seattle, WA', rating: 5, date: '2 days ago', text: 'The bristles feel gentle yet exceptionally clean. Love knowing it will compost completely in our garden soil.' },
    { author: 'Liam K.', location: 'Vancouver, BC', rating: 5, date: '1 week ago', text: 'Ergonomic handle and zero plastic packaging. Our entire family switched to this.' }
  ],
  'prod-02': [
    { author: 'Marcus T.', location: 'Austin, TX', rating: 5, date: 'Yesterday', text: 'Stays icy cold even in 100°F weather. The laser etched leaf design is pure futuristic elegance.' },
    { author: 'Sophia R.', location: 'Berlin, DE', rating: 5, date: '3 days ago', text: 'Replaced 4 different bottles with this one. Indestructible build and zero metallic taste.' }
  ],
  'prod-03': [
    { author: 'Chloe M.', location: 'Portland, OR', rating: 4, date: '5 days ago', text: 'Heavyweight organic cotton weave that holds heavy groceries with zero strain. Beautiful minimalist aesthetic.' }
  ],
  'prod-04': [
    { author: 'David L.', location: 'San Diego, CA', rating: 5, date: '4 days ago', text: 'Love scanning the NFC chip to see where ocean plastic was recovered. A true masterpiece of circular engineering.' }
  ],
  'prod-05': [
    { author: 'Hannah S.', location: 'Denver, CO', rating: 5, date: '6 days ago', text: 'The dissolvable tablets smell divine with natural eucalyptus. The forever amber bottle looks stunning on the counter.' }
  ],
  'prod-06': [
    { author: 'Julian P.', location: 'Montreal, CA', rating: 4, date: '1 week ago', text: 'Lathers richly and moisturizes deeply without any synthetic foaming agents. Planted the seed paper wrapper and already seeing sprouts!' }
  ],
  'prod-07': [
    { author: 'Maya N.', location: 'Chicago, IL', rating: 4, date: '3 days ago', text: 'Fountain pen ink does not bleed through. The recycled wheat straw cover has a wonderfully tactile natural texture.' }
  ],
  'prod-08': [
    { author: 'Kenji O.', location: 'Tokyo, JP', rating: 5, date: 'Yesterday', text: 'Lightest sneakers I have ever worn. The sugarcane foam bouncy response is futuristic perfection.' }
  ],
  'prod-09': [
    { author: 'Tara B.', location: 'Boulder, CO', rating: 5, date: '2 days ago', text: 'Harvests clean solar power while trail running. Kept my smartwatch and phone charged throughout a 3-day backcountry trek.' }
  ],
  'prod-10': [
    { author: 'Oscar F.', location: 'Melbourne, AU', rating: 5, date: '5 days ago', text: 'Packs flat in seconds and creates the warmest ambient camp illumination. Incredibly durable.' }
  ],
  'prod-11': [
    { author: 'Clara W.', location: 'Zurich, CH', rating: 4, date: '1 week ago', text: 'Soothing organic peppermint aroma. Repaired my cracked winter heels within three applications.' }
  ],
  'prod-12': [
    { author: 'Devon J.', location: 'London, UK', rating: 5, date: '3 days ago', text: 'Compact canvas roll fits in my daily backpack. Utensils feel smooth and sturdy. Zero reason for single-use plastic cutlery anymore.' }
  ]
};

class ShopManager {
  constructor() {
    this.productGrid = document.getElementById('marketplace-product-grid');
    this.resultsCountEl = document.getElementById('filter-results-count');
    this.activePillsContainer = document.getElementById('filter-active-pills');
    this.searchInput = document.getElementById('filter-search-input');
    this.categorySelect = document.getElementById('filter-category-select');
    this.sortSelect = document.getElementById('filter-sort-select');
    this.priceSlider = document.getElementById('filter-price-slider');
    this.priceSliderVal = document.getElementById('filter-price-val');
    this.resetBtn = document.getElementById('filter-reset-btn');

    // Product Modal
    this.productModal = document.getElementById('product-modal-backdrop');
    this.selectedProduct = null;

    this.initEventListeners();
    this.initLeafFilterButtons();
    this.render();

    // Subscribe to state filter updates
    window.ecomartStore.subscribe((event) => {
      if (event === 'filters') {
        this.render();
      }
    });
  }

  initEventListeners() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        window.ecomartStore.setFilter('search', e.target.value);
      });
    }

    // Category dropdown
    if (this.categorySelect) {
      this.categorySelect.addEventListener('change', (e) => {
        if (window.soundEffects) window.soundEffects.play('click');
        window.ecomartStore.setFilter('category', e.target.value);
      });
    }

    // Sort dropdown
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        if (window.soundEffects) window.soundEffects.play('click');
        window.ecomartStore.setFilter('sortBy', e.target.value);
      });
    }

    // Max Price slider
    if (this.priceSlider) {
      this.priceSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (this.priceSliderVal) {
          this.priceSliderVal.textContent = `$${val}`;
        }
        window.ecomartStore.setFilter('maxPrice', val);
      });
    }

    // Reset button
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        if (window.soundEffects) window.soundEffects.play('remove');
        this.resetControls();
        window.ecomartStore.resetFilters();
      });
    }

    // Product modal close
    const modalCloseBtn = document.getElementById('product-modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => this.closeProductModal());
    }

    if (this.productModal) {
      this.productModal.addEventListener('click', (e) => {
        if (e.target === this.productModal) {
          this.closeProductModal();
        }
      });
    }
  }

  initLeafFilterButtons() {
    const leafBtns = document.querySelectorAll('.leaf-filter-btn');
    leafBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        leafBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const minRating = parseInt(btn.dataset.rating, 10) || 0;
        if (window.soundEffects) window.soundEffects.play('click');
        window.ecomartStore.setFilter('minRating', minRating);
      });
    });
  }

  resetControls() {
    if (this.searchInput) this.searchInput.value = '';
    if (this.categorySelect) this.categorySelect.value = 'All';
    if (this.sortSelect) this.sortSelect.value = 'recommended';
    if (this.priceSlider) {
      this.priceSlider.value = 100;
      if (this.priceSliderVal) this.priceSliderVal.textContent = '$100';
    }
    const leafBtns = document.querySelectorAll('.leaf-filter-btn');
    leafBtns.forEach((b, idx) => b.classList.toggle('active', idx === 0));
  }

  render() {
    const store = window.ecomartStore;
    const products = store.getFilteredProducts();

    // Results count
    if (this.resultsCountEl) {
      this.resultsCountEl.textContent = `Showing ${products.length} of ${ECOMART_PRODUCTS.length} sustainable swaps`;
    }

    // Render active filter pills
    this.renderFilterPills();

    // Render product grid
    if (!this.productGrid) return;

    if (products.length === 0) {
      this.productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
          <svg style="width: 56px; height: 56px; fill: var(--accent-neon); opacity: 0.5; margin-bottom: 12px;" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h3 style="font-size: 1.4rem; font-weight: 800;">No matching eco-swaps found</h3>
          <p style="color: var(--text-secondary); margin: 8px 0 20px;">Try adjusting your filters, price range, or search keywords.</p>
          <button class="btn btn-secondary" id="empty-clear-filters-btn">Clear All Filters</button>
        </div>
      `;

      const emptyClearBtn = document.getElementById('empty-clear-filters-btn');
      if (emptyClearBtn) {
        emptyClearBtn.addEventListener('click', () => {
          this.resetControls();
          store.resetFilters();
        });
      }
      return;
    }

    this.productGrid.innerHTML = products.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-img-wrapper">
          <img class="product-card-img" src="${product.image}" alt="${product.name}" loading="lazy" />
          <span class="badge badge-neon product-card-badge">${product.category}</span>
          <div class="product-price-tag">$${product.price}</div>
        </div>
        <div class="product-card-info">
          <div class="product-card-rating-row">
            ${renderLeafScore(product.rating)}
            <span class="badge badge-dark" style="font-size: 0.7rem;">${product.sustainabilityScore}% Eco</span>
          </div>
          <h3 class="product-card-name">${product.name}</h3>
          <p class="product-card-tagline">${product.tagline}</p>
          <div class="product-card-metric">
            <span>🌱</span> <span>Replaces: ${product.replaces}</span>
          </div>
        </div>
        <div class="product-card-actions">
          <button class="btn btn-primary quick-add-btn" data-product-id="${product.id}" title="Quick Add">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');

    // Attach click events
    this.productGrid.querySelectorAll('.product-card').forEach(card => {
      const prodId = card.dataset.productId;
      const product = ECOMART_PRODUCTS.find(p => p.id === prodId);

      // Open detail modal when clicking card body (except quick add button)
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.quick-add-btn')) {
          if (window.soundEffects) window.soundEffects.play('click');
          if (product) this.openProductModal(product);
        }
      });

      // Quick Add
      const quickAddBtn = card.querySelector('.quick-add-btn');
      if (quickAddBtn) {
        quickAddBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.soundEffects) window.soundEffects.play('add-to-cart');
          store.addToCart(prodId, 1);
        });
      }
    });
  }

  renderFilterPills() {
    if (!this.activePillsContainer) return;
    const store = window.ecomartStore;
    const { search, category, maxPrice, minRating } = store.filters;

    const pills = [];
    if (search.trim()) {
      pills.push({ key: 'search', label: `Search: "${search}"` });
    }
    if (category && category !== 'All') {
      pills.push({ key: 'category', label: `Category: ${category}` });
    }
    if (maxPrice < 150) {
      pills.push({ key: 'maxPrice', label: `Max Price: $${maxPrice}` });
    }
    if (minRating > 0) {
      pills.push({ key: 'minRating', label: `${minRating} 🌿 Rating` });
    }

    if (pills.length === 0) {
      this.activePillsContainer.innerHTML = '';
      return;
    }

    this.activePillsContainer.innerHTML = pills.map(p => `
      <span class="filter-pill" data-filter-key="${p.key}">
        ${p.label}
        <span class="filter-pill-remove" title="Remove filter">&times;</span>
      </span>
    `).join('');

    this.activePillsContainer.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const key = pill.dataset.filterKey;
        if (key === 'search') {
          if (this.searchInput) this.searchInput.value = '';
          store.setFilter('search', '');
        } else if (key === 'category') {
          if (this.categorySelect) this.categorySelect.value = 'All';
          store.setFilter('category', 'All');
        } else if (key === 'maxPrice') {
          if (this.priceSlider) {
            this.priceSlider.value = 150;
            if (this.priceSliderVal) this.priceSliderVal.textContent = '$150';
          }
          store.setFilter('maxPrice', 150);
        } else if (key === 'minRating') {
          const leafBtns = document.querySelectorAll('.leaf-filter-btn');
          leafBtns.forEach((b, idx) => b.classList.toggle('active', idx === 0));
          store.setFilter('minRating', 0);
        }
      });
    });
  }

  openProductModal(product) {
    if (!product || !this.productModal) return;
    this.selectedProduct = product;

    const modalBody = document.getElementById('product-modal-card-content');
    if (!modalBody) return;

    const reviews = PRODUCT_REVIEWS[product.id] || [
      { author: 'Verified Pioneer', location: 'United States', rating: 5, date: 'Recently', text: 'Exceptional build quality and zero plastic footprint.' }
    ];

    modalBody.innerHTML = `
      <div class="product-modal-img-col">
        <div class="product-modal-img-wrapper">
          <img class="product-modal-img" src="${product.image}" alt="${product.name}" />
        </div>
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 8px;">
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-neon); text-transform: uppercase;">
            Verified Origin & Ethics
          </div>
          <div style="font-size: 0.92rem; font-weight: 600; color: var(--text-primary);">
            📍 ${product.origin}
          </div>
          <div style="font-size: 0.82rem; color: var(--text-secondary);">
            📦 Packaging: ${product.packaging}
          </div>
        </div>
      </div>
      <div class="product-modal-details-col">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="badge badge-neon">${product.category}</span>
          ${renderLeafScore(product.rating)}
        </div>
        <h2 class="product-modal-title">${product.name}</h2>
        <div class="product-modal-price">$${product.price}</div>
        <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.65;">
          ${product.description}
        </p>

        <!-- Lifecycle Data Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">CO₂ Avoided</div>
            <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--accent-neon);">${product.co2Saved}</div>
          </div>
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Waste Diverted</div>
            <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--accent-neon);">${product.wasteDiverted}</div>
          </div>
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Eco-Score</div>
            <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--accent-neon);">${product.sustainabilityScore}/100</div>
          </div>
        </div>

        <!-- Materials List -->
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Responsible Composition</div>
          <div class="product-modal-tags">
            ${product.materials.map(m => `<span class="product-modal-tag">🌿 ${m}</span>`).join('')}
          </div>
        </div>

        <!-- Certifications -->
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Certifications</div>
          <div class="product-modal-tags">
            ${product.certifications.map(c => `<span class="badge badge-dark">✓ ${c}</span>`).join('')}
          </div>
        </div>

        <!-- Customer Verified Reviews Snippet -->
        <div style="border-top: 1px dashed var(--border-subtle); padding-top: 14px;">
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-neon); text-transform: uppercase; margin-bottom: 10px;">
            Verified Community Feedback
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${reviews.map(r => `
              <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">${r.author} <small style="color: var(--text-muted); font-weight: normal;">(${r.location})</small></span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">${r.date}</span>
                </div>
                <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45;">"${r.text}"</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Related Sustainable Swaps -->
        <div style="border-top: 1px dashed var(--border-subtle); padding-top: 14px;">
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-neon); text-transform: uppercase; margin-bottom: 10px;">
            Related Sustainable Swaps
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            ${ECOMART_PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.rating === 5)).slice(0, 2).map(rel => `
              <div class="modal-related-item" data-rel-id="${rel.id}" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 10px; display: flex; gap: 10px; align-items: center; cursor: pointer; transition: all var(--transition-fast);">
                <img src="${rel.image}" alt="${rel.name}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;" />
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${rel.name}</div>
                  <div style="font-family: var(--font-display); font-size: 0.88rem; color: var(--accent-neon-bright); font-weight: 800;">$${rel.price}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="product-modal-actions">
          <div class="cart-qty-control" style="padding: 8px 14px;">
            <button class="cart-qty-btn" id="modal-qty-minus" style="font-size: 1.1rem;">−</button>
            <span class="cart-qty-value" id="modal-qty-val" style="font-size: 1.05rem; min-width: 28px;">1</span>
            <button class="cart-qty-btn" id="modal-qty-plus" style="font-size: 1.1rem;">+</button>
          </div>
          <button class="btn btn-primary" id="modal-add-to-cart-btn" style="flex: 1; padding: 16px;">
            Add to Eco-Cart • $${product.price}
          </button>
        </div>
      </div>
    `;

    // Modal quantity controls
    let modalQty = 1;
    const qtyValEl = document.getElementById('modal-qty-val');
    const modalAddBtn = document.getElementById('modal-add-to-cart-btn');

    document.getElementById('modal-qty-minus').addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        qtyValEl.textContent = modalQty;
        modalAddBtn.textContent = `Add to Eco-Cart • $${(product.price * modalQty).toFixed(2)}`;
      }
    });

    document.getElementById('modal-qty-plus').addEventListener('click', () => {
      modalQty++;
      qtyValEl.textContent = modalQty;
      modalAddBtn.textContent = `Add to Eco-Cart • $${(product.price * modalQty).toFixed(2)}`;
    });

    modalAddBtn.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.play('add-to-cart');
      window.ecomartStore.addToCart(product.id, modalQty);
      this.closeProductModal();
    });

    // Related items click handler
    modalBody.querySelectorAll('.modal-related-item').forEach(item => {
      item.addEventListener('click', () => {
        const relId = item.dataset.relId;
        const relProd = ECOMART_PRODUCTS.find(p => p.id === relId);
        if (relProd) {
          if (window.soundEffects) window.soundEffects.play('click');
          this.openProductModal(relProd);
        }
      });
    });

    this.productModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeProductModal() {
    if (this.productModal) {
      this.productModal.classList.remove('open');
      document.body.style.overflow = '';
      this.selectedProduct = null;
    }
  }

  renderProductPage(product) {
    if (!product) return;
    this.selectedProduct = product;

    const breadcrumbCat = document.getElementById('product-page-breadcrumb-cat');
    const breadcrumbName = document.getElementById('product-page-breadcrumb-name');
    const contentContainer = document.getElementById('product-page-content');
    const relatedContainer = document.getElementById('product-page-related-grid');

    if (breadcrumbCat) breadcrumbCat.textContent = product.category;
    if (breadcrumbName) breadcrumbName.textContent = product.name;

    const reviews = PRODUCT_REVIEWS[product.id] || [
      { author: 'Verified Pioneer', location: 'United States', rating: 5, date: 'Recently', text: 'Exceptional build quality and zero plastic footprint.' }
    ];

    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="product-page-gallery">
          <img class="product-page-main-img" src="${product.image}" alt="${product.name}" />
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-neon); text-transform: uppercase;">
              Verified Ecological Origin & Transparency
            </div>
            <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">
              📍 ${product.origin}
            </div>
            <div style="font-size: 0.88rem; color: var(--text-secondary);">
              📦 Packaging Audit: ${product.packaging}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              🛡️ Lifecycle Standard: 100% Recyclable / Bio-Degradable at end of life.
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <span class="badge badge-neon" style="font-size: 0.82rem; padding: 6px 14px;">${product.category}</span>
            ${renderLeafScore(product.rating)}
          </div>

          <div>
            <h1 style="font-size: 2.4rem; font-weight: 900; line-height: 1.15; color: var(--text-primary); margin-bottom: 8px;">${product.name}</h1>
            <p style="font-family: var(--font-mono); font-size: 0.88rem; color: var(--accent-neon); letter-spacing: 0.05em;">
              ${product.tagline}
            </p>
          </div>

          <div style="display: flex; align-items: baseline; gap: 12px;">
            <span style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; color: var(--accent-neon-bright);">$${product.price}</span>
            <span style="font-family: var(--font-mono); font-size: 0.84rem; color: var(--text-muted);">Tax included • Carbon-Neutral shipping</span>
          </div>

          <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7;">
            ${product.description}
          </p>

          <!-- Impact Metrics Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; background: rgba(0, 0, 0, 0.35); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px;">
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">CO₂ Avoided</div>
              <div style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: var(--accent-neon);">${product.co2Saved}</div>
            </div>
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Waste Diverted</div>
              <div style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: var(--accent-neon);">${product.wasteDiverted}</div>
            </div>
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Eco-Score</div>
              <div style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: var(--accent-neon);">${product.sustainabilityScore}/100</div>
            </div>
          </div>

          <!-- Materials -->
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px;">Responsible Composition</div>
            <div class="product-modal-tags">
              ${product.materials.map(m => `<span class="product-modal-tag" style="padding: 6px 14px; font-size: 0.82rem;">🌿 ${m}</span>`).join('')}
            </div>
          </div>

          <!-- Certifications -->
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px;">Audited Certifications</div>
            <div class="product-modal-tags">
              ${product.certifications.map(c => `<span class="badge badge-dark" style="padding: 6px 14px; font-size: 0.82rem;">✓ ${c}</span>`).join('')}
            </div>
          </div>

          <!-- Add to Cart Controls -->
          <div style="display: flex; align-items: center; gap: 16px; margin-top: 10px;">
            <div class="cart-qty-control" style="padding: 10px 18px;">
              <button class="cart-qty-btn" id="page-qty-minus" style="font-size: 1.2rem;">−</button>
              <span class="cart-qty-value" id="page-qty-val" style="font-size: 1.15rem; min-width: 32px;">1</span>
              <button class="cart-qty-btn" id="page-qty-plus" style="font-size: 1.2rem;">+</button>
            </div>
            <button class="btn btn-primary" id="page-add-to-cart-btn" style="flex: 1; padding: 18px; font-size: 1.05rem;">
              Add to Eco-Cart • $${product.price}
            </button>
          </div>

          <!-- Verified Community Reviews -->
          <div style="border-top: 1px dashed var(--border-subtle); padding-top: 20px; margin-top: 10px;">
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent-neon); text-transform: uppercase; margin-bottom: 14px;">
              Verified Pioneer Community Feedback
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${reviews.map(r => `
                <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px 18px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary);">${r.author} <small style="color: var(--text-muted); font-weight: normal;">(${r.location})</small></span>
                    <span style="font-size: 0.76rem; color: var(--text-muted);">${r.date}</span>
                  </div>
                  <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">"${r.text}"</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Page quantity controls
      let pageQty = 1;
      const qtyValEl = document.getElementById('page-qty-val');
      const pageAddBtn = document.getElementById('page-add-to-cart-btn');

      document.getElementById('page-qty-minus').addEventListener('click', () => {
        if (pageQty > 1) {
          pageQty--;
          qtyValEl.textContent = pageQty;
          pageAddBtn.textContent = `Add to Eco-Cart • $${(product.price * pageQty).toFixed(2)}`;
        }
      });

      document.getElementById('page-qty-plus').addEventListener('click', () => {
        pageQty++;
        qtyValEl.textContent = pageQty;
        pageAddBtn.textContent = `Add to Eco-Cart • $${(product.price * pageQty).toFixed(2)}`;
      });

      pageAddBtn.addEventListener('click', () => {
        if (window.soundEffects) window.soundEffects.play('add-to-cart');
        window.ecomartStore.addToCart(product.id, pageQty);
      });
    }

    // Render related products
    if (relatedContainer) {
      const related = ECOMART_PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.rating === 5)).slice(0, 3);
      relatedContainer.innerHTML = related.map(p => this.renderProductCard(p)).join('');
      this.attachCardEventListeners(relatedContainer);
    }
  }

  renderProductCard(product) {
    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-img-wrapper">
          <img class="product-card-img" src="${product.image}" alt="${product.name}" loading="lazy" />
          <span class="badge badge-neon product-card-badge">${product.category}</span>
          <div class="product-price-tag">$${product.price}</div>
        </div>
        <div class="product-card-info">
          <div class="product-card-rating-row">
            ${renderLeafScore(product.rating)}
            <span class="badge badge-dark" style="font-size: 0.7rem;">${product.sustainabilityScore}% Eco</span>
          </div>
          <h3 class="product-card-name">${product.name}</h3>
          <p class="product-card-tagline">${product.tagline}</p>
          <div class="product-card-metric">
            <span>🌱</span> <span>Replaces: ${product.replaces}</span>
          </div>
        </div>
        <div class="product-card-actions">
          <button class="btn btn-primary quick-add-btn" data-product-id="${product.id}" title="Quick Add">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }

  attachCardEventListeners(container) {
    const store = window.ecomartStore;
    container.querySelectorAll('.product-card').forEach(card => {
      const prodId = card.dataset.productId;
      const product = ECOMART_PRODUCTS.find(p => p.id === prodId);
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.quick-add-btn')) {
          if (window.soundEffects) window.soundEffects.play('click');
          if (product) this.openProductModal(product);
        }
      });

      const quickAddBtn = card.querySelector('.quick-add-btn');
      if (quickAddBtn) {
        quickAddBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.soundEffects) window.soundEffects.play('add-to-cart');
          store.addToCart(prodId, 1);
        });
      }
    });
  }
}

window.shopManager = null;
