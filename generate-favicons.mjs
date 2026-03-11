import sharp from 'sharp';
import { writeFileSync } from 'fs';

const src = 'attached_assets/image_1771922396642.png';
const out = 'client/public';

async function generate() {
  const img = sharp(src);
  
  // PNG favicons
  await img.clone().resize(16, 16).png().toFile(`${out}/favicon-16x16.png`);
  await img.clone().resize(32, 32).png().toFile(`${out}/favicon-32x32.png`);
  await img.clone().resize(96, 96).png().toFile(`${out}/favicon-96x96.png`);
  await img.clone().resize(180, 180).png().toFile(`${out}/apple-touch-icon.png`);
  await img.clone().resize(192, 192).png().toFile(`${out}/web-app-manifest-192x192.png`);
  await img.clone().resize(512, 512).png().toFile(`${out}/web-app-manifest-512x512.png`);
  
  // favicon.png (32x32)
  await img.clone().resize(32, 32).png().toFile(`${out}/favicon.png`);
  
  // favicon.ico (multi-size ICO via 32x32 PNG)
  const ico32 = await img.clone().resize(32, 32).png().toBuffer();
  // Write as PNG renamed to .ico (browsers handle this fine)
  writeFileSync(`${out}/favicon.ico`, ico32);
  
  // favicon.svg - create an SVG wrapper
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="0" fill="#0a0a0a"/>
  <path d="M160 160 L280 256 L160 352" fill="none" stroke="#f97316" stroke-width="48" stroke-linecap="square" stroke-linejoin="miter"/>
  <rect x="300" y="328" width="72" height="40" rx="4" fill="#f97316"/>
</svg>`;
  writeFileSync(`${out}/favicon.svg`, svgContent);
  
  console.log('All favicons generated!');
}

generate().catch(console.error);
