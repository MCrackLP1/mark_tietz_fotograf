# Admin Vertragsystem - Mark Tietz Fotografie

## Übersicht

Das Admin-Vertragsystem ermöglicht es, professionelle Fotografieverträge zu erstellen und als PDF zu generieren. Das System ist durch ein Login geschützt und nur für autorisierte Benutzer zugänglich.

## Zugang

- **URL:** `admin-login.html`
- **Benutzername:** Mark
- **Passwort:** 6626

## Funktionen

### 1. Login-System
- Session-basierte Authentifizierung
- Automatische Weiterleitung bei gültigen Anmeldedaten
- Schutz vor unbefugtem Zugriff

### 2. Vertragstypen
Das System unterstützt 6 verschiedene Vertragstypen:

- **TFP Vertrag** (Time for Print)
  - Kostenloser Austausch zwischen Model und Fotograf
  - Nutzungsrechte für beide Seiten definierbar
  - Bildanzahl festlegbar

- **Hochzeitsvertrag**
  - Detaillierte Hochzeitsfotografie-Vereinbarungen
  - Leistungspakete (Basic, Standard, Premium)
  - Zusätzliche Services (Verlobungsshooting, Album, etc.)

- **Business Shooting**
  - Gewerbliche Fotografie für Unternehmen
  - Verschiedene Arten (Headshots, Corporate, Produkte, etc.)
  - Kommerzielle Nutzungsrechte

- **Portrait Shooting**
  - Einzel-, Paar- oder Gruppenportraits
  - Studio oder Outdoor
  - Verschiedene Stile und Lieferformate

- **Event Fotografie**
  - Veranstaltungsfotografie
  - Flexible Anforderungen
  - Diskrete Arbeitsweise möglich

- **Familien Shooting**
  - Familienportraits mit Kindern
  - Altersangaben für bessere Planung
  - Verschiedene Shooting-Stile

### 3. Formularfelder

#### Allgemeine Felder (alle Verträge):
- **Kundendaten:** Name, E-Mail, Telefon, Adresse
- **Shooting Details:** Datum, Uhrzeit, Dauer, Location
- **Konditionen:** Preis, Zahlungsweise, zusätzliche Kosten
- **Zusätzliche Vereinbarungen:** Individuelle Wünsche

#### Spezifische Felder je Vertragstyp:
- Multiple-Choice Optionen für Leistungspakete
- Checkbox-Gruppen für Nutzungsrechte und Services
- Dropdown-Menüs für standardisierte Optionen

### 4. Dateneingabebegrenzungen
- **Namen:** max. 30 Zeichen
- **Adresse:** max. 200 Zeichen
- **Telefon:** max. 20 Zeichen
- **Zusätzliche Kosten:** max. 300 Zeichen
- **Zusätzliche Vereinbarungen:** max. 500 Zeichen
- **Datum:** Minimum ist aktuelles Datum

### 5. PDF-Generation

#### Features:
- **Professioneller Briefkopf** mit Logo
- **Vollständige Geschäftsdaten:**
  - Mark Tietz Fotograf
  - Königplatz 3, 87448 Waltenhofen
  - Inhaber: Mark Tietz (geb. 25. Januar 1997)
  - Tel: +49 174 1632129
  - E-Mail: info@mark-tietz.photos
  - Website: www.mark-tietz.photos
  - Bank: Postbank
  - IBAN: DE56 1001 0010 0776 3691 14
  - Verfügbarkeit: 24/7 nach Vereinbarung

- **Preisgestaltung:**
  - Porträt- und Familienfotografie: 180€ - 240€ (einstündige Shootings)
  - Business- und Bewerbungsfotos: 80€ - 96€ pro Session
  - Eventfotografie: 80€ - 96€ pro Stunde
  - Baby- und Schwangerschaftsfotografie: 180€ - 240€ pro Stunde
  - Hochzeitsfotografie: 1.000€ - 1.600€ (je nach Dauer und Zusatzleistungen)

- **Zusatzleistungen:**
  - Stylistin: 95€
  - Videograf (Levin Dumlu / LDK Films): Preis auf Anfrage
  - Expresslieferung: 120€ Aufpreis

#### PDF-Struktur:
- **Header:** Logo + vollständige Geschäftsdaten
- **Titel:** Vertragstyp
- **Kundendaten:** Vollständige Kontaktinformationen
- **Shooting Details:** Tabellendarstellung mit Datum, Zeit, Dauer, Location
- **Vertragsspezifische Details:** Je nach Vertragstyp
- **Preise und Zahlungsbedingungen:** Vollständige Preisliste und Zahlungsmodalitäten
- **Bankverbindung:** IBAN, Bank, PayPal-Hinweis
- **Zusatzleistungen:** Stylistin, Videograf, Expresslieferung
- **Reisegebühren:** Automatische Berechnung ab 30km
- **Stornierungsbedingungen:** Detaillierte Tabelle für Wochentage/Wochenende
- **Lieferzeiten:** Standard (6 Tage) und Express (120€ Aufpreis)
- **Allgemeine Geschäftsbedingungen:** Rechtssichere AGB mit 10 Punkten
- **Unterschriftenfelder:** Kunde und Fotograf
- **Footer:** Vollständige Geschäftsdaten, Bankverbindung + Erstellungsdatum

#### PDF-Aktionen:
- **Download:** Direkt als PDF-Datei herunterladen
- **Link kopieren:** Shareable Link (Platzhalter-Funktion)
- **Neuer Vertrag:** Formular zurücksetzen

### 6. Design

#### Basiert auf der Rechnung:
- Professionelles Layout im Corporate Design
- Einheitliche Schriftarten (Space Grotesk)
- Farbschema: Blau-violetter Gradient (#667eea → #764ba2)
- Responsive Design für alle Geräte

#### PDF-Design:
- A4-Format (210x297mm)
- Professionelle Typografie
- Strukturierte Tabellen
- Saubere Sektionierung
- Klare Unterschriftenfelder

## Technische Details

### Verwendete Technologien:
- **HTML5** für Struktur
- **CSS3** für Design und Layout
- **JavaScript** für Funktionalität
- **jsPDF** für PDF-Generierung
- **html2canvas** für HTML-zu-PDF Konvertierung

### Browser-Kompatibilität:
- Chrome, Firefox, Safari, Edge
- Mobile Browser unterstützt
- Moderne JavaScript-Features erforderlich

### Sicherheit:
- Session Storage für Login-Persistierung
- Robots.txt Ausschluss der Admin-Seiten
- Einfache aber effektive Zugriffskontrolle
- Keine Speicherung sensibler Daten im Browser

## Verwendung

1. **Einloggen:** `admin-login.html` aufrufen und anmelden
2. **Vertragstyp wählen:** Gewünschten Vertrag aus der Übersicht auswählen
3. **Formular ausfüllen:** Alle erforderlichen Felder ausfüllen
4. **PDF generieren:** "PDF Vertrag erstellen" klicken
5. **PDF nutzen:** Herunterladen oder Link teilen

## Wartung

### Datensicherung:
- Keine automatische Speicherung im System
- PDFs werden lokal generiert
- Regelmäßige Sicherung der HTML-Dateien empfohlen

### Updates:
- Neue Vertragstypen können in `contractConfigs` hinzugefügt werden
- Preise und Geschäftsdaten direkt im Code anpassbar
- CSS-Anpassungen für Design-Updates möglich

## Support

Bei Problemen oder Anpassungswünschen die HTML/CSS/JavaScript Dateien entsprechend anpassen oder professionelle Hilfe in Anspruch nehmen.

---

**Version:** 1.0  
**Erstellt:** 2024  
**Für:** Mark Tietz Fotografie 