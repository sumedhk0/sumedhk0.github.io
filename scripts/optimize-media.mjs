// Convert an image to WebP for public/work/<slug>/ and print its size.
// Usage: node scripts/optimize-media.mjs <in> <outDir> [--width N]
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const [input, outDir, flag, w] = process.argv.slice(2);
if (!input || !outDir) {
  console.error("usage: optimize-media.mjs <in> <outDir> [--width N]");
  process.exit(1);
}
const width = flag === "--width" ? Number(w) : 1600;
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, path.basename(input).replace(/\.[^.]+$/, ".webp"));
const info = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
console.log(`${out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
