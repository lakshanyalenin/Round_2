/**
 * ECOMART — Editor's Selection / Featured Sustainable Picks Carousel
 * Handles dynamic carousel rendering, transitions, autoplay, and swipe controls.
 */

class FeaturedCarousel {
  constructor() {
    this.container = document.getElementById('featured-carousel-container');
    this.slidesWrapper = document.getElementById('carousel-slides-wrapper');
    this.dotsWrapper = document.getElementById('carousel-dots-wrapper');
    this.prevBtn = document.getElementById('carousel-prev-btn');
    this.nextBtn = document.getElementById('carousel-next-btn');

    // Get 5-leaf featured picks
    this.featuredProducts = ECOMART_PRODUCTS.filter(p => p.isFeatured && p.rating === 5);
    this.currentIndex = 0;
    this.timer = null;

    if (this.featuredProducts.length > 0) {
      this.init();
    }
  }

  init() {
    this.renderSlides();
    this.renderDots();
    this.initEventListeners();
    this.showSlide(0);
    this.startAutoplay();
  }

  renderSlides() {
    if (!this.slidesWrapper) return;

    this.slidesWrapper.innerHTML = this.featuredProducts.map((prod, idx) => `
      <div class="carousel-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div class="carousel-img-wrapper">
          <img class="carousel-img" src="${prod.image}" alt="${prod.name}" />
        </div>
        <div class="carousel-content">
          <div class="carousel-badge-row">
            <span class="badge badge-neon">Editor's Selection</span>
            <span class="badge badge-dark">${prod.category}</span>
            ${renderLeafScore(prod.rating, false)}
          </div>
          <h3 class="carousel-title">${prod.name}</h3>
          <div class="carousel-quote">"${prod.editorQuote || prod.tagline}"</div>
          <p class="carousel-desc">${prod.description}</p>
          
          <div class="carousel-metrics-grid">
            <div class="carousel-metric-unit">
              <span class="carousel-metric-label">CO₂ Offset</span>
              <span class="carousel-metric-val">${prod.co2Saved}</span>
            </div>
            <div class="carousel-metric-unit">
              <span class="carousel-metric-label">Circularity</span>
              <span class="carousel-metric-val">${prod.sustainabilityScore}%</span>
            </div>
            <div class="carousel-metric-unit">
              <span class="carousel-metric-label">Price</span>
              <span class="carousel-metric-val">$${prod.price}</span>
            </div>
          </div>

          <div style="display: flex; gap: 14px; margin-top: 10px;">
            <button class="btn btn-primary carousel-add-btn" data-product-id="${prod.id}">
              Add to Cart • $${prod.price}
            </button>
            <button class="btn btn-secondary carousel-inspect-btn" data-product-id="${prod.id}">
              Inspect Specs
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Add to cart & Inspect events
    this.slidesWrapper.querySelectorAll('.carousel-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.ecomartStore.addToCart(btn.dataset.productId, 1);
      });
    });

    this.slidesWrapper.querySelectorAll('.carousel-inspect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = `product.html?id=${btn.dataset.productId}`;
      });
    });
  }

  renderDots() {
    if (!this.dotsWrapper) return;
    this.dotsWrapper.innerHTML = this.featuredProducts.map((_, idx) => `
      <div class="carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
    `).join('');

    this.dotsWrapper.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        this.showSlide(parseInt(dot.dataset.index, 10));
        this.resetAutoplay();
      });
    });
  }

  initEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.resetAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.resetAutoplay();
      });
    }

    // Pause on hover
    if (this.container) {
      this.container.addEventListener('mouseenter', () => this.stopAutoplay());
      this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    if (this.container) {
      this.container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          this.next();
          this.resetAutoplay();
        } else if (touchEndX - touchStartX > 50) {
          this.prev();
          this.resetAutoplay();
        }
      }, { passive: true });
    }
  }

  showSlide(index) {
    this.currentIndex = (index + this.featuredProducts.length) % this.featuredProducts.length;

    const slides = this.slidesWrapper.querySelectorAll('.carousel-slide');
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === this.currentIndex);
    });

    const dots = this.dotsWrapper.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }

  next() {
    this.showSlide(this.currentIndex + 1);
  }

  prev() {
    this.showSlide(this.currentIndex - 1);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.timer = setInterval(() => {
      this.next();
    }, 6000);
  }

  stopAutoplay() {
    if (this.timer) clearInterval(this.timer);
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

window.featuredCarousel = null;
