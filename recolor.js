/**
 * ONYX & CHAMPAGNE - Full Site Recoloring Script
 * Replaces ALL blue (#2563EB) references with the new premium palette
 * 
 * Primary Accent: #C4A47C (Champagne Gold) - for highlights, text accents, charts
 * Primary Dark:   #111827 (Onyx Black) - for solid button backgrounds
 * Warm Cream:     #F8F5F0 - replaces blue-50 backgrounds
 * Soft Champagne: #E8DDD0 - replaces blue-100 borders
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');

// All files to process
const targetFiles = [];

function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (/\.(jsx?|css)$/.test(item)) {
      targetFiles.push(full);
    }
  }
}

walk(SRC);

// Also process generatePDF
const pdfFile = path.join(SRC, 'utils', 'generatePDF.js');

console.log(`Found ${targetFiles.length} files to process.\n`);

// ==================== REPLACEMENT RULES ====================
// Order matters! More specific patterns first.

const replacements = [
  // ===== CSS VARIABLES =====
  ['--primary: #2563eb', '--primary: #C4A47C'],
  ['--primary-dark: #1e40af', '--primary-dark: #A68B5B'],
  ['--primary-light: #3b82f6', '--primary-light: #D4B88C'],

  // ===== RGBA (CSS glow, selection, focus) =====
  ['rgba(37, 99, 235, 0.15)', 'rgba(196, 164, 124, 0.15)'],
  ['rgba(37, 99, 235, 0.1)', 'rgba(196, 164, 124, 0.1)'],
  ['rgba(37, 99, 235, 0.2)', 'rgba(196, 164, 124, 0.2)'],
  ['rgba(37, 99, 235, 0.6)', 'rgba(196, 164, 124, 0.5)'],

  // ===== PDF GENERATION =====
  ['const primaryColor = [37, 99, 235]; // #2563EB', 'const primaryColor = [196, 164, 124]; // #C4A47C'],

  // ===== BADGE PRIMARY =====
  ['background: #dbeafe', 'background: #F8F5F0'],

  // ===== COMPLEX TAILWIND: focus/hover with #2563EB =====
  ['focus:border-[#2563EB]/30', 'focus:border-[#C4A47C]/30'],
  ['focus:ring-[#2563EB]/10', 'focus:ring-[#C4A47C]/10'],
  ['focus:border-[#2563EB]/40', 'focus:border-[#C4A47C]/40'],
  ['focus:border-[#2563EB]', 'focus:border-[#C4A47C]'],
  ['focus:ring-4 focus:ring-blue-50', 'focus:ring-4 focus:ring-[#F8F5F0]'],
  ['focus:ring-2 focus:ring-blue-500/10', 'focus:ring-2 focus:ring-[#C4A47C]/10'],
  ['group-focus-within:text-[#2563EB]', 'group-focus-within:text-[#C4A47C]'],

  // ===== HOVER STATES =====
  ['hover:bg-[#2563EB]', 'hover:bg-[#C4A47C]'],
  ['hover:text-[#2563EB]', 'hover:text-[#C4A47C]'],
  ['hover:border-[#2563EB]', 'hover:border-[#C4A47C]'],
  ['hover:shadow-blue-500/30', 'hover:shadow-black/15'],
  ['hover:shadow-blue-500/40', 'hover:shadow-black/20'],
  ['hover:shadow-blue-500/20', 'hover:shadow-black/10'],
  ['hover:bg-blue-50', 'hover:bg-[#F8F5F0]'],
  ['hover:bg-blue-100', 'hover:bg-[#F0EBE3]'],
  ['hover:text-blue-600', 'hover:text-[#C4A47C]'],
  ['hover:text-blue-700', 'hover:text-[#A68B5B]'],
  ['hover:border-blue-200', 'hover:border-[#C4A47C]'],
  ['hover:border-blue-300', 'hover:border-[#C4A47C]'],

  // ===== SHADOW BLUES → BLACK =====
  ['shadow-blue-500/5', 'shadow-black/5'],
  ['shadow-blue-500/10', 'shadow-black/8'],
  ['shadow-blue-500/20', 'shadow-black/10'],
  ['shadow-blue-500/30', 'shadow-black/15'],
  ['shadow-blue-500/40', 'shadow-black/20'],
  ['shadow-blue-600/20', 'shadow-black/10'],
  ['shadow-blue-600/30', 'shadow-black/15'],

  // ===== GRADIENT STOPS =====
  ['from-[#2563EB]', 'from-[#111827]'],
  ['from-blue-400', 'from-[#C4A47C]'],
  ['from-blue-500', 'from-[#111827]'],
  ['from-blue-600', 'from-[#0D1321]'],
  ['from-blue-700', 'from-[#0a0a1a]'],
  ['to-blue-600', 'to-[#1a1a2e]'],
  ['to-blue-700', 'to-[#0a0a1a]'],
  ['to-blue-800', 'to-[#0a0a0a]'],
  ['via-blue-400/40', 'via-[#C4A47C]/30'],
  ['via-blue-400', 'via-[#C4A47C]'],
  ['via-blue-500', 'via-[#C4A47C]'],
  
  // ===== BG BLUE → ONYX / CREAM =====
  ['bg-[#2563EB]', 'bg-[#111827]'],
  ['bg-blue-50', 'bg-[#F8F5F0]'],
  ['bg-blue-100', 'bg-[#F0EBE3]'],
  ['bg-blue-500', 'bg-[#111827]'],
  ['bg-blue-600', 'bg-[#111827]'],
  ['bg-blue-700', 'bg-[#0D1321]'],
  ['bg-blue-800', 'bg-[#0a0a0a]'],

  // ===== HERO SECTION AMBIENT GLOWS =====
  ['bg-blue-600/20', 'bg-[#C4A47C]/12'],
  ['bg-blue-600/15', 'bg-[#C4A47C]/10'],
  ['bg-indigo-700/20', 'bg-[#8B7355]/12'],
  ['bg-indigo-600/10', 'bg-[#8B7355]/8'],
  ['bg-purple-600/10', 'bg-[#8B7355]/8'],

  // ===== TEXT BLUE → CHAMPAGNE =====
  ['text-[#2563EB]', 'text-[#C4A47C]'],
  ['text-blue-400', 'text-[#D4B88C]'],
  ['text-blue-500', 'text-[#C4A47C]'],
  ['text-blue-600', 'text-[#C4A47C]'],
  ['text-blue-700', 'text-[#A68B5B]'],
  ['text-blue-800', 'text-[#8B7355]'],

  // ===== BORDER BLUE → CHAMPAGNE =====
  ['border-[#2563EB]', 'border-[#C4A47C]'],
  ['border-blue-50', 'border-[#F8F5F0]'],
  ['border-blue-100', 'border-[#E8DDD0]'],
  ['border-blue-200', 'border-[#DDD0C0]'],
  ['border-blue-400', 'border-[#C4A47C]'],
  ['border-blue-500', 'border-[#C4A47C]'],
  ['border-blue-500/5', 'border-[#C4A47C]/5'],
  ['border-blue-500/10', 'border-[#C4A47C]/10'],

  // ===== RING BLUE → CHAMPAGNE =====
  ['ring-blue-50', 'ring-[#F8F5F0]'],
  ['ring-blue-500', 'ring-[#C4A47C]'],
  ['ring-blue-100', 'ring-[#E8DDD0]'],

  // ===== DIVIDE =====
  ['divide-blue-100', 'divide-[#E8DDD0]'],

  // ===== CHART / RECHARTS SPECIFIC =====
  // In OverviewTab.jsx the chart uses stroke="#2563EB" and fill references
  ['stroke="#2563EB"', 'stroke="#C4A47C"'],
  ["stroke: '#2563EB'", "stroke: '#C4A47C'"],
  ["sparkColor: '#2563EB'", "sparkColor: '#C4A47C'"],
  ["fill: '#2563EB'", "fill: '#C4A47C'"],

  // ===== DECORATION =====
  ['decoration-blue-500', 'decoration-[#C4A47C]'],
  ['decoration-blue-400', 'decoration-[#C4A47C]'],

  // ===== ACCENT COLOR =====
  ['accent-blue-600', 'accent-[#C4A47C]'],
  ['accent-blue-500', 'accent-[#C4A47C]'],

  // ===== TAILWIND DATEPICKER primaryColor =====
  ['primaryColor={"blue"}', 'primaryColor={"amber"}'],
  ["primaryColor={'blue'}", "primaryColor={'amber'}"],

  // ===== CATCH-ALL: any remaining bare #2563EB (case insensitive) =====
  // Don't replace if inside a comment referencing old color
];

let totalReplacements = 0;

for (const file of targetFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let fileChanges = 0;

  for (const [search, replace] of replacements) {
    // Count occurrences
    const count = content.split(search).length - 1;
    if (count > 0) {
      content = content.split(search).join(replace);
      fileChanges += count;
    }
  }

  // Final sweep: catch any remaining #2563EB that wasn't caught by specific rules
  const remaining = (content.match(/#2563EB/gi) || []).length;
  if (remaining > 0) {
    // Replace text contexts with champagne, bg contexts with onyx
    // Simple heuristic: if preceded by "text-[" use champagne, if "bg-[" use onyx
    content = content.replace(/bg-\[#2563EB\]/gi, 'bg-[#111827]');
    content = content.replace(/text-\[#2563EB\]/gi, 'text-[#C4A47C]');
    content = content.replace(/border-\[#2563EB\]/gi, 'border-[#C4A47C]');
    // Any other remaining #2563EB → champagne (it's likely a text/accent context)
    content = content.replace(/#2563EB/gi, '#C4A47C');
    fileChanges += remaining;
  }

  if (fileChanges > 0) {
    fs.writeFileSync(file, content, 'utf-8');
    const rel = path.relative(__dirname, file);
    console.log(`  ✅ ${rel} — ${fileChanges} replacements`);
    totalReplacements += fileChanges;
  }
}

console.log(`\n🎨 DONE! ${totalReplacements} total color replacements across ${targetFiles.length} files.`);
console.log('   Palette: Onyx (#111827) & Champagne (#C4A47C)');
