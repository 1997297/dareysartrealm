import http from 'http';

const routes = [
  // PUBLIC
  '/',
  '/artworks',
  '/artworks/echoes-of-home',
  '/artworks/pic1',
  '/collections',
  '/collections/human-stories',
  '/commission',
  '/services',
  '/services/original-artwork',
  '/services/custom-commissions',
  '/services/murals',
  '/services/interior-finishes',
  '/services/house-painting-finishing',
  '/about',
  '/contact',
  '/search',
  '/saved',
  '/cart',
  '/checkout',
  '/order/DAR-ORD-DEV-0001',
  '/authenticity',
  '/terms',
  '/privacy',

  // AUTH
  '/login',
  '/register',
  '/forgot-password',

  // COLLECTOR
  '/account',
  '/account/orders',
  '/account/orders/DAR-ORD-DEV-0001',
  '/account/commissions',
  '/account/commissions/COM-DEV-4921',
  '/account/saved',
  '/account/certificates',
  '/account/messages',
  '/account/profile',

  // STUDIO
  '/studio',
  '/studio/artworks',
  '/studio/artworks/new',
  '/studio/collections',
  '/studio/collections/new',
  '/studio/orders',
  '/studio/orders/DAR-ORD-DEV-0001',
  '/studio/commissions',
  '/studio/commissions/COM-DEV-4921',
  '/studio/services',
  '/studio/service-requests',
  '/studio/enquiries',
  '/studio/collectors',
  '/studio/collectors/usr-collector-001',
  '/studio/media',
  '/studio/reviews',
  '/studio/analytics',
  '/studio/notifications',
  '/studio/pages',
  '/studio/settings'
];

async function checkRoute(url) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${url}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          hasPhasePlaceholder: data.includes('PhasePlaceholder'),
          length: data.length
        });
      });
    });
    req.on('error', (err) => {
      resolve({ url, error: err.message });
    });
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ url, error: 'Timeout' });
    });
  });
}

async function run() {
  console.log(`Auditing ${routes.length} routes against localhost:3000...\n`);
  let passed = 0;
  let failed = 0;

  for (const r of routes) {
    const res = await checkRoute(r);
    if (res.error) {
      console.log(`❌ ${r}: Error: ${res.error}`);
      failed++;
    } else if (res.status === 200) {
      if (res.hasPhasePlaceholder) {
        console.log(`⚠️ ${r}: 200 OK but CONTAINS PhasePlaceholder!`);
        failed++;
      } else {
        console.log(`✓ ${r}: 200 OK (${res.length} bytes)`);
        passed++;
      }
    } else {
      console.log(`❌ ${r}: HTTP ${res.status}`);
      failed++;
    }
  }

  console.log(`\n=============================`);
  console.log(`Audit Summary: ${passed} Passed, ${failed} Failed out of ${routes.length} routes.`);
  console.log(`=============================`);
}

run();
