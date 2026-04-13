import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    for (const product of products) {
      const slug = `${slugify(product.name)}-${product.id.slice(-4)}`;
      await prisma.product.update({
        where: { id: product.id },
        data: { slug }
      });
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
    }

    return NextResponse.json({ success: true, message: "Slugs synced successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
