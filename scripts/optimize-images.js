#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

// Konfiguration für verschiedene Bildtypen
const CONFIG = {
  portfolio: {
    sizes: [
      { width: 400, height: 300, suffix: '-thumb' },
      { width: 800, height: 600, suffix: '-medium' },
      { width: 1200, height: 900, suffix: '-large' },
      { width: 1920, height: 1440, suffix: '-xl' }
    ],
    quality: {
      webp: 85,
      avif: 80,
      jpeg: 90
    }
  },
  hero: {
    sizes: [
      { width: 768, height: 432, suffix: '-mobile' },
      { width: 1024, height: 576, suffix: '-tablet' },
      { width: 1920, height: 1080, suffix: '-desktop' },
      { width: 2560, height: 1440, suffix: '-4k' }
    ],
    quality: {
      webp: 90,
      avif: 85,
      jpeg: 95
    }
  },
  general: {
    sizes: [
      { width: 400, suffix: '-small' },
      { width: 800, suffix: '-medium' },
      { width: 1200, suffix: '-large' }
    ],
    quality: {
      webp: 80,
      avif: 75,
      jpeg: 85
    }
  }
};

class ImageOptimizer {
  constructor(options = {}) {
    this.force = options.force || false;
    this.verbose = options.verbose || true;
    this.backupDir = 'assets/backup';
    this.processedFiles = new Set();
    this.stats = {
      processed: 0,
      skipped: 0,
      errors: 0,
      originalSize: 0,
      optimizedSize: 0
    };
  }

  async init() {
    // Backup-Verzeichnis erstellen
    await this.ensureDir(this.backupDir);
    console.log('🚀 Starte Bildoptimierung...\n');
  }

  async ensureDir(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  getImageType(filePath) {
    if (filePath.includes('/hero/')) return 'hero';
    if (filePath.includes('/portfolio/')) return 'portfolio';
    return 'general';
  }

  async createBackup(filePath) {
    const backupPath = path.join(this.backupDir, path.relative('assets', filePath));
    await this.ensureDir(path.dirname(backupPath));
    
    try {
      await fs.access(backupPath);
      if (this.verbose) console.log(`📋 Backup existiert bereits: ${backupPath}`);
    } catch {
      await fs.copyFile(filePath, backupPath);
      if (this.verbose) console.log(`💾 Backup erstellt: ${backupPath}`);
    }
  }

  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  async shouldProcess(filePath, outputPath) {
    if (this.force) return true;
    
    try {
      await fs.access(outputPath);
      const inputStats = await fs.stat(filePath);
      const outputStats = await fs.stat(outputPath);
      return inputStats.mtime > outputStats.mtime;
    } catch {
      return true;
    }
  }

  async optimizeImage(inputPath, config) {
    const imageType = this.getImageType(inputPath);
    const settings = CONFIG[imageType];
    const originalSize = await this.getFileSize(inputPath);
    
    if (this.verbose) {
      console.log(`\n📸 Verarbeite: ${path.relative(process.cwd(), inputPath)}`);
      console.log(`   Typ: ${imageType} | Größe: ${(originalSize / 1024).toFixed(1)}KB`);
    }

    try {
      // Backup erstellen
      await this.createBackup(inputPath);

      const image = sharp(inputPath);
      const metadata = await image.metadata();
      const dir = path.dirname(inputPath);
      const name = path.parse(inputPath).name;
      const results = [];

      // Original optimieren
      const originalOptimized = await this.processFormat(image, inputPath, settings.quality);
      results.push(originalOptimized);

      // Responsive Größen erstellen
      for (const size of settings.sizes) {
        const resized = image.clone().resize({
          width: size.width,
          height: size.height,
          fit: 'inside',
          withoutEnlargement: true
        });

        // WebP Version
        const webpPath = path.join(dir, `${name}${size.suffix}.webp`);
        if (await this.shouldProcess(inputPath, webpPath)) {
          await resized.clone()
            .webp({ quality: settings.quality.webp })
            .toFile(webpPath);
          
          const size = await this.getFileSize(webpPath);
          results.push({ path: webpPath, size });
        }

        // AVIF Version (modernste Format)
        const avifPath = path.join(dir, `${name}${size.suffix}.avif`);
        if (await this.shouldProcess(inputPath, avifPath)) {
          try {
            await resized.clone()
              .avif({ quality: settings.quality.avif })
              .toFile(avifPath);
            
            const size = await this.getFileSize(avifPath);
            results.push({ path: avifPath, size });
          } catch (err) {
            if (this.verbose) console.log(`   ⚠️  AVIF nicht unterstützt: ${err.message}`);
          }
        }
      }

      // Statistiken aktualisieren
      const totalOptimizedSize = results.reduce((sum, r) => sum + r.size, 0);
      this.stats.originalSize += originalSize;
      this.stats.optimizedSize += totalOptimizedSize;
      this.stats.processed++;

      if (this.verbose) {
        console.log(`   ✅ ${results.length} Varianten erstellt`);
        console.log(`   💾 Komprimierung: ${((1 - totalOptimizedSize / (originalSize * results.length)) * 100).toFixed(1)}%`);
      }

    } catch (error) {
      this.stats.errors++;
      console.error(`❌ Fehler bei ${inputPath}: ${error.message}`);
    }
  }

  async processFormat(image, inputPath, quality) {
    const dir = path.dirname(inputPath);
    const parsed = path.parse(inputPath);
    const ext = parsed.ext.toLowerCase();

    if (ext === '.webp') {
      // WebP optimieren
      const optimizedPath = inputPath;
      if (await this.shouldProcess(inputPath, optimizedPath)) {
        await image.webp({ quality: quality.webp }).toFile(optimizedPath + '.tmp');
        await fs.rename(optimizedPath + '.tmp', optimizedPath);
      }
      return { path: optimizedPath, size: await this.getFileSize(optimizedPath) };
    } 
    
    else if (ext === '.avif') {
      // AVIF optimieren
      const optimizedPath = inputPath;
      if (await this.shouldProcess(inputPath, optimizedPath)) {
        await image.avif({ quality: quality.avif }).toFile(optimizedPath + '.tmp');
        await fs.rename(optimizedPath + '.tmp', optimizedPath);
      }
      return { path: optimizedPath, size: await this.getFileSize(optimizedPath) };
    }
    
    else {
      // JPEG/PNG zu WebP konvertieren und Original optimieren
      const webpPath = path.join(dir, parsed.name + '.webp');
      
      if (await this.shouldProcess(inputPath, webpPath)) {
        await image.webp({ quality: quality.webp }).toFile(webpPath);
      }

      // Original auch optimieren
      if (ext === '.jpg' || ext === '.jpeg') {
        await image.jpeg({ quality: quality.jpeg }).toFile(inputPath + '.tmp');
        await fs.rename(inputPath + '.tmp', inputPath);
      } else if (ext === '.png') {
        await image.png({ quality: quality.webp }).toFile(inputPath + '.tmp');
        await fs.rename(inputPath + '.tmp', inputPath);
      }

      return { path: webpPath, size: await this.getFileSize(webpPath) };
    }
  }

  async findImages() {
    const patterns = [
      'assets/**/*.{jpg,jpeg,png,webp,avif}',
      'assets/**/*.{JPG,JPEG,PNG,WEBP,AVIF}'
    ];

    const files = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, { ignore: ['**/backup/**'] });
      files.push(...matches);
    }

    return [...new Set(files)]; // Duplikate entfernen
  }

  async run() {
    await this.init();

    const images = await this.findImages();
    console.log(`🔍 ${images.length} Bilder gefunden\n`);

    let processed = 0;
    for (const imagePath of images) {
      processed++;
      
      if (this.verbose) {
        console.log(`\n[${processed}/${images.length}] Verarbeite: ${path.basename(imagePath)}`);
      }

      await this.optimizeImage(imagePath);
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 OPTIMIERUNG ABGESCHLOSSEN');
    console.log('='.repeat(60));
    console.log(`✅ Verarbeitet: ${this.stats.processed}`);
    console.log(`⏭️  Übersprungen: ${this.stats.skipped}`);
    console.log(`❌ Fehler: ${this.stats.errors}`);
    
    if (this.stats.originalSize > 0) {
      const originalMB = (this.stats.originalSize / (1024 * 1024)).toFixed(1);
      const optimizedMB = (this.stats.optimizedSize / (1024 * 1024)).toFixed(1);
      const savings = ((1 - this.stats.optimizedSize / this.stats.originalSize) * 100).toFixed(1);
      
      console.log(`💾 Original: ${originalMB}MB`);
      console.log(`💾 Optimiert: ${optimizedMB}MB`);
      console.log(`🚀 Einsparung: ${savings}%`);
    }
    
    console.log('\n💡 Tipps:');
    console.log('   • Verwende <picture> Tags für moderne Formate');
    console.log('   • Lade Bilder lazy mit loading="lazy"');
    console.log('   • Nutze responsive Größen für bessere Performance');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const verbose = !args.includes('--quiet');

  const optimizer = new ImageOptimizer({ force, verbose });
  await optimizer.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ImageOptimizer; 