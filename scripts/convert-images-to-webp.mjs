import fs from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("public");

// Files to keep as PNG for native/store/favicon requirements
const PRESERVE_ORIGINAL = new Set([
  path.join(PUBLIC_DIR, "icon.png"),
  path.join(PUBLIC_DIR, "marketing", "google-play-feature-graphic.png"),
  path.join(PUBLIC_DIR, "marketing", "google-play-icon-512.png"),
]);

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

async function convertAll() {
  const files = getFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} images to convert in public/...`);

  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const file of files) {
    const ext = path.extname(file);
    const targetWebp = file.slice(0, -ext.length) + ".webp";
    const statBefore = fs.statSync(file);
    totalBefore += statBefore.size;

    try {
      await sharp(file)
        .webp({ quality: 85, effort: 6 })
        .toFile(targetWebp);

      const statAfter = fs.statSync(targetWebp);
      totalAfter += statAfter.size;
      count++;

      const relOld = path.relative(PUBLIC_DIR, file).replace(/\\/g, "/");
      const relNew = path.relative(PUBLIC_DIR, targetWebp).replace(/\\/g, "/");
      const savedPct = Math.round((1 - statAfter.size / statBefore.size) * 100);

      console.log(`✓ ${relOld} (${(statBefore.size / 1024).toFixed(0)} KB) -> ${relNew} (${(statAfter.size / 1024).toFixed(0)} KB) [-${savedPct}%]`);

      // Delete original if not preserved for Play Store/Favicon
      if (!PRESERVE_ORIGINAL.has(file)) {
        fs.unlinkSync(file);
      }
    } catch (err) {
      console.error(`✗ Error converting ${file}:`, err);
    }
  }

  const savedTotalMB = ((totalBefore - totalAfter) / (1024 * 1024)).toFixed(2);
  const beforeMB = (totalBefore / (1024 * 1024)).toFixed(2);
  const afterMB = (totalAfter / (1024 * 1024)).toFixed(2);
  const overallPct = Math.round((1 - totalAfter / totalBefore) * 100);

  console.log(`\n========================================`);
  console.log(`Converted ${count} images to WebP!`);
  console.log(`Total size before: ${beforeMB} MB`);
  console.log(`Total size after:  ${afterMB} MB`);
  console.log(`Saved:             ${savedTotalMB} MB (-${overallPct}%)`);
  console.log(`========================================\n`);
}

convertAll();
