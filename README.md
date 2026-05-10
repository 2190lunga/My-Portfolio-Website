# Lungani Zungu — Portfolio Website

> **Software Engineer · AWS Serverless · React · Node.js · Python**
> Production-grade portfolio site built with semantic HTML5, modular CSS, and vanilla ES Modules.

[![Live Site](https://img.shields.io/badge/Live-2190lunga.github.io-a855f7?style=flat-square&logo=github)](https://2190lunga.github.io/My-Portfolio-Website/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Screenshot

> _Place a screenshot or screen recording here once deployed._
> Suggested tool: [Lightshot](https://app.prntscr.com/) or [Gyazo](https://gyazo.com/)

---

## Features

| Feature | Detail |
|---|---|
| **Data-driven projects** | 9 project cards rendered from a JS array — add a project by editing one object |
| **Modular CSS** | Split into `base.css` (tokens), `layout.css` (structure), `components.css` (UI) |
| **ES Module JS** | `app.js` imports from `nav.js`, `analytics.js`, `contact.js`, and renderer modules |
| **Semantic HTML5** | `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` — no div soup |
| **CSS custom properties** | All colours/transitions defined as variables — single-file theming |
| **BEM naming** | `.btn`, `.btn--secondary`, `.project-card`, `.project-card__title` pattern |
| **Responsive design** | Mobile-first breakpoints at 768px and 480px |
| **Contact form** | Submits to Google Apps Script — zero server cost, lands in Gmail |
| **Analytics** | localStorage session tracking + Google Apps Script event log |
| **Honeypot anti-spam** | Hidden `#website` field silently blocks bots |
| **SEO meta tags** | Open Graph + Twitter Card on every page |
| **Favicon** | SVG favicon with "LZ" gradient initials |
| **Sitemap + robots.txt** | Correct priority weighting, analytics page excluded from crawl |

---

## File Structure

```
my-portfolio-website/
+-- index.html             # Home — hero, stats, what I do, testimonials
+-- about.html             # Experience timeline + education + tech stack
+-- projects.html          # 9 production project cards (data-driven)
+-- case-studies.html      # 3 deep-dive case studies with metrics
+-- blog.html              # 6 article preview cards
+-- contact.html           # Contact form (Google Apps Script backend)
+-- analytics.html         # Site analytics dashboard (private)
¦
+-- assets/
¦   +-- css/
¦   ¦   +-- styles.css     ? Entry point (@imports the three modules below)
¦   ¦   +-- base.css       ? Design tokens, CSS variables, reset, animations
¦   ¦   +-- layout.css     ? Nav, hero, page grid, footer, responsive
¦   ¦   +-- components.css ? Buttons, cards, forms, project visuals
¦   ¦
¦   +-- js/
¦   ¦   +-- app.js         ? ES Module entry point (imports all modules)
¦   ¦   +-- data/
¦   ¦   ¦   +-- projects.js      ? Source-of-truth array of 9 project objects
¦   ¦   ¦   +-- testimonials.js  ? Source-of-truth array of testimonials
¦   ¦   +-- modules/
¦   ¦       +-- nav.js               ? Active nav link + mobile menu
¦   ¦       +-- analytics.js         ? Session tracking + backend reporting
¦   ¦       +-- contact.js           ? Form submission + honeypot
¦   ¦       +-- projects-renderer.js ? Builds project cards from data array
¦   ¦       +-- testimonials-renderer.js ? Builds testimonial cards
¦   ¦
¦   +-- files/
¦   ¦   +-- Lungani_Zungu_CV.pdf  ? Place your PDF here
¦   +-- images/
¦   ¦   +-- profile.jpg
¦   ¦   +-- favicon.svg
¦   ¦   +-- og-image.svg
¦   +-- backend/
¦       +-- server.js      ? Express static file server (local dev only)
¦       +-- package.json
¦
+-- sitemap.xml
+-- robots.txt
+-- README.md
```

---

## How to Run Locally

### Requirements
- [Node.js 18+](https://nodejs.org/)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/2190lunga/My-Portfolio-Website.git
cd My-Portfolio-Website

# 2. Install backend dependencies
cd assets/backend
npm install

# 3. Start the server
node server.js

# 4. Open in browser
# http://localhost:5000
```

> **Note:** The site uses ES Modules (`type="module"`) — it must be served over HTTP, not opened as a file:// URL.

---

## Adding or Updating a Project

Edit **one object** in `assets/js/data/projects.js`. The DOM rebuilds automatically.

```js
// assets/js/data/projects.js
{
  id:           'my-new-project',
  icon:         '??',
  visualClass:  'pv-workforce',   // CSS colour theme
  bars:         [40, 70, 55, 90, 65, 80, 50, 75],  // banner chart heights
  title:        'My New Project',
  status:       'live',           // 'live' | 'in-development'
  problem:      'What problem did you solve?',
  solution:     'How did you solve it?',
  result:       '? Key metric here',
  resultExtra:  '· Supporting detail',
  tech:         ['React', 'AWS Lambda'],
  links:        [{ label: '?? Internal System', href: null }],
},
```

---

## Deployment (GitHub Pages)

```bash
git add .
git commit -m "feat: update portfolio"
git push origin main
```

Then in GitHub ? Settings ? Pages ? Source: `main` branch ? `/` (root).

Live URL: `https://2190lunga.github.io/My-Portfolio-Website/`

---

## Pending Setup

| Item | Action required |
|---|---|
| **CV PDF** | Place `Lungani_Zungu_CV.pdf` in `assets/files/` |
| **Profile photo** | Place `profile.jpg` in `assets/images/` |
| **GA4 ID** | Replace `G-XXXXXXXXXX` in all HTML files with your real Measurement ID |
| **Custom domain** | Add `CNAME` file with your domain; configure in GitHub Pages settings |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 · CSS3 (custom properties, grid, flexbox) · Vanilla JS (ES2022 modules) |
| Fonts | Outfit · JetBrains Mono (Google Fonts) |
| Backend (local) | Node.js · Express (static file server only) |
| Contact | Google Apps Script (free, no server) |
| Analytics | localStorage + Google Apps Script event log |
| Hosting target | GitHub Pages |

---

## Coding Standards Applied

- **Single Responsibility**: each JS file has one job
- **No magic numbers**: all colours and values are CSS custom properties
- **BEM class naming**: `.btn`, `.btn--secondary`, `.project-card`
- **Semantic HTML5**: `<section>`, `<article>`, `<main>`, `<footer>` — no div soup
- **Data-driven rendering**: project cards and testimonials built from data arrays
- **Comments explain *why*, not what**: inline comments justify decisions

---

*© 2026 Lungani Zungu*
