/**
 * modules/analytics.js
 * ─────────────────────────────────────────────────────────
 * Purpose : All analytics logic — local session tracking
 *           (localStorage) and remote event reporting to
 *           the Google Apps Script backend.
 *
 * Why localStorage? It works without a database and lets
 * the site owner see basic stats even at zero cost.
 *
 * Author  : Lungani Zungu
 * ─────────────────────────────────────────────────────────
 */

import { getCurrentPageName } from './nav.js';

/** Google Apps Script deployment URL — single source of truth */
const BACKEND_URL =
  'https://script.google.com/macros/s/AKfycbw94sQMiRNEFG3ik3dmYocwV4g4GQEIYeujcVIXvqF0q7sc3pX-kTHNrZn1TOL-JiO3/exec';

/**
 * Fire-and-forget POST to the Google Apps Script backend.
 * Never blocks the UI — errors are swallowed intentionally.
 * @param {Object} payload
 */
async function postToBackend(payload) {
  try {
    await fetch(BACKEND_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body:    JSON.stringify(payload),
    });
  } catch {
    // Non-blocking — analytics must never break the page
  }
}

/** Default data shape stored in localStorage */
const DEFAULT_DATA = () => ({
  totalVisitors:   0,
  uniqueVisitors:  [],
  pageViews:       {},
  cvDownloads:     0,
  formSubmissions: 0,
  visitors:        [],
  projectClicks:   [],
  actions:         [],
  submissions:     [],
});

export class Analytics {
  #storageKey = 'portfolio_analytics';
  #sessionKey = 'portfolio_session';
  #data;
  sessionId;

  constructor() {
    this.#data     = this.#loadData();
    this.sessionId = this.#resolveSession();
  }

  /* ── Private helpers ─────────────────────────────────── */

  #loadData() {
    try {
      return JSON.parse(localStorage.getItem(this.#storageKey)) ?? DEFAULT_DATA();
    } catch {
      return DEFAULT_DATA();
    }
  }

  #save() {
    localStorage.setItem(this.#storageKey, JSON.stringify(this.#data));
  }

  #resolveSession() {
    let id = sessionStorage.getItem(this.#sessionKey);
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(this.#sessionKey, id);
      this.#trackNewVisitor(id);
    }
    return id;
  }

  #trackNewVisitor(id) {
    if (this.#data.uniqueVisitors.includes(id)) return;

    this.#data.uniqueVisitors.push(id);
    this.#data.totalVisitors++;
    this.#data.visitors.push({
      id,
      timestamp:  new Date().toISOString(),
      userAgent:  navigator.userAgent,
      referrer:   document.referrer || 'Direct',
      language:   navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
    });
    this.#save();
  }

  /* ── Public API ──────────────────────────────────────── */

  trackPageView(pageName) {
    this.#data.pageViews[pageName] = (this.#data.pageViews[pageName] ?? 0) + 1;
    this.#data.actions.push({ sessionId: this.sessionId, action: 'page_view', page: pageName, timestamp: new Date().toISOString() });
    this.#save();
    this.updateDashboard();
    postToBackend({ type: 'event', sessionId: this.sessionId, action: 'page_view', page: pageName, timestamp: new Date().toISOString() });
  }

  trackAction(actionType, details = '') {
    if (actionType === 'cv_download')   this.#data.cvDownloads++;
    if (actionType === 'form_submit')   this.#data.formSubmissions++;
    if (actionType === 'project_click') this.#data.projectClicks.push({ project: details, timestamp: new Date().toISOString() });

    this.#data.actions.push({ sessionId: this.sessionId, action: actionType, details, timestamp: new Date().toISOString() });
    this.#save();
    this.updateDashboard();
    postToBackend({ type: 'event', sessionId: this.sessionId, action: actionType, details, page: getCurrentPageName(), timestamp: new Date().toISOString() });
  }

  recordSubmission(formData) {
    this.#data.submissions.push(formData);
    this.#save();
  }

  /** Refresh the analytics dashboard widgets (analytics.html only) */
  updateDashboard() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    // Both IDs handled — analytics.html uses 'uniqueVisitors' for total count
    set('visitorCount',    this.#data.totalVisitors);
    set('uniqueVisitors',  this.#data.uniqueVisitors.length);
    set('pageViews',       Object.values(this.#data.pageViews).reduce((a, b) => a + b, 0));
    set('cvDownloads',     this.#data.cvDownloads);
    set('formSubmissions', this.#data.formSubmissions);

    // Recent visitors list
    const visitorList = document.getElementById('visitorList');
    if (visitorList) {
      const entries = [...this.#data.visitors].reverse().slice(0, 10);
      visitorList.innerHTML = entries.length
        ? entries.map((v) => `
            <li class="visitor-item">
              <strong>${v.id.substring(0, 24)}…</strong><br>
              ${new Date(v.timestamp).toLocaleString()}<br>
              <small>From: ${v.referrer || 'Direct'} &nbsp;|&nbsp; ${v.language} &nbsp;|&nbsp; ${v.screenSize}</small>
            </li>`).join('')
        : '<li class="visitor-item">No visitors recorded yet.</li>';
    }

    // Page view breakdown
    const pageStats = document.getElementById('pageStats');
    if (pageStats) {
      const entries = Object.entries(this.#data.pageViews);
      pageStats.innerHTML = entries.length
        ? entries
            .sort(([, a], [, b]) => b - a)                     // most-viewed first
            .map(([page, views]) => `
              <div style="background:rgba(168,85,247,0.05);padding:1rem;border-radius:6px;display:flex;justify-content:space-between;align-items:center;">
                <strong style="color:var(--color-accent);">${page}</strong>
                <span style="color:#fff;font-weight:700;">${views} view${views !== 1 ? 's' : ''}</span>
              </div>`).join('')
        : '<p style="color:var(--color-text-secondary)">No page views recorded yet.</p>';
    }

    // Project click tracking
    const projectClicks = document.getElementById('projectClicks');
    if (projectClicks) {
      const clicks = [...this.#data.projectClicks].reverse().slice(0, 10);
      projectClicks.innerHTML = clicks.length
        ? clicks.map((c) => `
            <li class="visitor-item">
              <strong style="color:var(--color-accent);">${c.project}</strong><br>
              <small>${new Date(c.timestamp).toLocaleString()}</small>
            </li>`).join('')
        : '<li class="visitor-item">No project clicks recorded yet.</li>';
    }

    // Contact form submissions
    const formSubmissionsList = document.getElementById('formSubmissionsList');
    if (formSubmissionsList) {
      const subs = [...this.#data.submissions].reverse().slice(0, 10);
      formSubmissionsList.innerHTML = subs.length
        ? subs.map((s) => `
            <li class="visitor-item">
              <strong>${s.name || 'Unknown'}</strong> — ${s.subject || 'No subject'}<br>
              <small>${s.email || ''} &nbsp;|&nbsp; ${new Date(s.timestamp).toLocaleString()}</small>
            </li>`).join('')
        : '<li class="visitor-item">No form submissions yet.</li>';
    }
  }

  /** Pull global stats from Google Apps Script (analytics.html only) */
  async loadGlobalStats() {
    if (getCurrentPageName() !== 'analytics') return;

    const statusEl = document.getElementById('globalStatsStatus');
    if (statusEl) statusEl.textContent = '⏳ Loading remote data…';

    try {
      const res  = await fetch(BACKEND_URL);
      const data = await res.json();

      // GAS returns events array directly or wrapped in { ok, totals, recentEvents }
      // Handle both shapes gracefully
      const events = Array.isArray(data)
        ? data
        : Array.isArray(data.recentEvents)
          ? data.recentEvents
          : [];

      if (statusEl) {
        statusEl.textContent = events.length
          ? `✅ Remote data loaded — ${events.length} events from Google Sheets`
          : '⚠️ Connected but no remote events yet. Data will appear after the first real visitor.';
      }

      // If wrapped format with totals, update counters
      if (data?.totals) {
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val ?? 0; };
        set('pageViews',       data.totals.pageViews);
        set('uniqueVisitors',  data.totals.uniqueVisitors);
        set('cvDownloads',     data.totals.cvDownloads);
        set('formSubmissions', data.totals.formSubmissions);
      }

      // Show recent remote events in the visitor list
      const visitorList = document.getElementById('visitorList');
      if (visitorList && events.length) {
        visitorList.innerHTML = events.slice(-10).reverse().map((ev) => `
          <li class="visitor-item">
            <strong style="color:var(--color-accent);">${ev.action ?? 'event'}</strong>
            ${ev.page ? ` — <em>${ev.page}</em>` : ''}<br>
            <small>${ev.timestamp ? new Date(ev.timestamp).toLocaleString() : 'Unknown time'}</small>
          </li>`).join('');
      }

    } catch (err) {
      if (statusEl) {
        statusEl.textContent = '❌ Could not reach Google Apps Script. Showing local data only.';
      }
      // Local localStorage data is still visible — graceful degradation
      console.info('[Analytics] Remote fetch failed, showing local data:', err.message);
    }
  }
}
