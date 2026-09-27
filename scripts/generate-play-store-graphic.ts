import sharp from "sharp";
import fs from "fs";
import path from "path";

const SVG_LOGO_PATH = path.resolve("public/logo-transparent.svg");
const OUTPUT_PATH = path.resolve("public/marketing/google-play-feature-graphic.png");

async function main() {
  console.log("Generating ultra-clean, minimalist Google Play Feature Graphic (1024x500)...");

  // Pure vector emblem sized gracefully (~124px) for subtle luxury
  const emblemSize = 124;
  const emblemBuffer = await sharp(SVG_LOGO_PATH)
    .resize(emblemSize, emblemSize, { fit: "contain" })
    .png()
    .toBuffer();

  // 100% minimalist, high-fashion luxury aesthetic:
  // - Velvety dark forest green with soft natural lighting
  // - Generous negative space
  // - No cheesy borders, pills, grids, or cluttered bullet points
  const svgTemplate = `
    <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="luxuriousGlow" cx="50%" cy="46%" r="65%">
          <stop offset="0%" stop-color="#095B44" />
          <stop offset="55%" stop-color="#064E3B" />
          <stop offset="100%" stop-color="#033326" />
        </radialGradient>
      </defs>

      <!-- Soft, velvety backdrop -->
      <rect width="1024" height="500" fill="url(#luxuriousGlow)" />

      <!-- Minimalist Brand Typography -->
      <!-- 'Giftisan' in clean, sophisticated lettering -->
      <text 
        x="512" 
        y="300" 
        text-anchor="middle" 
        fill="#FDFCF0" 
        font-family="'Georgia', 'Times New Roman', serif" 
        font-size="44" 
        font-weight="normal" 
        letter-spacing="7"
      >GIFTISAN</text>

      <!-- Subtle elegant descriptor with generous tracking -->
      <text 
        x="512" 
        y="342" 
        text-anchor="middle" 
        fill="#FDFCF0" 
        fill-opacity="0.65" 
        font-family="'Segoe UI', -apple-system, sans-serif" 
        font-size="13" 
        font-weight="400" 
        letter-spacing="5"
      >HANDCRAFTED TREASURES</text>
    </svg>
  `;

  // Emblem centered vertically above the text:
  // Center X = (1024 - 124) / 2 = 450
  // Emblem Top = 125, Bottom = 249 -> Leaves 51px breathing room before title at Y=300
  const finalImage = await sharp(Buffer.from(svgTemplate))
    .composite([
      {
        input: emblemBuffer,
        left: Math.round((1024 - emblemSize) / 2),
        top: 130,
      },
    ])
    .removeAlpha()
    .png()
    .toBuffer();

  await sharp(finalImage).toFile(OUTPUT_PATH);
  console.log("Successfully generated clean Feature Graphic at:", OUTPUT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
