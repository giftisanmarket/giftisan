import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { MOCK_PRODUCTS } from "../src/lib/data";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  for (const product of MOCK_PRODUCTS) {
    // 1. Create User/Artisan if they don't exist
    const email = `${product.artisan.name.toLowerCase().replace(/ /g, ".")}@giftisan.com`;
    
    const artisanUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: product.artisan.name,
        email,
        role: "ARTISAN",
        image: product.artisan.avatar,
      },
    });

    // 2. Create Artisan Profile
    const artisanProfile = await prisma.artisanProfile.upsert({
      where: { userId: artisanUser.id },
      update: {},
      create: {
        userId: artisanUser.id,
        bio: product.artisan.bio,
        location: product.artisan.location,
        avatar: product.artisan.avatar,
        studioName: `${product.artisan.name}'s Studio`,
      },
    });

    // 3. Create Product
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category,
        tags: product.tags,
        canPersonalize: product.canPersonalize || false,
        artisanId: artisanProfile.id,
      },
    });
  }

  console.log("Seeding complete!");
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
