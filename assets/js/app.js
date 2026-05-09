/* =========================
   Global Backend (Google Apps Script)
========================= */
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwW1ohV-Gg4ybS-gWgZOJbG9uYCuifk3FR5tdGOwFuxkTwpMO7FLsd33kVOQkjbOkQ2/exec";

async function sendToBackend(payload) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.log("Backend request failed (non-blocking):", e);
  }
}

/* ===== Helper: active nav link based on current page ===== */
function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const map = {
    "index.html": "home",
    "about.html": "about",
    "projects.html": "projects",
    "case-studies.html": "case-studies",
    "blog.html": "blog",
    "contact.html": "contact",
    "analytics.html": "analytics",
  };
  const activeKey = map[path];

  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.classList.remove("active");
    if (a.dataset.page === activeKey) a.classList.add("active");
  });
}

/* ===== Mobile menu ===== */
function initMobileMenu() {
  const btn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (!btn || !navLinks) return;

  btn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

/* ===== Track current page ===== */
function inferPageName() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  return path.replace(".html", "") || "home";
}

/* ===== Simple local analytics (kept) + global backend events ===== */
class Analytics {
  constructor() {
    this.storageKey = "portfolio_analytics";
    this.sessionKey = "portfolio_session";
    this.data = this.loadData();
    this.sessionId = this.getSessionId();
  }

  loadData() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) return JSON.parse(stored);
    return {
      totalVisitors: 0,
      uniqueVisitors: [],
      pageViews: {},
      cvDownloads: 0,
      formSubmissions: 0,
      visitors: [],
      projectClicks: [],
      actions: [],
      submissions: [],
    };
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  getSessionId() {
    let session = sessionStorage.getItem(this.sessionKey);
    if (!session) {
      session =
        "visitor_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
      sessionStorage.setItem(this.sessionKey, session);
      this.trackNewVisitor(session);
    }
    return session;
  }

  trackNewVisitor(sessionId) {
    if (!this.data.uniqueVisitors.includes(sessionId)) {
      this.data.uniqueVisitors.push(sessionId);
      this.data.totalVisitors++;

      const visitorData = {
        id: sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || "Direct",
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
      };

      this.data.visitors.push(visitorData);
      this.saveData();
    }
  }

  trackPageView(pageName) {
    if (!this.data.pageViews[pageName]) this.data.pageViews[pageName] = 0;
    this.data.pageViews[pageName]++;

    this.data.actions.push({
      sessionId: this.sessionId,
      action: "page_view",
      page: pageName,
      timestamp: new Date().toISOString(),
    });

    this.saveData();
    this.updateDashboardIfExists();

    // ✅ Global analytics event
    sendToBackend({
      type: "event",
      sessionId: this.sessionId,
      action: "page_view",
      page: pageName,
      timestamp: new Date().toISOString(),
    });
  }

  trackAction(actionType, details = "") {
    this.data.actions.push({
      sessionId: this.sessionId,
      action: actionType,
      details,
      timestamp: new Date().toISOString(),
    });

    if (actionType === "cv_download") this.data.cvDownloads++;
    if (actionType === "form_submit") this.data.formSubmissions++;
    if (actionType === "project_click") {
      this.data.projectClicks.push({
        project: details,
        timestamp: new Date().toISOString(),
      });
    }

    this.saveData();
    this.updateDashboardIfExists();

    // ✅ Global analytics event
    sendToBackend({
      type: "event",
      sessionId: this.sessionId,
      action: actionType,
      details: details,
      page: inferPageName(),
      timestamp: new Date().toISOString(),
    });
  }

  updateDashboardIfExists() {
    const elVisitorCount = document.getElementById("visitorCount");
    const elUnique = document.getElementById("uniqueVisitors");
    const elPageViews = document.getElementById("pageViews");
    const elCv = document.getElementById("cvDownloads");
    const elForm = document.getElementById("formSubmissions");

    if (elVisitorCount) elVisitorCount.textContent = this.data.totalVisitors;
    if (elUnique) elUnique.textContent = this.data.uniqueVisitors.length;
    if (elPageViews)
      elPageViews.textContent = Object.values(this.data.pageViews).reduce(
        (a, b) => a + b,
        0
      );
    if (elCv) elCv.textContent = this.data.cvDownloads;
    if (elForm) elForm.textContent = this.data.formSubmissions;

    const visitorList = document.getElementById("visitorList");
    if (visitorList) {
      visitorList.innerHTML = this.data.visitors
        .slice(-10)
        .reverse()
        .map(
          (v) => `
          <li class="visitor-item">
            <strong>${(v.id || "Unknown").substring(0, 20)}...</strong><br>
            ${new Date(v.timestamp).toLocaleString()}<br>
            <small>${v.referrer || "Direct"} | ${v.language || "N/A"}</small>
          </li>
        `
        )
        .join("");
    }

    const pageStats = document.getElementById("pageStats");
    if (pageStats) {
      pageStats.innerHTML = Object.entries(this.data.pageViews)
        .map(
          ([page, views]) => `
          <div style="background: rgba(0, 255, 255, 0.05); padding: 1rem; border-radius: 6px;">
            <strong style="color: var(--neon-cyan);">${page}</strong>: ${views} views
          </div>
        `
        )
        .join("");
    }

    const projectClicks = document.getElementById("projectClicks");
    if (projectClicks) {
      projectClicks.innerHTML = this.data.projectClicks
        .slice(-10)
        .reverse()
        .map(
          (p) => `
          <li class="visitor-item">
            <strong>${p.project}</strong><br>
            ${new Date(p.timestamp).toLocaleString()}
          </li>
        `
        )
        .join("");
    }

    const formSubmissionsList = document.getElementById("formSubmissionsList");
    if (formSubmissionsList) {
      formSubmissionsList.innerHTML = this.data.submissions
        .slice(-10)
        .reverse()
        .map(
          (s) => `
          <li class="visitor-item">
            <strong>${s.name}</strong> - ${s.subject}<br>
            ${s.email}<br>
            <small>${new Date(s.timestamp).toLocaleString()}</small>
          </li>
        `
        )
        .join("");
    }
  }
}

const analytics = new Analytics();

/* ===== CV Download ===== */
function initCvDownload() {
  const btn1 = document.getElementById("downloadCV");
  const btn2 = document.getElementById("downloadCVBtn");

  function downloadCV(e) {
    if (e) e.preventDefault();
    analytics.trackAction("cv_download");

    const cvPath = "assets/files/Lungani_Zungu_CV.pdf";

    // Check if file exists before downloading
    fetch(cvPath, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          const link = document.createElement("a");
          link.href = cvPath;
          link.download = "Lungani_Zungu_CV.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert("CV file is not available yet. Please check back later or contact me directly.");
        }
      })
      .catch(() => {
        // If running locally via file://, just attempt download directly
        const link = document.createElement("a");
        link.href = cvPath;
        link.download = "Lungani_Zungu_CV.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  if (btn1) btn1.addEventListener("click", downloadCV);
  if (btn2) btn2.addEventListener("click", downloadCV);
}

/* ===== Projects click tracking ===== */
function initProjectCards() {
  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => {
      analytics.trackAction("project_click", card.dataset.project);
    });
  });
}

/* ===== Contact form -> Google Apps Script Backend ===== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("formStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      type: "contact",
      sessionId: analytics.sessionId,

      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),

      // honeypot anti-spam (add hidden input in contact.html)
      website: (document.getElementById("website")?.value || "").trim(),

      timestamp: new Date().toISOString(),
    };

    // If honeypot is filled, silently pretend success (bots will fill it)
    if (formData.website) {
      statusEl.textContent = "✓ Message sent successfully!";
      statusEl.style.color = "var(--neon-cyan)";
      form.reset();
      return;
    }

    submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
    submitBtn.disabled = true;

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(formData),
      });

      const result = await res.json().catch(() => null);

      if (!result || result.ok !== true) {
        throw new Error(result?.message || "Failed to send.");
      }

      analytics.data.submissions.push(formData);
      analytics.trackAction("form_submit", formData.name);

      statusEl.textContent =
        "✓ Message sent successfully! I will get back to you soon.";
      statusEl.style.color = "var(--neon-cyan)";
      form.reset();
    } catch (error) {
      statusEl.textContent =
        "✗ Error sending message. Please try again or email directly.";
      statusEl.style.color = "var(--accent)";
      console.error(error);
    } finally {
      submitBtn.innerHTML = "Send Message";
      submitBtn.disabled = false;
    }
  });
}

/* ===== Load GLOBAL analytics for analytics.html ===== */
async function loadGlobalAnalyticsIfOnPage() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  if (path !== "analytics.html") return;

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();

    if (!data || data.ok !== true) return;

    // Totals
    document.getElementById("pageViews").textContent =
      data.totals?.pageViews ?? 0;
    document.getElementById("uniqueVisitors").textContent =
      data.totals?.uniqueVisitors ?? 0;
    document.getElementById("cvDownloads").textContent =
      data.totals?.cvDownloads ?? 0;
    document.getElementById("formSubmissions").textContent =
      data.totals?.formSubmissions ?? 0;

    // Page stats
    const pageStats = document.getElementById("pageStats");
    if (pageStats && data.pageCounts) {
      pageStats.innerHTML = Object.entries(data.pageCounts)
        .map(
          ([page, views]) => `
          <div style="background: rgba(0, 255, 255, 0.05); padding: 1rem; border-radius: 6px;">
            <strong style="color: var(--neon-cyan);">${page}</strong>: ${views} views
          </div>
        `
        )
        .join("");
    }

    // Recent events (displayed under "Recent Visitors")
    const visitorList = document.getElementById("visitorList");
    if (visitorList && Array.isArray(data.recentEvents)) {
      visitorList.innerHTML = data.recentEvents
        .map(
          (ev) => `
          <li class="visitor-item">
            <strong>${ev.action}</strong> — ${ev.page || "n/a"}<br>
            <small>${new Date(ev.timestamp).toLocaleString()}</small>
          </li>
        `
        )
        .join("");
    }

    // Optional: could also populate projectClicks / formSubmissionsList from backend
    // (your backend currently returns recentEvents only)
  } catch (e) {
    console.log("Failed to load global analytics:", e);
  }
}

/* ===== Init ===== */
window.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initMobileMenu();

  const pageName = inferPageName();
  analytics.trackPageView(pageName);

  initCvDownload();
  initProjectCards();
  initContactForm();

  // Local dashboard updates (for pages that use localStorage)
  analytics.updateDashboardIfExists();

  // Global dashboard updates (analytics.html)
  loadGlobalAnalyticsIfOnPage();
});
