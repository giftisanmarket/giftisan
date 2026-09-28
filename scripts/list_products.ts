import { prisma } from "../src/lib/prisma";

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, category: true, price: true, status: true },
    orderBy: { createdAt: "desc" }
  });

  console.log("TOTAL PRODUCTS IN DB:", products.length);
  
  const catCount: Record<string, number> = {};
  products.forEach(p => {
    catCount[p.category] = (catCount[p.category] || 0) + 1;
  });
  console.log("\nCATEGORY COUNTS:", JSON.stringify(catCount, null, 2));

  console.log("\nALL PRODUCTS:");
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.id}] "${p.name}" | Status: ${p.status} | Category: "${p.category}"`);
  });
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
