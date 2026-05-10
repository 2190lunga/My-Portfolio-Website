/**
 * modules/nav.js
 * ─────────────────────────────────────────────────────────
 * Purpose : Navigation concerns only.
 *           - Sets the active link based on current page
 *           - Toggles the mobile hamburger menu
 *
 * Author  : Lungani Zungu
 * ─────────────────────────────────────────────────────────
 */

/** Map from filename to data-page attribute value */
const PAGE_MAP = {
  'index.html':        'home',
  'about.html':        'about',
  'projects.html':     'projects',
  'case-studies.html': 'case-studies',
  'blog.html':         'blog',
  'contact.html':      'contact',
  'analytics.html':    'analytics',
};

/**
 * Derive the current page name from the URL pathname.
 * Falls back to 'home' for the root path.
 * @returns {string} Page name (e.g. 'projects')
 */
export function getCurrentPageName() {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  return (PAGE_MAP[file] ?? file.replace('.html', '')) || 'home';
}

/**
 * Add `.active` class to the nav link matching the current page.
 * Uses data-page attributes so it works with any URL structure.
 */
export function setActiveNav() {
  const activeKey = getCurrentPageName();
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === activeKey);
  });
}

/**
 * Wire up the mobile hamburger toggle.
 * Toggles the `.active` class on #navLinks.
 */
export function initMobileMenu() {
  const btn      = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!btn || !navLinks) return;

  btn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    // Accessibility: reflect open/closed state
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu on nav link click (mobile UX)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}
