/**
 * ECOMART — About Philosophy, Accordion & Capsule Action Modals
 * Handles expandable sustainability principles, email subscription, and member login modals.
 */

class AboutManager {
  constructor() {
    this.accordionContainer = document.getElementById('sustainability-accordion-container');
    this.emailModal = document.getElementById('email-modal-backdrop');
    this.loginModal = document.getElementById('login-modal-backdrop');

    this.initAccordion();
    this.initModals();
  }

  initAccordion() {
    if (!this.accordionContainer) return;

    this.accordionContainer.innerHTML = SUSTAINABILITY_PRINCIPLES.map((item, idx) => `
      <div class="accordion-item ${idx === 0 ? 'active' : ''}" data-id="${item.id}">
        <button class="accordion-trigger" aria-expanded="${idx === 0 ? 'true' : 'false'}">
          <div class="accordion-title-wrapper">
            <span class="accordion-index">0${idx + 1}</span>
            <div>
              <h3 class="accordion-title">${item.title}</h3>
              <div class="accordion-subtitle">${item.subtitle}</div>
            </div>
          </div>
          <div class="accordion-icon-badge">
            <svg style="width: 20px; height: 20px; fill: currentColor;" viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </div>
        </button>
        <div class="accordion-content">
          <p class="accordion-body-text">${item.content}</p>
        </div>
      </div>
    `).join('');

    // Attach click triggers
    this.accordionContainer.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const isActive = item.classList.contains('active');

        // Toggle state
        item.classList.toggle('active', !isActive);
        trigger.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      });
    });
  }

  initModals() {
    // Open Email modal
    const emailTriggerBtn = document.getElementById('capsule-email-btn');
    if (emailTriggerBtn && this.emailModal) {
      emailTriggerBtn.addEventListener('click', () => this.openModal(this.emailModal));
    }

    // Close Email modal
    const emailCloseBtn = document.getElementById('email-modal-close-btn');
    if (emailCloseBtn && this.emailModal) {
      emailCloseBtn.addEventListener('click', () => this.closeModal(this.emailModal));
    }

    // Email Form submit
    const emailForm = document.getElementById('email-newsletter-form');
    if (emailForm) {
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletter-email-input');
        const email = input ? input.value : '';

        const modalBody = document.getElementById('email-modal-content');
        if (modalBody) {
          modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px 0; display: flex; flex-direction: column; align-items: center; gap: 14px;">
              <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(0, 255, 136, 0.15); border: 2px solid var(--accent-neon); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px var(--accent-neon);">
                <svg style="width: 28px; height: 28px; fill: var(--accent-neon);" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C22 3 10 4 6.66 9.47L8.2 10.42C10.74 6.75 17 8 17 8Z"/>
                </svg>
              </div>
              <h3 style="font-size: 1.6rem; font-weight: 800;">You're on the list. 🌿</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem;">
                A confirmation has been sent to <strong>${email}</strong>. 1 mangrove seedling has been queued for planting in your name!
              </p>
              <div style="background: var(--bg-surface-elevated); border: 1px solid var(--accent-neon); border-radius: var(--radius-md); padding: 12px 20px; font-family: var(--font-mono); color: var(--accent-neon-bright); font-weight: 700;">
                Promo Code: ECOFUTURE10 (10% Off)
              </div>
              <button class="btn btn-primary" id="email-done-btn" style="width: 100%; margin-top: 10px;">
                Got it
              </button>
            </div>
          `;

          document.getElementById('email-done-btn').addEventListener('click', () => {
            this.closeModal(this.emailModal);
          });
        }
      });
    }

    // Open Login modal
    const loginTriggerBtn = document.getElementById('capsule-login-btn');
    if (loginTriggerBtn && this.loginModal) {
      loginTriggerBtn.addEventListener('click', () => this.openModal(this.loginModal));
    }

    // Close Login modal
    const loginCloseBtn = document.getElementById('login-modal-close-btn');
    if (loginCloseBtn && this.loginModal) {
      loginCloseBtn.addEventListener('click', () => this.closeModal(this.loginModal));
    }

    // Continue as guest button
    const guestBtn = document.getElementById('login-guest-btn');
    if (guestBtn) {
      guestBtn.addEventListener('click', () => {
        this.closeModal(this.loginModal);
        window.ecomartStore.notify('toast', {
          type: 'success',
          message: 'Browsing as Eco Guest. Enjoy the marketplace! 🌿'
        });
        window.ecomartStore.setActiveTab('shop');
      });
    }

    // Login Form submit (Demo authentication)
    const loginForm = document.getElementById('member-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const modalBody = document.getElementById('login-modal-content');
        if (modalBody) {
          modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px 0; display: flex; flex-direction: column; align-items: center; gap: 14px;">
              <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(0, 255, 136, 0.15); border: 2px solid var(--accent-neon); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px var(--accent-neon);">
                <svg style="width: 28px; height: 28px; fill: var(--accent-neon);" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 style="font-size: 1.6rem; font-weight: 800;">Welcome, Eco Pioneer!</h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem;">
                Logged in successfully. Your lifetime swap history & zero-waste telemetry are now actively synced.
              </p>
              <div style="display: flex; gap: 10px; width: 100%; margin-top: 10px;">
                <button class="btn btn-primary" id="login-done-btn" style="flex: 1;">
                  Enter Marketplace
                </button>
              </div>
            </div>
          `;

          document.getElementById('login-done-btn').addEventListener('click', () => {
            this.closeModal(this.loginModal);
            window.ecomartStore.setActiveTab('shop');
          });
        }
      });
    }

    // Backdrop click close
    [this.emailModal, this.loginModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeModal(modal);
          }
        });
      }
    });
  }

  openModal(modal) {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
}

window.aboutManager = null;
