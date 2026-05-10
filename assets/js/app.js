/**
 * app.js  -  Application Entry Point
 * Purpose : Boots the application by importing and calling
 *           initialisation functions from feature modules.
 *           This file deliberately contains NO logic --
 *           every concern lives in its own module.
 *
 * Module map:
 *   nav.js                -> navigation active state + mobile menu
 *   analytics.js          -> local session tracking + remote events
 *   contact.js            -> contact form submission
 *   projects-renderer.js  -> data-driven project cards
 *   testimonials-renderer.js -> data-driven testimonial cards
 *
 * Author  : Lungani Zungu
 */

import { setActiveNav, initMobileMenu, getCurrentPageName } from './modules/nav.js';
import { Analytics }                                         from './modules/analytics.js';
import { initContactForm }                                   from './modules/contact.js';
import { renderProjects }                                    from './modules/projects-renderer.js';
import { renderTestimonials }                                from './modules/testimonials-renderer.js';

function initCvDownload(analytics) {
  const CV_PATH = 'assets/files/Lungani_Zungu_CV.pdf';
  const attemptDownload = (event) => {
    if (event) event.preventDefault();
    analytics.trackAction('cv_download');
    fetch(CV_PATH, { method: 'HEAD' })
      .then((res) => {
        const a = Object.assign(document.createElement('a'), { href: CV_PATH, download: 'Lungani_Zungu_CV.pdf' });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      })
      .catch(() => {
        const a = Object.assign(document.createElement('a'), { href: CV_PATH, download: 'Lungani_Zungu_CV.pdf' });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      });
  };
  document.getElementById('downloadCV')?.addEventListener('click', attemptDownload);
  document.getElementById('downloadCVBtn')?.addEventListener('click', attemptDownload);
}

function initProjectTracking(analytics) {
  document.querySelectorAll('[data-project]').forEach((card) => {
    card.addEventListener('click', () =>
      analytics.trackAction('project_click', card.dataset.project)
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileMenu();
  renderProjects();
  renderTestimonials();
  const analytics = new Analytics();
  analytics.trackPageView(getCurrentPageName());
  analytics.updateDashboard();
  analytics.loadGlobalStats();
  initCvDownload(analytics);
  initProjectTracking(analytics);
  initContactForm(analytics);
});
