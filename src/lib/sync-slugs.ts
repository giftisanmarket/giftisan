import { prisma } from "./prisma";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function generateUniqueProductSlug(name: string, productId: string): Promise<string> {
  const baseSlug = slugify(name);
  if (!baseSlug) return `product-${productId.slice(-4)}`;

  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug: { equals: candidateSlug, mode: "insensitive" },
        id: { not: productId }
      },
      select: { id: true }
    });

    if (!existing) return candidateSlug;

    counter++;
    candidateSlug = `${baseSlug}-${counter}`;
  }
}

async function main() {
  console.log("Syncing slugs...");
  
  const products = await prisma.product.findMany();
  for (const product of products) {
    const slug = await generateUniqueProductSlug(product.name, product.id);
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
    const baseSlug = slugify(nameToUse);
    let slug = baseSlug;
    
    // Check collision for artisan
    const existing = await prisma.artisanProfile.findFirst({
      where: {
        slug: { equals: baseSlug, mode: "insensitive" },
        id: { not: artisan.id }
      }
    });

    if (existing) {
      slug = `${baseSlug}-${artisan.userId.slice(-4)}`;
    }

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
