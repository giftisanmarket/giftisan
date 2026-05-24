import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    // 1. Authorization Guard (CRON_SECRET or Admin session)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isProd = process.env.NODE_ENV === "production";

    let isAuthorized = false;

    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      const session = await auth();
      if (session?.user?.role === "ADMIN") {
        isAuthorized = true;
      }
    }

    if (isProd && !isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
