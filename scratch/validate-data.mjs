import { MOCK_ARTWORKS } from '../src/data/mockArtworks.js';
import { MOCK_COLLECTIONS } from '../src/data/mockCollections.js';
import { INITIAL_MOCK_ORDERS, INITIAL_MOCK_COMMISSIONS, INITIAL_MOCK_CERTIFICATES } from '../src/data/mockCollectorData.js';
import { INITIAL_STUDIO_ARTWORKS, INITIAL_STUDIO_ORDERS, INITIAL_STUDIO_COMMISSIONS, INITIAL_STUDIO_COLLECTIONS } from '../src/data/mockStudioData.js';

console.log('--- CHECKING ACTUAL EXPORTED DATA ---');
console.log('MOCK_ARTWORKS count:', MOCK_ARTWORKS.length);
const artIds = MOCK_ARTWORKS.map(a => a.id);
const artSlugs = MOCK_ARTWORKS.map(a => a.slug);

const dupArtIds = artIds.filter((item, index) => artIds.indexOf(item) !== index);
console.log('Duplicate artwork IDs:', dupArtIds);

const dupArtSlugs = artSlugs.filter((item, index) => artSlugs.indexOf(item) !== index);
console.log('Duplicate artwork Slugs:', dupArtSlugs);

console.log('MOCK_COLLECTIONS count:', MOCK_COLLECTIONS.length);
const colSlugs = MOCK_COLLECTIONS.map(c => c.slug);
console.log('Collection slugs:', colSlugs);

// Check if all artworks point to valid collections
const invalidArtworkCollections = MOCK_ARTWORKS.filter(a => a.collection && !colSlugs.includes(a.collection.slug));
console.log('Artworks with invalid collection slug:', invalidArtworkCollections.length);

// Check order artworks
console.log('INITIAL_MOCK_ORDERS count:', INITIAL_MOCK_ORDERS.length);
const orderInvalidArtworks = INITIAL_MOCK_ORDERS.filter(o => o.items.some(item => !artIds.includes(item.artwork.id)));
console.log('Orders with invalid artwork IDs:', orderInvalidArtworks.length);

// Check certificate artworks
console.log('INITIAL_MOCK_CERTIFICATES count:', INITIAL_MOCK_CERTIFICATES.length);
const certInvalidArtworks = INITIAL_MOCK_CERTIFICATES.filter(c => !artIds.includes(c.artworkId));
console.log('Certificates with invalid artwork ID:', certInvalidArtworks.length);
if (certInvalidArtworks.length > 0) {
  console.log('Invalid certs:', certInvalidArtworks.map(c => ({ id: c.id, artworkId: c.artworkId, title: c.title })));
}

// Check studio artworks
console.log('INITIAL_STUDIO_ARTWORKS count:', INITIAL_STUDIO_ARTWORKS.length);
const studioArtIds = INITIAL_STUDIO_ARTWORKS.map(a => a.id);
const dupStudioIds = studioArtIds.filter((item, index) => studioArtIds.indexOf(item) !== index);
console.log('Duplicate studio artwork IDs:', dupStudioIds);

// Check studio orders
console.log('INITIAL_STUDIO_ORDERS count:', INITIAL_STUDIO_ORDERS.length);
const studioOrderInvalidArtworks = INITIAL_STUDIO_ORDERS.filter(o => o.items.some(item => !studioArtIds.includes(item.artwork.id) && !artIds.includes(item.artwork.id)));
console.log('Studio orders with unknown artwork IDs:', studioOrderInvalidArtworks.length);
if (studioOrderInvalidArtworks.length > 0) {
  console.log('Studio orders with unknown artwork IDs:', studioOrderInvalidArtworks.map(o => ({ orderId: o.id, items: o.items.map(i => i.artwork.id) })));
}
