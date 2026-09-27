import sharp from "sharp";
import fs from "fs";
import path from "path";

// Exact Giftisan Primary Forest Green (#064E3B)
const BRAND_COLOR = { r: 6, g: 78, b: 59 }; // #064E3B
const BRAND_HEX = "#064E3B";
const SVG_LOGO_PATH = path.resolve("public/logo-transparent.svg");
const RASTER_ICON_PATH = path.resolve("public/icon.png");

async function main() {
  if (!fs.existsSync(SVG_LOGO_PATH)) {
    console.error("Vector logo not found at", SVG_LOGO_PATH);
    process.exit(1);
  }

  console.log("Generating seamless native assets using pure vector:", SVG_LOGO_PATH);

  // Helper to generate a sharp instance of the vector emblem at any desired width/height
  function getResizedVectorEmblem(size: number) {
    return sharp(SVG_LOGO_PATH)
      .resize(size, size, { fit: "contain" })
      .png()
      .toBuffer();
  }

  // 1. Generate pristine, flawless 1024x1024 App Icon on unified #064E3B background
  const iconEmblemBuffer = await getResizedVectorEmblem(1024);
  const masterAppIconBuffer = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 3,
      background: BRAND_COLOR,
    },
  })
    .composite([{ input: iconEmblemBuffer, gravity: "center" }])
    .png()
    .toBuffer();

  // Save back to public/icon.png as a pristine PNG
  await sharp(masterAppIconBuffer).toFile(RASTER_ICON_PATH);
  console.log("Updated public/icon.png with pure, artifact-free #064E3B branding.");

  // Helper to create a centered splash screen on 100% unified brand green (NO square borders)
  async function createSplash(width: number, height: number): Promise<Buffer> {
    // Emblem size: ~32% to 36% of the smallest screen dimension for optimal mobile elegance
    const emblemDimension = Math.round(Math.min(width, height) * 0.35);
    const emblemBuffer = await getResizedVectorEmblem(emblemDimension);

    return sharp({
      create: {
        width,
        height,
        channels: 3,
        background: BRAND_COLOR,
      },
    })
      .composite([{ input: emblemBuffer, gravity: "center" }])
      .png()
      .toBuffer();
  }

  // --- iOS ASSETS ---
  const iosIconDir = path.resolve("ios/App/App/Assets.xcassets/AppIcon.appiconset");
  const iosSplashDir = path.resolve("ios/App/App/Assets.xcassets/Splash.imageset");

  if (fs.existsSync(iosIconDir)) {
    console.log("Updating iOS 1024x1024 AppIcon (no alpha, unified background)...");
    await sharp(masterAppIconBuffer).toFile(path.join(iosIconDir, "AppIcon-512@2x.png"));
  }

  if (fs.existsSync(iosSplashDir)) {
    console.log("Updating iOS 2732x2732 Splash screens...");
    const iosSplash = await createSplash(2732, 2732);
    await sharp(iosSplash).toFile(path.join(iosSplashDir, "splash-2732x2732.png"));
    await sharp(iosSplash).toFile(path.join(iosSplashDir, "splash-2732x2732-1.png"));
    await sharp(iosSplash).toFile(path.join(iosSplashDir, "splash-2732x2732-2.png"));
  }

  // --- ANDROID ASSETS ---
  const androidResDir = path.resolve("android/app/src/main/res");

  const mipmaps = [
    { dir: "mipmap-mdpi", icon: 48, foreground: 108 },
    { dir: "mipmap-hdpi", icon: 72, foreground: 162 },
    { dir: "mipmap-xhdpi", icon: 96, foreground: 216 },
    { dir: "mipmap-xxhdpi", icon: 144, foreground: 324 },
    { dir: "mipmap-xxxhdpi", icon: 192, foreground: 432 },
  ];

  for (const m of mipmaps) {
    const targetDir = path.join(androidResDir, m.dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    console.log(`Generating unified Android icons for ${m.dir}...`);
    // Full legacy icon
    await sharp(masterAppIconBuffer)
      .resize(m.icon, m.icon)
      .png()
      .toFile(path.join(targetDir, "ic_launcher.png"));

    // Round legacy icon
    const roundSvg = Buffer.from(
      `<svg width="${m.icon}" height="${m.icon}"><circle cx="${m.icon / 2}" cy="${m.icon / 2}" r="${m.icon / 2}" fill="black"/></svg>`
    );
    await sharp(masterAppIconBuffer)
      .resize(m.icon, m.icon)
      .composite([{ input: roundSvg, blend: "dest-in" }])
      .png()
      .toFile(path.join(targetDir, "ic_launcher_round.png"));

    // Adaptive icon foreground (transparent vector emblem centered inside safe zone)
    const fgEmblem = await getResizedVectorEmblem(m.foreground);
    await sharp(fgEmblem).toFile(path.join(targetDir, "ic_launcher_foreground.png"));
  }

  // Android Splash screens
  const splashScreens = [
    { dir: "drawable", w: 1024, h: 1024 },
    { dir: "drawable-land-mdpi", w: 480, h: 320 },
    { dir: "drawable-land-hdpi", w: 800, h: 480 },
    { dir: "drawable-land-xhdpi", w: 1280, h: 720 },
    { dir: "drawable-land-xxhdpi", w: 1600, h: 960 },
    { dir: "drawable-land-xxxhdpi", w: 1920, h: 1280 },
    { dir: "drawable-port-mdpi", w: 320, h: 480 },
    { dir: "drawable-port-hdpi", w: 480, h: 800 },
    { dir: "drawable-port-xhdpi", w: 720, h: 1280 },
    { dir: "drawable-port-xxhdpi", w: 960, h: 1600 },
    { dir: "drawable-port-xxxhdpi", w: 1280, h: 1920 },
  ];

  for (const s of splashScreens) {
    const targetDir = path.join(androidResDir, s.dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    console.log(`Generating seamless Android splash for ${s.dir} (${s.w}x${s.h})...`);
    const splash = await createSplash(s.w, s.h);
    await sharp(splash).toFile(path.join(targetDir, "splash.png"));
  }

  // Update ic_launcher_background.xml
  const bgXmlPath = path.join(androidResDir, "values/ic_launcher_background.xml");
  if (fs.existsSync(bgXmlPath)) {
    const bgXmlContent = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BRAND_HEX}</color>\n</resources>\n`;
    fs.writeFileSync(bgXmlPath, bgXmlContent, "utf8");
    console.log("Updated ic_launcher_background.xml to", BRAND_HEX);
  }

  console.log("All native assets regenerated with 100% unified colors and zero square boundaries!");
}

main().catch((err) => {
  console.error("Asset regeneration failed:", err);
  process.exit(1);
});
