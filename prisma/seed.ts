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
    const artisan = product.artisan;
    if (!artisan || !artisan.name) continue;
    const artisanName: string = artisan.name;
    // 1. Create User/Artisan if they don't exist
    const email = `${artisanName.toLowerCase().replace(/ /g, ".")}@giftisan.com`;
    
    const artisanUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: artisanName,
        email,
        role: "ARTISAN",
        image: artisan.avatar,
      },
    });

    // 2. Create Artisan Profile
    const artisanProfile = await prisma.artisanProfile.upsert({
      where: { userId: artisanUser.id },
      update: {},
      create: {
        userId: artisanUser.id,
        bio: artisan.bio || "",
        location: artisan.location || "",
        avatar: artisan.avatar || "",
        studioName: `${artisanName}'s Studio`,
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

  // 4. Seed default Coupons
  const defaultCoupons = [
    {
      code: "GIFT10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 100,
      maxDiscount: 500,
    },
    {
      code: "WELCOME100",
      discountType: "FIXED",
      discountValue: 100,
      minOrderAmount: 200,
    }
  ];

  for (const coupon of defaultCoupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
        isActive: true
      }
    });
  }

  // 5. Seed default Shipping Zones for Egypt
  const countShipping = await prisma.shippingMethod.count();
  if (countShipping === 0) {
    await prisma.shippingMethod.createMany({
      data: [
        { name: "Cairo & Giza", price: 84, estimatedDays: "1–2 Business Days", isActive: true },
        { name: "Delta & Canal Cities", price: 96, estimatedDays: "2–3 Business Days", isActive: true },
        { name: "Upper Egypt", price: 108, estimatedDays: "3–5 Business Days", isActive: true }
      ]
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
