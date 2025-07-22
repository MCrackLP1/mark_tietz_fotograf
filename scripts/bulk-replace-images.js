#!/usr/bin/env node

const fs = require('fs').promises;

// Helper function to generate picture tag
function generatePictureTag(imagePath, alt, cssClass = '', loading = 'lazy') {
  const pathParts = imagePath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const baseName = fileName.replace('.webp', '');
  const directory = pathParts.slice(0, -1).join('/');
  
  return `<picture${cssClass ? ` class="${cssClass}"` : ''}>
                <source type="image/avif" srcset="
                  ${directory}/${baseName}-small.avif 400w,
                  ${directory}/${baseName}-medium.avif 800w,
                  ${directory}/${baseName}-large.avif 1200w"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw">
                <source type="image/webp" srcset="
                  ${directory}/${baseName}-small.webp 400w,
                  ${directory}/${baseName}-medium.webp 800w,
                  ${directory}/${baseName}-large.webp 1200w"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw">
                <img src="${directory}/${baseName}-medium.webp" alt="${alt}" loading="${loading}">
              </picture>`;
}

async function replaceImagesInPortfolio() {
  console.log('🔄 Ersetzt alle Bilder in portfolio.html...');
  
  let content = await fs.readFile('portfolio.html', 'utf8');
  
  // Define all portfolio images that need to be replaced
  const imagesToReplace = [
    { src: 'assets/img/portfolio/studio_portrait-1.webp', alt: 'Studio Portrait - Professionelle Portraitfotografie' },
    { src: 'assets/img/portfolio/studio_portrait-2.webp', alt: 'Studio Portrait - Ausdrucksstarke Portraitfotografie' },
    { src: 'assets/img/portfolio/studio_portrait-3.webp', alt: 'Studio Portrait - Künstlerische Portraitfotografie' },
    { src: 'assets/img/portfolio/studio_portrait-4.webp', alt: 'Studio Portrait - Elegante Portraitfotografie' },
    { src: 'assets/img/portfolio/portrait-1.webp', alt: 'Portrait - Natürliche Ausstrahlung' },
    { src: 'assets/img/portfolio/portrait-2.webp', alt: 'Portrait - Charakterstark' },
    { src: 'assets/img/portfolio/portrait-3.webp', alt: 'Portrait - Professionelle Ausstrahlung' },
    { src: 'assets/img/portfolio/portrait-4.webp', alt: 'Portrait - Kreative Beleuchtung' },
    { src: 'assets/img/portfolio/portrait-5.webp', alt: 'Portrait - Emotionale Tiefe' },
    { src: 'assets/img/portfolio/portrait-6.webp', alt: 'Portrait - Klassisches Portrait' },
    { src: 'assets/img/portfolio/portrait-7.webp', alt: 'Portrait - Moderne Bildsprache' },
    { src: 'assets/img/portfolio/portrait-8.webp', alt: 'Portrait - Dramatische Ausstrahlung' },
    { src: 'assets/img/portfolio/portrait-9.webp', alt: 'Portrait - Spontane Authentizität' },
    { src: 'assets/img/portfolio/portrait-10.webp', alt: 'Portrait - Stilvolles Portrait' },
    { src: 'assets/img/portfolio/portrait-11.webp', alt: 'Portrait - Künstlerische Vision' },
    { src: 'assets/img/portfolio/portrait_2-1.webp', alt: 'Outdoor Portrait - Natürliches Licht' },
    { src: 'assets/img/portfolio/portrait_2-2.webp', alt: 'Outdoor Portrait - Urban Style' },
    { src: 'assets/img/portfolio/portrait_2-3.webp', alt: 'Outdoor Portrait - Lifestyle Fotografie' },
    { src: 'assets/img/portfolio/portrait_2-4.webp', alt: 'Outdoor Portrait - Goldene Stunde' },
    { src: 'assets/img/portfolio/portrait_2-5.webp', alt: 'Outdoor Portrait - Natur Harmonisch' },
    { src: 'assets/img/portfolio/portrait_2-6.webp', alt: 'Outdoor Portrait - Dynamische Komposition' },
    { src: 'assets/img/portfolio/portrait_2-7.webp', alt: 'Outdoor Portrait - Atmosphärisch' },
    { src: 'assets/img/portfolio/portrait_2-8.webp', alt: 'Outdoor Portrait - Authentische Momente' },
    { src: 'assets/img/portfolio/portrait_2-9.webp', alt: 'Outdoor Portrait - Spontane Aufnahme' },
    { src: 'assets/img/portfolio/portrait_2-10.webp', alt: 'Outdoor Portrait - Finale Perfektion' },
    { src: 'assets/img/portfolio/DSC02022.webp', alt: 'Event Fotografie - Besondere Momente' },
    { src: 'assets/img/portfolio/DSC02141-Verbessert-NR.webp', alt: 'Hochzeit - Romantische Zeremonie' },
    { src: 'assets/img/portfolio/DSC02867-Verbessert-NR.webp', alt: 'Event - Feierliche Stimmung' },
    { src: 'assets/img/portfolio/DSC_0665.webp', alt: 'Hochzeit - Emotionale Verbindung' },
    { src: 'assets/img/portfolio/DSC_0682 test.webp', alt: 'Event - Dynamische Aufnahme' },
    { src: 'assets/img/portfolio/DSC_0831-Verbessert-NR.webp', alt: 'Hochzeit - Perfekte Inszenierung' },
    { src: 'assets/img/portfolio/_A7_2.2.webp', alt: 'Fine Art - Künstlerische Vision' },
    { src: 'assets/img/portfolio/_A7_6.webp', alt: 'Fine Art - Experimentelle Fotografie' },
    { src: 'assets/img/portfolio/_DSC0851-Verbessert-NR.webp', alt: 'Event - Atmosphärische Stimmung' },
    { src: 'assets/img/portfolio/Baby-Shooting3.webp', alt: 'Familie - Zärtliche Babymomente' }
  ];
  
  let replaceCount = 0;
  
  for (const image of imagesToReplace) {
    const oldPattern = `<img src="${image.src}" alt="${image.alt}" loading="lazy">`;
    const newPicture = generatePictureTag(image.src, image.alt);
    
    if (content.includes(oldPattern)) {
      content = content.replace(oldPattern, newPicture);
      replaceCount++;
      console.log(`✅ Ersetzt: ${image.src}`);
    }
  }
  
  await fs.writeFile('portfolio.html', content);
  console.log(`\n🎉 ${replaceCount} Bilder in portfolio.html ersetzt!`);
}

async function replaceAuthorImages() {
  console.log('\n🔄 Ersetzt author-mark.webp in anderen Dateien...');
  
  const files = ['ueber-mich.html', 'philosophie.html'];
  
  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf8');
      
      const oldPattern = `<img src="assets/img/author-mark.webp" alt="Mark Tietz bei der Arbeit" class="about-portrait" loading="lazy">`;
      const newPicture = `<picture class="about-portrait">
                <source type="image/avif" srcset="
                  assets/img/author-mark-small.avif 400w,
                  assets/img/author-mark-medium.avif 800w,
                  assets/img/author-mark-large.avif 1200w"
                  sizes="(max-width: 768px) 100vw, 50vw">
                <source type="image/webp" srcset="
                  assets/img/author-mark-small.webp 400w,
                  assets/img/author-mark-medium.webp 800w,
                  assets/img/author-mark-large.webp 1200w"
                  sizes="(max-width: 768px) 100vw, 50vw">
                <img src="assets/img/author-mark-medium.webp" alt="Mark Tietz bei der Arbeit" class="about-portrait" loading="lazy">
              </picture>`;
      
      if (content.includes(oldPattern)) {
        content = content.replace(oldPattern, newPicture);
        await fs.writeFile(file, content);
        console.log(`✅ Author-Bild ersetzt in: ${file}`);
      }
    } catch (error) {
      console.log(`⚠️  Fehler bei ${file}: ${error.message}`);
    }
  }
}

async function main() {
  await replaceImagesInPortfolio();
  await replaceAuthorImages();
  console.log('\n🚀 Alle Bildersetzungen abgeschlossen!');
}

main().catch(console.error); 