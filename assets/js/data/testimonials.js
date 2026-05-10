/**
 * data/testimonials.js
 * ─────────────────────────────────────────────────────────
 * Purpose : Single source of truth for testimonial data.
 *           Adding a new testimonial = one new object here.
 *
 * Author  : Lungani Zungu
 * ─────────────────────────────────────────────────────────
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} initials  - Avatar initials (2 chars)
 * @property {string} quote     - The testimonial text
 * @property {string} role      - Person's job title
 * @property {string} org       - Organisation / department
 */

/** @type {Testimonial[]} */
export const TESTIMONIALS = [
  {
    initials: 'TL',
    quote:
      'Lungani\u2019s workforce management system completely transformed how our team leaders plan rotations. What used to take hours now takes minutes, and we have not had a single training mismatch since deployment.',
    role: 'Team Leader',
    org: 'Automotive Plant, Assembly Division',
  },
  {
    initials: 'SM',
    quote:
      'His ability to take a business problem, understand it deeply through shop floor engagement, and deliver a working solution within weeks is exceptional. The adoption rate speaks for itself.',
    role: 'Section Manager',
    org: 'Resource & Technology Steering',
  },
  {
    initials: 'ML',
    quote:
      'Lungani\u2019s data analysis directly contributed to a 25% reduction in call centre volume. He has a rare ability to translate complex data into actionable insights that leadership can act on immediately.',
    role: 'Manager',
    org: 'Financial Services Analytics',
  },
];
