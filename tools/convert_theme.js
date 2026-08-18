import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/App.tsx',
  'src/components/ui/Navigation.tsx',
  'src/components/ui/HeroSection.tsx',
  'src/components/ui/ProblemSection.tsx',
  'src/components/ui/FeaturesSection.tsx',
  'src/components/ui/SpecsSection.tsx',
  'src/components/ui/CTASection.tsx',
];

const replacements = [
  // Backgrounds
  { from: /bg-\[#050505\]/g, to: 'bg-[#fafafa]' },
  { from: /bg-slate-950\/40/g, to: 'bg-white/60' },
  { from: /bg-slate-900\/60/g, to: 'bg-white/60' },
  { from: /bg-slate-950\/80/g, to: 'bg-white/80' },
  { from: /bg-slate-900\/80/g, to: 'bg-white/80' },
  { from: /bg-slate-800/g, to: 'bg-white' },
  { from: /bg-cyan-950\/30/g, to: 'bg-blue-50/50' },
  { from: /bg-cyan-950\/40/g, to: 'bg-blue-50/50' },
  { from: /bg-red-950\/20/g, to: 'bg-red-50/50' },
  { from: /bg-red-950\/40/g, to: 'bg-red-50/50' },
  { from: /bg-emerald-950\/20/g, to: 'bg-emerald-50/50' },
  
  // Text colors
  { from: /text-white/g, to: 'text-slate-900' },
  { from: /text-slate-300/g, to: 'text-slate-600' },
  { from: /text-slate-400/g, to: 'text-slate-500' },
  { from: /text-slate-500/g, to: 'text-slate-400' },
  { from: /text-cyan-300/g, to: 'text-blue-600' },
  { from: /text-cyan-400/g, to: 'text-blue-600' },
  { from: /text-cyan-500/g, to: 'text-blue-600' },
  { from: /text-red-400/g, to: 'text-red-600' },
  { from: /text-red-300/g, to: 'text-red-500' },
  { from: /text-amber-400/g, to: 'text-amber-600' },
  { from: /text-emerald-400/g, to: 'text-emerald-600' },
  
  // Gradients
  { from: /from-white via-slate-100 to-slate-400/g, to: 'from-slate-900 via-slate-700 to-slate-500' },
  { from: /from-cyan-300 via-blue-200 to-indigo-300/g, to: 'from-blue-600 via-cyan-600 to-indigo-600' },
  
  // Borders
  { from: /border-white\/10/g, to: 'border-slate-200' },
  { from: /border-white\/5/g, to: 'border-slate-100' },
  { from: /border-cyan-500\/40/g, to: 'border-blue-200' },
  { from: /border-cyan-500\/30/g, to: 'border-blue-200' },
  { from: /border-red-500\/20/g, to: 'border-red-200' },
  { from: /border-emerald-500\/20/g, to: 'border-emerald-200' },
  { from: /border-slate-800\/50/g, to: 'border-slate-200' },
  { from: /border-slate-800/g, to: 'border-slate-200' },
  { from: /border-slate-600/g, to: 'border-slate-300' },
  { from: /border-slate-700/g, to: 'border-slate-200' },
  
  // Shadows
  { from: /shadow-\[0_0_20px_rgba\(6,182,212,0.2\)\]/g, to: 'shadow-sm' },
  { from: /shadow-\[0_10px_35px_rgba\(255,255,255,0.15\)\]/g, to: '' },
  
  // Selections
  { from: /selection:bg-cyan-500\/30/g, to: 'selection:bg-blue-500/20' },
];

for (const relPath of filesToUpdate) {
  const fullPath = path.join('/Users/mac/Desktop/OpenHouse-3D', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${fullPath}`);
}
