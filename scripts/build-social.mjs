// Renders social/share assets from the generated SVGs:
//   public/og/paintfix.png, public/og/aviation.png (1200x630)
//   public/favicon-32.png, public/apple-touch-icon.png, public/icon-512.png
// Run after `python3 scripts/build-logo.py`.
import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const p = (rel) => new URL(rel, root).pathname;
await mkdir(p('public/og'), { recursive: true });

await sharp(p('scripts/out/og-paintfix.svg'), { density: 144 })
  .resize(1200, 630)
  .png()
  .toFile(p('public/og/paintfix.png'));

const overlay = await sharp(p('scripts/out/og-aviation-overlay.svg'), { density: 144 })
  .resize(1200, 630)
  .png()
  .toBuffer();
await sharp(p('src/assets/img/ph/av-interlude.webp'))
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .composite([{ input: overlay }])
  .png()
  .toFile(p('public/og/aviation.png'));

const fav = await readFile(p('public/favicon.svg'));
await sharp(fav, { density: 384 }).resize(32, 32).png().toFile(p('public/favicon-32.png'));
await sharp(fav, { density: 1024 })
  .resize(180, 180)
  .flatten({ background: '#1a1d21' })
  .png()
  .toFile(p('public/apple-touch-icon.png'));
await sharp(fav, { density: 1536 }).resize(512, 512).png().toFile(p('public/icon-512.png'));
console.log('social assets written');
