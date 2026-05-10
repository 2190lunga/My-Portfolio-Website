/**
 * modules/testimonials-renderer.js
 * ─────────────────────────────────────────────────────────
 * Purpose : Reads TESTIMONIALS data and renders cards into
 *           #testimonials-grid on index.html.
 *
 * Author  : Lungani Zungu
 * ─────────────────────────────────────────────────────────
 */

import { TESTIMONIALS } from '../data/testimonials.js';

/**
 * Render a single testimonial card.
 * @param {import('../data/testimonials.js').Testimonial} t
 * @returns {string} HTML string
 */
const buildCard = (t) => `
  <article class="stat-card" style="text-align:left; padding:2rem;" aria-label="Testimonial from ${t.role}">
    <p style="color:var(--color-text-secondary);font-size:1rem;line-height:1.8;font-style:italic;margin-bottom:1.2rem;">
      &ldquo;${t.quote}&rdquo;
    </p>
    <div style="display:flex;align-items:center;gap:0.8rem;">
      <div style="width:40px;height:40px;background:var(--gradient-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;" aria-hidden="true">
        ${t.initials}
      </div>
      <div>
        <div style="color:#fff;font-weight:600;font-size:0.9rem;">${t.role}</div>
        <div style="color:var(--color-text-secondary);font-size:0.8rem;">${t.org}</div>
      </div>
    </div>
  </article>
`;

/**
 * Mount all testimonial cards into #testimonials-grid.
 * Fails silently when the container is absent (other pages).
 */
export function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  grid.innerHTML = TESTIMONIALS.map(buildCard).join('');
}
