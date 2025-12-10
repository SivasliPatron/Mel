/**
 * Eigenes Analytics System - DSGVO Konform
 * Funktioniert nur wenn Analytics-Cookies akzeptiert wurden
 * Speichert Daten im localStorage (keine externen Server)
 */

class LocalAnalytics {
  constructor() {
    this.storageKey = 'noova_analytics';
    this.sessionKey = 'noova_session';
    this.enabled = false;
    
    this.init();
  }

  init() {
    // Warte auf Cookie Consent
    window.addEventListener('cookieConsentUpdated', (e) => {
      if (e.detail.analytics) {
        this.enable();
      } else {
        this.disable();
      }
    });

    // Check initial consent
    const consent = this.getConsent();
    if (consent && consent.analytics) {
      this.enable();
    }
  }

  getConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'noova_cookie_consent') {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  enable() {
    this.enabled = true;
    this.trackPageView();
    this.startSession();
    console.log('📊 Lokales Analytics aktiviert');
  }

  disable() {
    this.enabled = false;
    console.log('📊 Lokales Analytics deaktiviert');
  }

  // Session Management
  startSession() {
    if (!this.enabled) return;

    let session = sessionStorage.getItem(this.sessionKey);
    if (!session) {
      session = {
        id: this.generateId(),
        startTime: new Date().toISOString(),
        pages: [],
        referrer: document.referrer || 'direct'
      };
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      this.incrementStat('totalSessions');
    }
  }

  // Track Page View
  trackPageView() {
    if (!this.enabled) return;

    const pageData = {
      path: window.location.pathname,
      title: document.title,
      timestamp: new Date().toISOString()
    };

    // Update session
    let session = JSON.parse(sessionStorage.getItem(this.sessionKey) || '{}');
    if (session.pages) {
      session.pages.push(pageData);
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    }

    // Update global stats
    this.incrementStat('totalPageViews');
    this.incrementPageStat(pageData.path);

    console.log('📊 Seite getrackt:', pageData.path);
  }

  // Track Event (z.B. Button-Klicks)
  trackEvent(category, action, label = '') {
    if (!this.enabled) return;

    const eventData = {
      category,
      action,
      label,
      timestamp: new Date().toISOString()
    };

    const stats = this.getStats();
    if (!stats.events) stats.events = [];
    stats.events.push(eventData);
    
    // Nur letzte 100 Events speichern
    if (stats.events.length > 100) {
      stats.events = stats.events.slice(-100);
    }
    
    this.saveStats(stats);
    console.log('📊 Event getrackt:', category, action, label);
  }

  // Increment a stat counter
  incrementStat(key) {
    const stats = this.getStats();
    stats[key] = (stats[key] || 0) + 1;
    this.saveStats(stats);
  }

  // Track individual page views
  incrementPageStat(path) {
    const stats = this.getStats();
    if (!stats.pages) stats.pages = {};
    stats.pages[path] = (stats.pages[path] || 0) + 1;
    this.saveStats(stats);
  }

  // Get all stats
  getStats() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || this.getDefaultStats();
    } catch {
      return this.getDefaultStats();
    }
  }

  getDefaultStats() {
    return {
      totalPageViews: 0,
      totalSessions: 0,
      pages: {},
      events: [],
      firstVisit: new Date().toISOString()
    };
  }

  // Save stats
  saveStats(stats) {
    stats.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
  }

  // Generate unique ID
  generateId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get readable stats for display
  getReadableStats() {
    const stats = this.getStats();
    return {
      'Gesamte Seitenaufrufe': stats.totalPageViews || 0,
      'Gesamte Sessions': stats.totalSessions || 0,
      'Erster Besuch': stats.firstVisit ? new Date(stats.firstVisit).toLocaleDateString('de-DE') : '-',
      'Letztes Update': stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString('de-DE') : '-',
      'Beliebteste Seiten': stats.pages || {}
    };
  }

  // Clear all analytics data
  clearData() {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.sessionKey);
    console.log('📊 Analytics-Daten gelöscht');
  }

  // Show stats in console
  showStats() {
    console.log('📊 === ANALYTICS STATISTIKEN ===');
    console.table(this.getReadableStats());
    console.log('📊 Detaillierte Daten:', this.getStats());
  }
}

// Functional Cookies - Speichert Benutzereinstellungen
class LocalPreferences {
  constructor() {
    this.storageKey = 'noova_preferences';
    this.enabled = false;
    
    this.init();
  }

  init() {
    window.addEventListener('cookieConsentUpdated', (e) => {
      if (e.detail.functional) {
        this.enable();
      } else {
        this.disable();
      }
    });

    const consent = this.getConsent();
    if (consent && consent.functional) {
      this.enable();
    }
  }

  getConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'noova_cookie_consent') {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  enable() {
    this.enabled = true;
    this.loadPreferences();
    console.log('⚙️ Funktionale Cookies aktiviert');
  }

  disable() {
    this.enabled = false;
    console.log('⚙️ Funktionale Cookies deaktiviert');
  }

  // Save a preference
  set(key, value) {
    if (!this.enabled) return false;
    
    const prefs = this.getAll();
    prefs[key] = value;
    localStorage.setItem(this.storageKey, JSON.stringify(prefs));
    return true;
  }

  // Get a preference
  get(key, defaultValue = null) {
    if (!this.enabled) return defaultValue;
    
    const prefs = this.getAll();
    return prefs[key] !== undefined ? prefs[key] : defaultValue;
  }

  // Get all preferences
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    } catch {
      return {};
    }
  }

  // Load and apply saved preferences
  loadPreferences() {
    // Beispiel: Theme laden
    const theme = this.get('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    }

    // Beispiel: Letzte besuchte Seite merken
    const lastPage = this.get('lastPage');
    if (lastPage) {
      console.log('⚙️ Letzte besuchte Seite:', lastPage);
    }

    // Aktuelle Seite speichern
    this.set('lastPage', window.location.pathname);
    this.set('lastVisit', new Date().toISOString());
  }

  // Clear all preferences
  clearData() {
    localStorage.removeItem(this.storageKey);
    console.log('⚙️ Einstellungen gelöscht');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.localAnalytics = new LocalAnalytics();
  window.localPreferences = new LocalPreferences();

  // Track wichtige Events
  // Kontaktformular absenden
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      window.localAnalytics.trackEvent('Formular', 'Absenden', 'Kontaktformular');
    });
  }

  // CTA Button Klicks
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const label = e.target.textContent.trim();
      window.localAnalytics.trackEvent('Button', 'Klick', label);
    });
  });

  // Navigation Klicks
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const label = e.target.textContent.trim();
      window.localAnalytics.trackEvent('Navigation', 'Klick', label);
    });
  });

  // Portfolio Filter (falls vorhanden)
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.target.dataset.filter || e.target.textContent;
      window.localAnalytics.trackEvent('Portfolio', 'Filter', filter);
    });
  });

  // Debug: Stats in Console anzeigen (nur in Entwicklung)
  // window.localAnalytics.showStats();
});

// Globale Funktion zum Anzeigen der Stats
window.showAnalytics = function() {
  if (window.localAnalytics) {
    window.localAnalytics.showStats();
  } else {
    console.log('Analytics nicht verfügbar oder nicht aktiviert');
  }
};

// Globale Funktion zum Löschen der Daten
window.clearAnalytics = function() {
  if (window.localAnalytics) {
    window.localAnalytics.clearData();
  }
  if (window.localPreferences) {
    window.localPreferences.clearData();
  }
  console.log('Alle lokalen Daten gelöscht');
};
