/**
 * modules/contact.js
 * ─────────────────────────────────────────────────────────
 * Purpose : Contact form submission — validates input,
 *           enforces honeypot anti-spam, and posts to the
 *           Google Apps Script backend.
 *
 * Why Google Apps Script? Free, no server required, and
 * emails land directly in the owner's Gmail inbox.
 *
 * Author  : Lungani Zungu
 * ─────────────────────────────────────────────────────────
 */

const BACKEND_URL =
  'https://script.google.com/macros/s/AKfycbw94sQMiRNEFG3ik3dmYocwV4g4GQEIYeujcVIXvqF0q7sc3pX-kTHNrZn1TOL-JiO3/exec';

/**
 * Initialise the contact form submit handler.
 * @param {import('./analytics.js').Analytics} analytics - Shared analytics instance
 */
export function initContactForm(analytics) {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const statusEl  = document.getElementById('formStatus');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      type:    'contact',
      sessionId: analytics.sessionId,
      name:    document.getElementById('name')?.value.trim()    ?? '',
      email:   document.getElementById('email')?.value.trim()   ?? '',
      subject: document.getElementById('subject')?.value.trim() ?? '',
      message: document.getElementById('message')?.value.trim() ?? '',
      // Honeypot: bots fill hidden fields; real users leave it blank
      website: document.getElementById('website')?.value.trim() ?? '',
      timestamp: new Date().toISOString(),
    };

    // If honeypot triggered, pretend success without sending anything
    if (payload.website) {
      showStatus(statusEl, '✓ Message sent successfully!', 'success');
      form.reset();
      return;
    }

    setSubmitLoading(submitBtn, true);

    try {
      const res    = await fetch(BACKEND_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body:    JSON.stringify(payload),
      });
      const result = await res.json().catch(() => null);

      if (result?.ok !== true) throw new Error(result?.message ?? 'Submission failed');

      analytics.recordSubmission(payload);
      analytics.trackAction('form_submit', payload.name);

      showStatus(statusEl, '✓ Message sent! I\'ll get back to you soon.', 'success');
      form.reset();

    } catch (err) {
      showStatus(statusEl, '✗ Could not send — please email me directly.', 'error');
      console.error('[Contact Form]', err);

    } finally {
      setSubmitLoading(submitBtn, false);
    }
  });
}

/* ── Private helpers ─────────────────────────────────────── */

function setSubmitLoading(btn, isLoading) {
  if (!btn) return;
  btn.innerHTML  = isLoading ? 'Sending… <span class="spinner"></span>' : 'Send Message';
  btn.disabled   = isLoading;
}

function showStatus(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.style.color = type === 'success' ? 'var(--color-accent)' : '#ef4444';
}
