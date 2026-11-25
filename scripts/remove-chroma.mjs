import path from 'node:path';
import sharp from 'sharp';

const [input, output, preserveValue = ''] = process.argv.slice(2);
if (!input || !output) {
  console.error('Użycie: node scripts/remove-chroma.mjs <input> <output>');
  process.exit(1);
}

const source = path.resolve(input);
const destination = path.resolve(output);
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const preserve = preserveValue.split(',').map(Number);

for (let offset = 0; offset < data.length; offset += 4) {
  const pixel = offset / 4;
  const x = pixel % info.width;
  const y = Math.floor(pixel / info.width);
  if (preserve.length === 4 && x >= preserve[0] && x <= preserve[0] + preserve[2] && y >= preserve[1] && y <= preserve[1] + preserve[3]) continue;

  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const dominance = green - Math.max(red, blue);
  const isKey = green > 28 && dominance > 14 && green > red * 1.24 && green > blue * 1.24;
  if (!isKey) continue;

  const matte = Math.max(0, Math.min(1, (dominance - 14) / 28));
  data[offset + 3] = Math.round(255 * (1 - matte));
  data[offset + 1] = Math.min(green, Math.max(red, blue) + 18);
}

await sharp(data, { raw: info })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(destination);

console.log(`OK: ${path.relative(process.cwd(), destination)} ma kanał alfa.`);
