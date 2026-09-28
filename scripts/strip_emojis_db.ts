import { prisma } from "../src/lib/prisma";

function stripEmojis(str: string): string {
  if (!str) return str;
  return str
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")  // flag sequences
    .replace(/[\u200D\uFE0F]/gu, "")           // zero-width joiners & variation selectors
    .replace(/\s{2,}/g, " ")                   // collapse double spaces left behind
    .trim();
}

async function main() {
  console.log("🧹 Stripping emojis from all DB content...\n");

  // ── 1. Products ────────────────────────────────────────────────────────────
  const products = await prisma.product.findMany({
    select: { id: true, name: true, description: true }
  });

  let productUpdates = 0;
  for (const p of products) {
    const cleanName = stripEmojis(p.name);
    const cleanDesc = stripEmojis(p.description);

    if (cleanName !== p.name || cleanDesc !== p.description) {
      await prisma.product.update({
        where: { id: p.id },
        data: { name: cleanName, description: cleanDesc }
      });
      console.log(`✅ Product: "${p.name}" → "${cleanName}"`);
      productUpdates++;
    }
  }
  console.log(`\n📦 ${productUpdates} products updated.\n`);

  // ── 2. Artisan Profiles ────────────────────────────────────────────────────
  const artisans = await prisma.artisanProfile.findMany({
    select: { id: true, studioName: true, bio: true }
  });

  let artisanUpdates = 0;
  for (const a of artisans) {
    const cleanStudio = a.studioName ? stripEmojis(a.studioName) : a.studioName;
    const cleanBio = a.bio ? stripEmojis(a.bio) : a.bio;

    if (cleanStudio !== a.studioName || cleanBio !== a.bio) {
      await prisma.artisanProfile.update({
        where: { id: a.id },
        data: { studioName: cleanStudio, bio: cleanBio }
      });
      console.log(`✅ Artisan: "${a.studioName}" → "${cleanStudio}"`);
      artisanUpdates++;
    }
  }
  console.log(`🎨 ${artisanUpdates} artisan profiles updated.\n`);

  console.log("✅ All done!");
}

main()
  .catch(err => {
    console.error("❌ Failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
