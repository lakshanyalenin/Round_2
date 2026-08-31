# 🌿 Ecomart — Sustainable E-Commerce Platform

> **Hackathon Round 2 Submission**  
> **Theme:** Premium Dark Emerald Futurism + Neon Green Cyber-Tech

---

## 🌟 Overview

**Ecomart** is a high-end, production-grade sustainable e-commerce marketplace engineered for conscious pioneers. The platform bridges **closed-loop environmental accounting** with **futuristic cyberpunk-organic aesthetics**, featuring dynamic telemetry, real-time lifecycle carbon tracking, interactive data visualizations, and an audited catalog of 12 zero-waste essentials.

---

## 🚀 Key Features

### 1. 🎨 Visual Identity & Design System
- **Dark Emerald Futurism**: Deep obsidian backgrounds (`#060B08`), dark emerald panels (`#0E1E14`), radiant cyber-neon accents (`#00FF88`, `#10FFA0`), glassmorphism, and laser-grid HUD details.
- **Clean Botanical Luxury (Light Mode)**: Warm stone canvas (`#F7F9F6`) with deep forest accents (`#0F2419`) and persistent theme memory.
- **Custom Botanical Leaf Cursor**: Physics-based trailing leaf cursor with magnetic element pull and hover magnification (auto-disabled on touch devices).
- **Web Audio Micro-Synthesizer**: Zero-dependency pentatonic organic chimes synthesized on the fly for cart actions, checkout, and theme switches.

---

### 2. 🗺️ Multi-Page Architecture & Views

| Page | File | Key Features |
| :--- | :--- | :--- |
| **Complete Homepage** | `index.html` | • **Hero Section**: *Shop Better. Live Sustainably.* + floating Insulated Steel Bottle HUD card + 3 Sustainability Benefit cards.<br>• **Platform 12 Banner**: Live digital countdown timer (`HR : MIN : SEC`) + *Browse Now* CTA.<br>• **The Marketplace**: Full filter bar (Search, Category dropdown, Price slider $10–$150, Leaf filter pills) + 12 product cards.<br>• **Editor's Selection**: Featured Sustainable Picks auto-sliding carousel.<br>• **Impact Matrix**: 4 animated counters (24,580 kg CO₂, 18,420 bottles, 7,250 kg waste, 92%), interactive **Bottle HUD**, 3 impact stories, and **Personal Savings Calculator**.<br>• **About Philosophy**: 5 expandable animated accordions + *One Small Swap a Month* CTA with Email & Login capsules. |
| **Dedicated Marketplace** | `shop.html` | Standalone marketplace with live search query matching, all 11 category filters, sort selector, price range slider, full 12 product grid, and Editor's Selection carousel. |
| **Product Detail Page** | `product.html` | Standalone product view with category breadcrumbs, high-resolution photography, origin audit, lifecycle metrics, composition tags, certifications, verified pioneer reviews, quantity selector, Add to Eco-Cart, and related swaps grid. |
| **Impact Matrix** | `impact.html` | Standalone *What We've Saved Together* page with animated counter metrics, interactive **Bottle Sustainability Matrix HUD** with liquid wave animation, multi-layer switches (CO₂, Ocean Plastic, Landfill), and personal savings calculator. |
| **Sustainability Philosophy** | `about.html` | Standalone *What Makes Product Sustainability* editorial page with 5 smooth expandable accordions (Materials, Packaging, Manufacturing, Longevity, End of Life), and *One Small Swap a Month* CTA with working Email & Login modals. |

---

### 3. 🛍️ 12-Product Audited Catalog
1. **Bamboo Toothbrush** ($6) — 5 🌿 (98% Eco)
2. **Insulated Steel Bottle** ($24) — 5 🌿 (99% Eco)
3. **Organic Cotton Tote** ($18) — 4 🌿 (92% Eco)
4. **Recycled Ocean Bottle** ($28) — 5 🌿 (97% Eco)
5. **Plant-Based Cleaning Kit** ($32) — 5 🌿 (96% Eco)
6. **Cold-Pressed Soap Bar** ($8) — 4 🌿 (94% Eco)
7. **Recycled Paper Notebook** ($14) — 4 🌿 (91% Eco)
8. **Sustainable Sneakers** ($89) — 5 🌿 (99% Eco)
9. **Solar Power Band** ($45) — 5 🌿 (97% Eco)
10. **Solar Lantern** ($36) — 5 🌿 (98% Eco)
11. **Beeswax Foot Balm** ($12) — 4 🌿 (93% Eco)
12. **Bamboo Cutlery Set** ($16) — 5 🌿 (99% Eco)

---

### 4. 🛒 Interactive Workflows & Modals
- **Slide-Out Cart Drawer**: Live subtotal calculations, quantity mutations, item removal, cumulative CO₂/plastic order impact badge, free shipping progress bar, and carbon-neutral checkout.
- **Search Overlay** (`/` keyboard shortcut): Instant dynamic search with preview thumbnails and empty state.
- **Carbon-Neutral Checkout**: Detailed order confirmation certificate with one-click copyable Eco-Badge for social sharing.
- **Newsletter Modal**: *"Stay in the Loop"* with instant validation and discount voucher (`ECOFUTURE10`).
- **Member Login Modal**: Member login form and *"Continue as Guest"* action.

---

## 💻 Tech Stack

- **Markup**: Pure HTML5 (Semantic, SEO-optimized, Accessible)
- **Styling**: Vanilla CSS3 (Custom Design System, CSS Variables, Glassmorphism, Responsive Grid/Flexbox)
- **Logic**: Vanilla ES6+ JavaScript (State Store, LocalStorage Persistence, IntersectionObservers, Web Audio API)
- **Zero External Runtime Dependencies**: Instant loading, lightning-fast execution in any browser.

---

## 🏃 Local Setup & Running

To run locally using Python's built-in HTTP server:

```bash
# Clone the repository
git clone https://github.com/lakshanyalenin/Round_2.git
cd Round_2

# Start a local web server
python3 -m http.server 8080
```

Open your browser at:
👉 `http://localhost:8080/`

---

## 📁 Directory Structure

```
.
├── index.html              # Main full continuous homepage
├── shop.html               # Dedicated Marketplace page
├── product.html            # Dedicated Product Detail page
├── impact.html             # Dedicated Impact Matrix page
├── about.html              # Dedicated Philosophy & Principles page
├── assets/
│   └── images/             # Realistic studio photography for all 12 products
├── styles/
│   ├── main.css            # Design tokens, variables, typography, buttons, toasts
│   ├── navbar.css          # Header, navigation, search modal, cart drawer
│   ├── hero.css            # Hero section, floating HUD card, platform 12
│   ├── shop.css            # Filter toolbar, product cards, carousel, detail grid
│   ├── impact.css          # Animated stat cards, bottle HUD, savings calculator
│   ├── about.css           # Philosophy editorial layout, expandable accordion
│   └── cursor.css          # Custom botanical leaf cursor follower
├── js/
│   ├── data.js             # 12-product catalog, reviews, and principles
│   ├── state.js            # Reactive state store with localStorage sync
│   ├── cart.js             # Cart drawer, quantity adjustments, checkout flow
│   ├── shop.js             # Real-time filtering, product grid, detail view
│   ├── carousel.js         # Editor's selection auto-sliding carousel
│   ├── impact.js           # Count-up animations, bottle HUD, impact calculator
│   ├── about.js            # Accordion controls, newsletter and login modals
│   ├── sound.js            # Web Audio API organic harmonic synthesizer
│   ├── cursor.js           # Custom leaf cursor controller
│   └── app.js              # Master application bootstrapper & routing
└── README.md
```

---

## 📜 License
Certified B-Corporation Hackathon Demonstration • Built with 🌿 for a cleaner planet.
