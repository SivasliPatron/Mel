/**
 * Cookie Consent Management - DSGVO Konform
 * Noova Design
 */

class CookieConsent {
  constructor() {
    this.cookieName = 'noova_cookie_consent';
    this.cookieExpiry = 365; // Tage
    this.consent = this.getConsent();
    
    this.init();
  }

  init() {
    // DOM Elements
    this.banner = document.getElementById('cookieBanner');
    this.overlay = document.getElementById('cookieOverlay');
    this.modal = document.getElementById('cookieModal');
    this.settingsFloat = document.getElementById('cookieSettingsFloat');

    if (!this.banner) return;

    // Event Listeners
    this.bindEvents();

    // Check if consent was already given
    if (!this.consent) {
      this.showBanner();
    } else {
      this.applyConsent();
      this.showSettingsButton();
    }
  }

  bindEvents() {
    // Accept All
    document.querySelectorAll('[data-cookie-accept]').forEach(btn => {
      btn.addEventListener('click', () => this.acceptAll());
    });

    // Reject All
    document.querySelectorAll('[data-cookie-reject]').forEach(btn => {
      btn.addEventListener('click', () => this.rejectAll());
    });

    // Save Selected
    document.querySelectorAll('[data-cookie-save]').forEach(btn => {
      btn.addEventListener('click', () => this.saveSelected());
    });

    // Open Settings Modal
    document.querySelectorAll('[data-cookie-settings]').forEach(btn => {
      btn.addEventListener('click', () => this.openModal());
    });

    // Close Modal
    document.querySelectorAll('[data-cookie-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal());
    });

    // Overlay Click
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeModal());
    }

    // Floating Settings Button
    if (this.settingsFloat) {
      this.settingsFloat.addEventListener('click', () => this.openModal());
    }

    // Checkbox labels
    document.querySelectorAll('.cookie-checkbox').forEach(checkbox => {
      checkbox.addEventListener('click', function() {
        const input = this.previousElementSibling;
        if (!input.disabled) {
          input.checked = !input.checked;
        }
      });
    });
  }

  showBanner() {
    setTimeout(() => {
      this.banner.classList.add('active');
      this.overlay.classList.add('active');
    }, 500);
  }

  hideBanner() {
    this.banner.classList.remove('active');
    this.overlay.classList.remove('active');
    setTimeout(() => {
      this.banner.classList.add('hidden');
    }, 400);
  }

  openModal() {
    this.modal.classList.add('active');
    this.overlay.classList.add('active');
    
    // Load current settings into modal
    if (this.consent) {
      document.getElementById('cookieAnalytics').checked = this.consent.analytics;
      document.getElementById('cookieMarketing').checked = this.consent.marketing;
      document.getElementById('cookieFunctional').checked = this.consent.functional;
    }
  }

  closeModal() {
    this.modal.classList.remove('active');
    if (!this.banner.classList.contains('active')) {
      this.overlay.classList.remove('active');
    }
  }

  showSettingsButton() {
    if (this.settingsFloat) {
      this.settingsFloat.classList.add('visible');
    }
  }

  acceptAll() {
    const consent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    
    this.setConsent(consent);
    this.hideBanner();
    this.closeModal();
    this.applyConsent();
    this.showSettingsButton();
  }

  rejectAll() {
    const consent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    
    this.setConsent(consent);
    this.hideBanner();
    this.closeModal();
    this.applyConsent();
    this.showSettingsButton();
  }

  saveSelected() {
    // Get values from banner checkboxes or modal toggles
    const analyticsCheckbox = document.getElementById('cookieAnalytics');
    const marketingCheckbox = document.getElementById('cookieMarketing');
    const functionalCheckbox = document.getElementById('cookieFunctional');

    const consent = {
      necessary: true,
      functional: functionalCheckbox ? functionalCheckbox.checked : false,
      analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
      marketing: marketingCheckbox ? marketingCheckbox.checked : false,
      timestamp: new Date().toISOString()
    };
    
    this.setConsent(consent);
    this.hideBanner();
    this.closeModal();
    this.applyConsent();
    this.showSettingsButton();
  }

  setConsent(consent) {
    const expires = new Date();
    expires.setDate(expires.getDate() + this.cookieExpiry);
    
    document.cookie = `${this.cookieName}=${JSON.stringify(consent)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    this.consent = consent;
  }

  getConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.cookieName) {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  applyConsent() {
    if (!this.consent) return;

    // Google Analytics
    if (this.consent.analytics) {
      this.loadGoogleAnalytics();
    }

    // Marketing (z.B. Facebook Pixel)
    if (this.consent.marketing) {
      this.loadMarketingScripts();
    }

    // Functional Cookies
    if (this.consent.functional) {
      this.loadFunctionalScripts();
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: this.consent 
    }));
  }

  loadGoogleAnalytics() {
    // Lokales Analytics wird automatisch durch das Event aktiviert
    // Das local-analytics.js Script hört auf 'cookieConsentUpdated'
    console.log('✅ Analytics Cookies aktiviert - Lokales Tracking läuft');
    
    // Falls du später Google Analytics hinzufügen möchtest:
    // const GA_ID = 'G-XXXXXXXXXX';
    // const script = document.createElement('script');
    // script.async = true;
    // script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    // document.head.appendChild(script);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', GA_ID);
  }

  loadMarketingScripts() {
    // Placeholder für Marketing-Skripte (Facebook Pixel, etc.)
    console.log('✅ Marketing Cookies aktiviert');
  }

  loadFunctionalScripts() {
    // Lokale Preferences werden automatisch durch das Event aktiviert
    console.log('✅ Funktionale Cookies aktiviert - Einstellungen werden gespeichert');
  }

  // Public method to check consent
  hasConsent(type) {
    if (!this.consent) return false;
    return this.consent[type] === true;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsent();
});
