// DSGVO-konforme Google Maps Integration
class MapsConsent {
  constructor() {
    this.mapsUrl = 'https://maps.google.com/maps?q=47.66916493445645,10.310301079396721&t=&z=17&ie=UTF8&iwloc=&output=embed';
    this.consentKey = 'google-maps-consent';
    
    this.init();
  }

  init() {
    // Nur auf Kontaktseite initialisieren
    if (!document.getElementById('maps-consent')) return;

    // Event Listeners binden
    this.bindEvents();
    
    // Prüfen ob bereits Zustimmung vorliegt
    this.checkExistingConsent();
  }

  bindEvents() {
    const acceptBtn = document.getElementById('accept-maps');
    const declineBtn = document.getElementById('decline-maps');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.acceptMaps());
    }
    
    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.declineMaps());
    }
  }

  checkExistingConsent() {
    const consent = localStorage.getItem(this.consentKey);
    
    if (consent === 'accepted') {
      this.loadMaps();
    } else if (consent === 'declined') {
      this.showAlternative();
    }
    // Wenn kein Consent vorhanden, bleibt die Abfrage sichtbar
  }

  acceptMaps() {
    // Zustimmung speichern
    localStorage.setItem(this.consentKey, 'accepted');
    
    // Analytics Event (optional)
    this.trackEvent('maps_consent', 'accepted');
    
    // Karte laden
    this.loadMaps();
  }

  declineMaps() {
    // Ablehnung speichern
    localStorage.setItem(this.consentKey, 'declined');
    
    // Analytics Event (optional)
    this.trackEvent('maps_consent', 'declined');
    
    // Alternative anzeigen
    this.showAlternative();
  }

  loadMaps() {
    const consentDiv = document.getElementById('maps-consent');
    const mapsDiv = document.getElementById('google-maps-iframe');
    const iframe = document.getElementById('maps-frame');
    
    if (!consentDiv || !mapsDiv || !iframe) return;

    // Consent ausblenden
    consentDiv.style.display = 'none';
    
    // Maps URL setzen und anzeigen
    iframe.src = this.mapsUrl;
    mapsDiv.classList.remove('hidden');
    
    // Smooth reveal Animation
    this.animateReveal(mapsDiv);
  }

  showAlternative() {
    const consentDiv = document.getElementById('maps-consent');
    const alternativeDiv = document.getElementById('maps-alternative');
    
    if (!consentDiv || !alternativeDiv) return;

    // Consent ausblenden
    consentDiv.style.display = 'none';
    
    // Alternative anzeigen
    alternativeDiv.classList.remove('hidden');
    
    // Smooth reveal Animation
    this.animateReveal(alternativeDiv);
  }

  animateReveal(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 50);
  }

  trackEvent(eventName, value) {
    // Optional: Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        'custom_parameter': value,
      });
    }
    
    // Console log für Development

  }

  // Public method um Zustimmung zurückzusetzen
  resetConsent() {
    localStorage.removeItem(this.consentKey);
    location.reload();
  }
}

// Initialisierung wenn DOM geladen
document.addEventListener('DOMContentLoaded', () => {
  new MapsConsent();
});

// Global für externe Nutzung
window.MapsConsent = MapsConsent; 
