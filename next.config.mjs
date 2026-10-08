import fs from 'fs';
import path from 'path';

// Automatically ensure the uploaded hero background image is synced to public assets
const sourceHeroImg =
  'C:\\Users\\Young Duke\\.gemini\\antigravity\\brain\\d27d07c5-046a-4cff-8a7d-8ac73b57dd97\\.user_uploaded\\media_1791413758102_4eeb08a2.png';
const publicDir = path.join(process.cwd(), 'public', 'artworks');

try {
  if (fs.existsSync(sourceHeroImg)) {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.copyFileSync(sourceHeroImg, path.join(publicDir, 'hero.png'));
    fs.copyFileSync(sourceHeroImg, path.join(publicDir, 'hero-bg.png'));
    fs.copyFileSync(sourceHeroImg, path.join(publicDir, 'hero.jpeg'));
    console.log('[Assets] Hero background image synchronized to public/artworks.');
  }
} catch (e) {
  console.error('[Assets] Failed to sync hero image in next.config.mjs:', e);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
