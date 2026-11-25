import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const brand = path.join(root, 'assets', 'brand');

// 1200x630 social card from the hero artwork.
await sharp(path.join(root, 'assets', 'hero-vistula-racing.png'))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(brand, 'og-image.jpg'));

// Square touch icons from the logo on the site background colour.
for (const [size, name] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
  const logo = await sharp(path.join(brand, 'vr_logo.png')).resize({ width: Math.round(size * 0.88), height: Math.round(size * 0.88), fit: 'inside' }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#04060a' } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(path.join(brand, name));
}
console.log('OK: assets/brand (og-image, touch icons)');
