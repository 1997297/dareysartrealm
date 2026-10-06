import fs from 'fs';
import path from 'path';

const projectRoot = 'C:\\Users\\Young Duke\\Documents\\VS Codes Doc\\Darey\'s Artrealm';

// 1. Audit Mock Data Relationships
console.log('--- 1. AUDITING MOCK DATA ---');

try {
  const artworksFile = fs.readFileSync(path.join(projectRoot, 'src/data/mockArtworks.ts'), 'utf-8');
  const collectionsFile = fs.readFileSync(path.join(projectRoot, 'src/data/mockCollections.ts'), 'utf-8');
  const collectorFile = fs.readFileSync(path.join(projectRoot, 'src/data/mockCollectorData.ts'), 'utf-8');
  const studioFile = fs.readFileSync(path.join(projectRoot, 'src/data/mockStudioData.ts'), 'utf-8');

  // Find all artwork IDs and slugs
  const artworkIds = [...artworksFile.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const artworkSlugs = [...artworksFile.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log(`Found ${artworkIds.length} artwork IDs, ${artworkSlugs.length} artwork slugs`);

  // Check duplicate artwork IDs
  const dupIds = artworkIds.filter((item, index) => artworkIds.indexOf(item) !== index);
  if (dupIds.length) console.warn('DUPLICATE ARTWORK IDS:', dupIds);
  else console.log('✓ All artwork IDs are unique');

  // Check duplicate artwork Slugs
  const dupSlugs = artworkSlugs.filter((item, index) => artworkSlugs.indexOf(item) !== index);
  if (dupSlugs.length) console.warn('DUPLICATE ARTWORK SLUGS:', dupSlugs);
  else console.log('✓ All artwork slugs are unique');

  // Check collection IDs
  const colIds = [...collectionsFile.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log(`Found ${colIds.length} collection IDs`);

} catch (err) {
  console.error('Error auditing mock data:', err);
}

// 2. Audit routes with PhasePlaceholder
console.log('\n--- 2. AUDITING ROUTES ---');
function findFiles(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, filter));
    } else if (filter(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

const pageFiles = findFiles(path.join(projectRoot, 'src/app'), f => f === 'page.tsx');
console.log(`Total routes (page.tsx): ${pageFiles.length}`);

const placeholderPages = [];
for (const pf of pageFiles) {
  const content = fs.readFileSync(pf, 'utf-8');
  if (content.includes('PhasePlaceholder')) {
    placeholderPages.push(path.relative(projectRoot, pf));
  }
}
console.log('Pages using PhasePlaceholder:', placeholderPages);

// 3. Search for TODO/FIXME/lorem
console.log('\n--- 3. AUDITING TEXT DEBRIS IN SRC ---');
const allSrcFiles = findFiles(path.join(projectRoot, 'src'), f => f.endsWith('.ts') || f.endsWith('.tsx'));
const debrisMatches = [];
for (const sf of allSrcFiles) {
  const content = fs.readFileSync(sf, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/\b(TODO|FIXME|lorem ipsum)\b/i.test(line)) {
      debrisMatches.push(`${path.relative(projectRoot, sf)}:${idx + 1}: ${line.trim()}`);
    }
  });
}
console.log(`Found ${debrisMatches.length} text debris items:`);
debrisMatches.forEach(m => console.log('  ', m));
