/**
 * Google Apps Script — Portfolio Analytics + Contact Backend
 * ───────────────────────────────────────────────────────────
 * Deploy as: Web App
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * This script does two things:
 *   POST → logs events (page views, CV downloads, form submissions) to a Google Sheet
 *   GET  → returns all logged events as JSON so analytics.html can display them
 */

// ── Config ──────────────────────────────────────────────────
const SHEET_NAME_EVENTS  = 'Events';    // tab for page views / actions
const SHEET_NAME_CONTACT = 'Contact';   // tab for contact form messages

// ── POST: Receive and log data ───────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.type === 'contact') {
      logContact(payload);
    } else if (payload.type === 'event') {
      logEvent(payload);
    }

    return jsonResponse({ ok: true });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── GET: Return all events so analytics.html can read them ───
const SHEET_ID = '1E9lG1Xwxb8eRhLkEKlad8s3EStYawghRXX7WgRSWuJQ';

function doGet(e) {
  try {
    const ss     = SpreadsheetApp.openById(SHEET_ID);
    const sheet  = getOrCreateSheet(ss, SHEET_NAME_EVENTS);
    const rows   = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      // Only header row — no events yet
      return jsonResponse({ ok: true, totalEvents: 0, recentEvents: [], pageCounts: {}, totals: { pageViews: 0, uniqueVisitors: 0, cvDownloads: 0, formSubmissions: 0 } });
    }

    // rows[0] is the header: [timestamp, sessionId, action, page, details]
    const events = rows.slice(1).map(row => ({
      timestamp:  row[0],
      sessionId:  row[1],
      action:     row[2],
      page:       row[3],
      details:    row[4],
    }));

    // Build page view counts
    const pageCounts = {};
    events
      .filter(ev => ev.action === 'page_view')
      .forEach(ev => {
        pageCounts[ev.page] = (pageCounts[ev.page] || 0) + 1;
      });

    // Build unique visitor count from unique sessionIds
    const uniqueSessions = [...new Set(events.map(ev => ev.sessionId).filter(Boolean))];

    const totals = {
      pageViews:       events.filter(ev => ev.action === 'page_view').length,
      uniqueVisitors:  uniqueSessions.length,
      cvDownloads:     events.filter(ev => ev.action === 'cv_download').length,
      formSubmissions: events.filter(ev => ev.action === 'form_submit').length,
    };

    return jsonResponse({
      ok:           true,
      totalEvents:  events.length,
      recentEvents: events.slice(-50).reverse(), // last 50 events, newest first
      pageCounts,
      totals,
    });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── Helpers ──────────────────────────────────────────────────

function logEvent(payload) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_NAME_EVENTS);

  // Add header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Session ID', 'Action', 'Page', 'Details']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }

  sheet.appendRow([
    payload.timestamp || new Date().toISOString(),
    payload.sessionId || 'unknown',
    payload.action    || 'unknown',
    payload.page      || '',
    payload.details   || '',
  ]);
}

function logContact(payload) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_NAME_CONTACT);

  // Add header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Session ID']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }

  sheet.appendRow([
    payload.timestamp || new Date().toISOString(),
    payload.name      || '',
    payload.email     || '',
    payload.subject   || '',
    payload.message   || '',
    payload.sessionId || '',
  ]);

  // Optional: send yourself an email notification
  // MailApp.sendEmail('lunganizungu2018@gmail.com', 'New Contact: ' + payload.subject, payload.message);
}

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

// Not used directly — see getSheet_() below


function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
