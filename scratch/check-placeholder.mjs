import fs from 'fs';
import path from 'path';

function walk(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('PhasePlaceholder') && !fullPath.includes('PhasePlaceholder.tsx')) {
        console.log('Found PhasePlaceholder in:', fullPath);
      }
    }
  }
}

walk('src');
console.log('PhasePlaceholder check complete.');
