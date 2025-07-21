# Portfolio Bilder - Anleitung für Mark Tietz

Hier kannst du deine eigenen Portfolio-Bilder hinzufügen.

## Bildformat & Qualität
- **Format:** .webp (empfohlen) oder .jpg
- **Größe:** Mindestens 800x600 Pixel
- **Seitenverhältnis:** 4:5 (optimal) oder 3:4
- **Dateigröße:** Maximal 500KB pro Bild

## Bildnamen
Verwende beschreibende Namen:
- `hochzeit-romantisch-01.webp`
- `business-portrait-ceo.webp`
- `familie-outdoor-shooting.webp`
- `event-firmenjubilaeum.webp`

## Wie Bilder hinzufügen:

1. **Bilder hier ablegen**: Einfach deine .webp oder .jpg Dateien in diesen Ordner kopieren
2. **HTML anpassen**: Die Bilder müssen dann in der `portfolio.html` und `index.html` eingetragen werden
3. **Bildpfad**: `assets/img/portfolio/dein-bildname.webp`

## Template für neue Bilder:
```html
<div class="portfolio-item">
  <div class="portfolio-image">
    <img src="assets/img/portfolio/dein-bildname.webp" alt="Beschreibung des Bildes" loading="lazy">
  </div>
  <div class="portfolio-overlay">
    <div class="portfolio-content">
      <span class="portfolio-category">Kategorie</span>
      <h3>Titel des Projekts</h3>
      <p>Beschreibung des Projekts</p>
      <a href="assets/img/portfolio/dein-bildname.webp" class="portfolio-link lightbox-trigger" 
         data-lightbox="portfolio" 
         data-title="Titel des Projekts" 
         data-description="Beschreibung des Projekts">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 3h6v6" stroke="currentColor" stroke-width="2"/>
          <path d="M10 14L21 3" stroke="currentColor" stroke-width="2"/>
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" stroke-width="2"/>
        </svg>
      </a>
    </div>
  </div>
</div>
```

## Optimierung für Web:
1. **Webp-Konvertierung**: Nutze Tools wie https://squoosh.app/ 
2. **Komprimierung**: Reduziere die Dateigröße ohne Qualitätsverlust
3. **Alt-Texte**: Beschreibe deine Bilder für bessere SEO

## Automatische Einbindung:
Falls du viele Bilder hast, kann ich dir ein Script erstellen, das automatisch alle Bilder aus diesem Ordner einbindet. 