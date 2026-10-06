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
      if (content.includes('reviewService') || content.includes('INITIAL_REVIEWS')) {
        console.log('Reviews used in:', fullPath);
      }
    }
  }
}

walk('src');
