/**
 * modules/projects-renderer.js
 * ─────────────────────────────────────────────────────────
 * Purpose : Reads PROJECTS data and renders project cards
 *           into #projects-grid.  Keeps projects.html clean
 *           (no hardcoded HTML cards).
 *
 * Why data-driven? Updating a project means editing the data
 * array once — not hunting through HTML markup.
 *
 * Author  : Lungani Zungu
 * ─────────────────────────────────────────────────────────
 */

import { PROJECTS } from '../data/projects.js';

/**
 * Build the bar-chart SVG silhouette for a project banner.
 * @param {number[]} heights - Array of 8 percentage heights
 * @returns {string} HTML string for .pv-bars
 */
const buildBars = (heights) =>
  `<div class="pv-bars" aria-hidden="true">
    ${heights.map((h) => `<span style="height:${h}%"></span>`).join('')}
  </div>`;

/**
 * Build tech tag pills from an array of technology strings.
 * @param {string[]} techList
 * @returns {string} HTML string
 */
const buildTechTags = (techList) =>
  techList.map((t) => `<span class="tech-tag">${t}</span>`).join('');

/**
 * Build link buttons for a project card.
 * @param {Object[]} links
 * @returns {string} HTML string
 */
const buildLinks = (links) =>
  links
    .map(({ label, href, external }) => {
      if (!href) {
        // Non-clickable badge (e.g. "Internal System")
        return `<span class="project-link-btn" aria-label="Internal system — not publicly accessible">${label}</span>`;
      }
      const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${target} class="project-link-btn">${label}</a>`;
    })
    .join('');

/**
 * Build an optional hackathon badge for the project title.
 * @param {string|undefined} badge
 * @returns {string} HTML string (empty if no badge)
 */
const buildBadge = (badge) =>
  badge
    ? `<span style="font-size:0.75rem;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);color:#f97316;padding:0.2rem 0.6rem;border-radius:12px;margin-left:0.5rem;vertical-align:middle;">${badge}</span>`
    : '';

/**
 * Render a single project as an HTML card string.
 * @param {import('../data/projects.js').Project} project
 * @returns {string} Complete project card HTML
 */
const buildProjectCard = (project) => `
  <article class="project-card" aria-label="${project.title}">
    <div class="project-visual ${project.visualClass}">
      ${buildBars(project.bars)}
      <span class="pv-icon" aria-hidden="true">${project.icon}</span>
    </div>

    <h3 class="project-title">
      ${project.title}${buildBadge(project.badge)}
    </h3>

    <p class="project-label">The ${project.status === 'in-development' ? 'Challenge' : 'Problem'}</p>
    <p class="project-description">${project.problem}</p>

    <p class="project-label">The Solution</p>
    <p class="project-description" style="margin-bottom:0;">${project.solution}</p>

    <p class="project-result" ${project.resultStyle ? `style="${project.resultStyle}"` : ''}>
      ${project.result} <span>· ${project.resultExtra.replace('· ', '')}</span>
    </p>

    <div class="project-tech">${buildTechTags(project.tech)}</div>

    <div class="project-links">${buildLinks(project.links)}</div>
  </article>
`;

/**
 * Mount all project cards into the #projects-grid container.
 * Fails silently when the container is absent (other pages).
 */
export function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map(buildProjectCard).join('');
}
