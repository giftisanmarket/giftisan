import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "support@giftisan.com";
  
  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: { artisanProfile: true },
  });

  if (!user) {
    console.error("User not found: " + email);
    return;
  }

  if (!user.artisanProfile) {
    console.error("Artisan profile not found for user: " + email);
    return;
  }

  const artisanId = user.artisanProfile.id;
  console.log(`Found Artisan ID: ${artisanId}`);

  const products = [
    {
      name: "Hand-Blown Turquoise Muski Vase",
      slug: "hand-blown-turquoise-muski-vase",
      description: "Traditional Egyptian Muski glass, known for its unique bubbles and vibrant turquoise hue. Each piece is hand-blown by masters in old Cairo, making no two vases exactly alike.",
      price: 1200,
      images: ["/muski-vase.png"],
      category: "Glasswork",
      tags: ["Handmade", "Traditional", "Home Decor"],
      status: "APPROVED",
      stock: 5,
    },
    {
      name: "Heritage Mother-of-Pearl Inlaid Box",
      slug: "heritage-mother-of-pearl-inlaid-box",
      description: "Meticulously inlaid with genuine mother of pearl on aged walnut wood. This hexagonal box features traditional Islamic geometric patterns, echoing the grandeur of Fatimid craftsmanship.",
      price: 2800,
      images: ["/inlaid-box.png"],
      category: "Woodwork",
      tags: ["Luxury", "Traditional", "Gift"],
      status: "APPROVED",
      stock: 3,
    },
    {
      name: "Hand-Woven 'Red Sea' Kilim Rug",
      slug: "hand-woven-red-sea-kilim-rug",
      description: "Woven by hand using 100% organic wool and natural desert plant dyes. The pattern is inspired by the rugged landscapes of the Red Sea mountains, featuring warm ochre, sandy beige, and deep terracotta tones.",
      price: 4500,
      images: ["/kilim-rug.png"],
      category: "Textiles",
      tags: ["Sustainable", "Handmade", "Home Decor"],
      status: "APPROVED",
      stock: 2,
    }
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        ...productData,
        artisanId,
      },
      create: {
        ...productData,
        artisanId,
      },
    });
    console.log(`Created/Updated Product: ${product.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
