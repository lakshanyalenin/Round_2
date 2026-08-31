/**
 * ECOMART — Impact Visualization & Personal Savings Calculator
 * Handles viewport animated counters, interactive bottle HUD, and real-time calculator.
 */

class ImpactManager {
  constructor() {
    this.hasAnimatedStats = false;
    this.initCounters();
    this.initBottleVisualization();
    this.initCalculator();
  }

  // Viewport-triggered count-up animation
  initCounters() {
    const counterElements = document.querySelectorAll('.stat-number-animated');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimatedStats) {
          this.hasAnimatedStats = true;
          counterElements.forEach(el => this.animateCountUp(el));
        }
      });
    }, { threshold: 0.25 });

    const impactSection = document.getElementById('view-impact') || document.querySelector('.impact-metrics-grid');
    if (impactSection) {
      observer.observe(impactSection);
    }
  }

  animateCountUp(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const isPercent = el.dataset.unit === '%';
    const isKg = el.dataset.unit === 'kg';
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      if (isPercent) {
        el.textContent = `${current}%`;
      } else if (isKg) {
        el.textContent = `${current.toLocaleString()} kg`;
      } else {
        el.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isPercent) el.textContent = `${target}%`;
        else if (isKg) el.textContent = `${target.toLocaleString()} kg`;
        else el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(update);
  }

  // Interactive Futuristic Bottle HUD
  initBottleVisualization() {
    const layerBtns = document.querySelectorAll('.bottle-layer-btn');
    const bottleFill = document.getElementById('bottle-liquid-rect');
    const bottleStatusText = document.getElementById('bottle-status-readout');

    if (!layerBtns.length || !bottleFill) return;

    const layerStates = {
      all: { height: '78%', color: 'url(#neon-liquid-grad)', label: 'GLOBAL RETENTION 78%' },
      co2: { height: '88%', color: 'url(#co2-liquid-grad)', label: 'CO₂ AVOIDANCE 88%' },
      plastic: { height: '65%', color: 'url(#ocean-liquid-grad)', label: 'OCEAN DIVERSION 65%' },
      waste: { height: '52%', color: 'url(#waste-liquid-grad)', label: 'LANDFILL PREVENTION 52%' }
    };

    layerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        layerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.dataset.mode || 'all';
        const state = layerStates[mode] || layerStates.all;

        bottleFill.style.height = state.height;
        bottleFill.setAttribute('fill', state.color);
        if (bottleStatusText) {
          bottleStatusText.textContent = state.label;
        }
      });
    });
  }

  // Personal Impact Calculator
  initCalculator() {
    const bottleSlider = document.getElementById('calc-bottles');
    const bagSlider = document.getElementById('calc-bags');
    const cupSlider = document.getElementById('calc-cups');

    const bottleValEl = document.getElementById('calc-bottles-val');
    const bagValEl = document.getElementById('calc-bags-val');
    const cupValEl = document.getElementById('calc-cups-val');

    const co2ResultEl = document.getElementById('calc-co2-result');
    const plasticResultEl = document.getElementById('calc-plastic-result');
    const treesResultEl = document.getElementById('calc-trees-result');

    if (!bottleSlider || !bagSlider || !cupSlider) return;

    const calculate = () => {
      const bottles = parseInt(bottleSlider.value, 10);
      const bags = parseInt(bagSlider.value, 10);
      const cups = parseInt(cupSlider.value, 10);

      if (bottleValEl) bottleValEl.textContent = `${bottles} / wk`;
      if (bagValEl) bagValEl.textContent = `${bags} / wk`;
      if (cupValEl) cupValEl.textContent = `${cups} / wk`;

      // Annualized calculations
      const annualBottles = bottles * 52;
      const annualBags = bags * 52;
      const annualCups = cups * 52;

      // Factors:
      // 1 bottle ≈ 0.0828 kg CO2 & 1 plastic unit
      // 1 bag ≈ 0.033 kg CO2 & 1 plastic unit
      // 1 cup ≈ 0.11 kg CO2 & 1 plastic unit
      const totalCO2Kg = (annualBottles * 0.0828) + (annualBags * 0.033) + (annualCups * 0.11);
      const totalPlasticUnits = annualBottles + annualBags + annualCups;
      const treesEquivalent = (totalCO2Kg / 21.77).toFixed(1); // 1 mature tree absorbs ~21.77 kg CO2/yr

      if (co2ResultEl) co2ResultEl.textContent = `${Math.round(totalCO2Kg)} kg`;
      if (plasticResultEl) plasticResultEl.textContent = `${totalPlasticUnits.toLocaleString()}`;
      if (treesResultEl) treesResultEl.textContent = `${treesEquivalent}`;
    };

    bottleSlider.addEventListener('input', calculate);
    bagSlider.addEventListener('input', calculate);
    cupSlider.addEventListener('input', calculate);

    calculate(); // Initial run
  }
}

window.impactManager = null;
