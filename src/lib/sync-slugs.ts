import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log("Syncing slugs...");
  
  const products = await prisma.product.findMany();
  for (const product of products) {
    const slug = `${slugify(product.name)}-${product.id.slice(-4)}`;
    await prisma.product.update({
      where: { id: product.id },
      data: { slug }
    });
    console.log(`Updated product: ${product.name} -> ${slug}`);
  }

  const artisans = await prisma.artisanProfile.findMany({
    include: { user: true }
  });
  for (const artisan of artisans) {
    const nameToUse = artisan.studioName || artisan.user.name || "artisan";
    const slug = `${slugify(nameToUse)}-${artisan.userId.slice(-4)}`;
    await prisma.artisanProfile.update({
      where: { id: artisan.id },
      data: { slug }
    });
    console.log(`Updated artisan: ${nameToUse} -> ${slug}`);
  }

  console.log("Sync complete!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
