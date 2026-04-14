import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Setup Prisma with Neon adapter
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function uploadToCloudinary(base64: string, folder: string): Promise<string | null> {
  try {
    const res = await cloudinary.uploader.upload(base64, {
      folder: `giftisan_${folder}`,
    });
    console.log(`  Uploaded to: ${res.secure_url}`);
    return res.secure_url;
  } catch (error) {
    console.error("  Upload failed:", error);
    return null;
  }
}

async function main() {
  console.log("🚀 Starting database cleanup and migration to Cloudinary...");

  // 1. Clean Products
  console.log("\n📦 Checking Products...");
  const products = await prisma.product.findMany();
  let productCount = 0;
  for (const product of products) {
    let imagesChanged = false;
    const updatedImages = await Promise.all(
      product.images.map(async (img, index) => {
        if (img.startsWith("data:image")) {
          console.log(`  Converting image ${index + 1} for product: ${product.name}`);
          const url = await uploadToCloudinary(img, "products");
          if (url) {
            imagesChanged = true;
            return url;
          }
        }
        return img;
      })
    );
    
    if (imagesChanged) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: updatedImages }
      });
      productCount++;
    }
  }
  console.log(`  Updated ${productCount} products.`);

  // 2. Clean Artisan Profiles (Avatar & Banner)
  console.log("\n🎨 Checking Artisan Profiles...");
  const artisans = await prisma.artisanProfile.findMany();
  let artisanCount = 0;
  for (const artisan of artisans) {
    let update: any = {};
    if (artisan.avatar?.startsWith("data:image")) {
      console.log(`  Converting avatar for artisan: ${artisan.studioName || artisan.userId}`);
      const url = await uploadToCloudinary(artisan.avatar, "avatars");
      if (url) update.avatar = url;
    }
    if (artisan.bannerImage?.startsWith("data:image")) {
      console.log(`  Converting banner for artisan: ${artisan.studioName || artisan.userId}`);
      const url = await uploadToCloudinary(artisan.bannerImage, "banners");
      if (url) update.bannerImage = url;
    }
    
    if (Object.keys(update).length > 0) {
      await prisma.artisanProfile.update({ 
        where: { id: artisan.id }, 
        data: update 
      });
      artisanCount++;
    }
  }
  console.log(`  Updated ${artisanCount} artisan profiles.`);

  // 3. Clean Messages
  console.log("\n💬 Checking Messages...");
  const messages = await prisma.message.findMany({
    where: { attachment: { startsWith: "data:image" } }
  });
  let messageCount = 0;
  for (const msg of messages) {
    if (msg.attachment) {
      console.log(`  Converting attachment for message: ${msg.id}`);
      const url = await uploadToCloudinary(msg.attachment, "messages");
      if (url) {
        await prisma.message.update({ 
          where: { id: msg.id }, 
          data: { attachment: url } 
        });
        messageCount++;
      }
    }
  }
  console.log(`  Updated ${messageCount} messages.`);

  // 4. Clean User Images
  console.log("\n👤 Checking User Images...");
  const users = await prisma.user.findMany({
    where: { image: { startsWith: "data:image" } }
  });
  let userCount = 0;
  for (const user of users) {
    if (user.image) {
      console.log(`  Converting image for user: ${user.email || user.id}`);
      const url = await uploadToCloudinary(user.image, "users");
      if (url) {
        await prisma.user.update({
          where: { id: user.id },
          data: { image: url }
        });
        userCount++;
      }
    }
  }
  console.log(`  Updated ${userCount} users.`);

  console.log("\n✨ SUCCESS: Your database is now clean and all images are on Cloudinary.");
}

main()
  .catch((e) => {
    console.error("❌ ERROR during migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
