import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SOURCE_IMAGE_PATH =
  'C:\\Users\\Young Duke\\.gemini\\antigravity\\brain\\d27d07c5-046a-4cff-8a7d-8ac73b57dd97\\.user_uploaded\\media_1791413758102_4eeb08a2.png';

export async function GET() {
  try {
    const targetDir = path.join(process.cwd(), 'public', 'artworks');
    const targetHeroPng = path.join(targetDir, 'hero.png');
    const targetHeroBg = path.join(targetDir, 'hero-bg.png');
    const targetHeroJpeg = path.join(targetDir, 'hero.jpeg');

    if (fs.existsSync(SOURCE_IMAGE_PATH)) {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.copyFileSync(SOURCE_IMAGE_PATH, targetHeroPng);
      fs.copyFileSync(SOURCE_IMAGE_PATH, targetHeroBg);
      fs.copyFileSync(SOURCE_IMAGE_PATH, targetHeroJpeg);

      const fileBuffer = fs.readFileSync(SOURCE_IMAGE_PATH);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    if (fs.existsSync(targetHeroPng)) {
      const fileBuffer = fs.readFileSync(targetHeroPng);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (error) {
    console.error('Error serving or syncing hero image:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

