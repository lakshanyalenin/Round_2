/**
 * ECOMART — Custom Leaf Cursor Controller
 * Provides smooth magnetic leaf follower and trailing glow with touch fallbacks.
 */

class LeafCursor {
  constructor() {
    this.follower = document.getElementById('custom-cursor-follower');
    this.trail = document.getElementById('cursor-trail-dot');

    this.mouseX = -100;
    this.mouseY = -100;
    this.followerX = -100;
    this.followerY = -100;
    this.trailX = -100;
    this.trailY = -100;

    this.isVisible = false;
    this.isHovering = false;

    // Check touch screen
    if (window.matchMedia('(pointer: coarse)').matches) {
      return; // disable on touch
    }

    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        if (this.follower) this.follower.classList.add('visible');
        if (this.trail) this.trail.classList.add('visible');
      }
    });

    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      if (this.follower) this.follower.classList.remove('visible');
      if (this.trail) this.trail.classList.remove('visible');
    });

    // Detect hoverable elements
    const interactiveSelectors = 'a, button, .product-card, .benefit-card, .story-card, .accordion-trigger, input, select, .carousel-dot, .capsule-btn';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        this.isHovering = true;
        if (this.follower) this.follower.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        this.isHovering = false;
        if (this.follower) this.follower.classList.remove('hovering');
      }
    });

    this.renderLoop();
  }

  renderLoop() {
    // Lerp follower (snappy)
    this.followerX += (this.mouseX - this.followerX) * 0.22;
    this.followerY += (this.mouseY - this.followerY) * 0.22;

    // Lerp trail (subtle delay)
    this.trailX += (this.mouseX - this.trailX) * 0.12;
    this.trailY += (this.mouseY - this.trailY) * 0.12;

    if (this.follower) {
      this.follower.style.left = `${this.followerX}px`;
      this.follower.style.top = `${this.followerY}px`;
    }

    if (this.trail) {
      this.trail.style.left = `${this.trailX}px`;
      this.trail.style.top = `${this.trailY}px`;
    }

    requestAnimationFrame(() => this.renderLoop());
  }
}

window.leafCursor = null;
