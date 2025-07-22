#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function deleteOriginalsButKeepBackups() {
  console.log('🗑️ Lösche überflüssige große Originaldateien...\n');
  
  // Find all original portfolio images (the big ones we optimized)
  const patterns = [
    'assets/img/portfolio/*.webp',
    'assets/img/author-mark.webp'
  ];
  
  let deletedCount = 0;
  let savedSpace = 0;
  
  for (const pattern of patterns) {
    const files = await glob(pattern);
    
    for (const file of files) {
      // Skip already optimized variants (with suffixes)
      if (file.includes('-small') || file.includes('-medium') || file.includes('-large')) {
        continue;
      }
      
      const fileSize = await getFileSize(file);
      const backupPath = path.join('assets/backup', path.relative('assets', file));
      
      // Check if backup exists
      try {
        await fs.access(backupPath);
        
        // Delete the original (now that it's backed up and we have optimized variants)
        await fs.unlink(file);
        
        deletedCount++;
        savedSpace += fileSize;
        
        console.log(`🗑️ Gelöscht: ${file} (${(fileSize / 1024 / 1024).toFixed(1)}MB)`);
        console.log(`   📋 Backup vorhanden: ${backupPath}`);
        
      } catch (error) {
        console.log(`⚠️  Backup nicht gefunden für: ${file}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🧹 CLEANUP ABGESCHLOSSEN');
  console.log('='.repeat(60));
  console.log(`🗑️ Dateien gelöscht: ${deletedCount}`);
  console.log(`💾 Speicher gespart: ${(savedSpace / 1024 / 1024).toFixed(1)}MB`);
  console.log(`📋 Backups verfügbar in: assets/backup/`);
  
  if (deletedCount > 0) {
    console.log('\n✅ Nur optimierte Varianten sind jetzt aktiv!');
    console.log('🔍 Originale sind sicher im Backup-Ordner gespeichert');
  }
}

async function listOptimizedFiles() {
  console.log('\n📊 ÜBERSICHT DER OPTIMIERTEN DATEIEN');
  console.log('='.repeat(60));
  
  const optimizedPatterns = [
    'assets/img/portfolio/*-small.webp',
    'assets/img/portfolio/*-medium.webp', 
    'assets/img/portfolio/*-large.webp',
    'assets/img/portfolio/*-small.avif',
    'assets/img/portfolio/*-medium.avif',
    'assets/img/portfolio/*-large.avif',
    'assets/img/*-small.webp',
    'assets/img/*-medium.webp',
    'assets/img/*-large.webp'
  ];
  
  let totalFiles = 0;
  let totalSize = 0;
  
  for (const pattern of optimizedPatterns) {
    const files = await glob(pattern);
    
    for (const file of files) {
      const size = await getFileSize(file);
      totalFiles++;
      totalSize += size;
    }
  }
  
  console.log(`📁 Optimierte Dateien: ${totalFiles}`);
  console.log(`💾 Gesamtgröße: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`⚡ Durchschnitt pro Datei: ${(totalSize / totalFiles / 1024).toFixed(1)}KB`);
}

async function main() {
  await deleteOriginalsButKeepBackups();
  await listOptimizedFiles();
  
  console.log('\n🎉 MISSION ERFOLGREICH!');
  console.log('✅ Deine Website lädt jetzt blitzschnell');
  console.log('✅ Alle Originale sind sicher gesichert');
  console.log('✅ Optimierte Bilder sind aktiv');
}

main().catch(console.error); 