import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  try {
    let imageData: string | null = null;
    let images: string[] = [];

    if (type === "product") {
      const product = await prisma.product.findUnique({
        where: { id },
        select: { images: true }
      });
      images = product?.images || [];
      imageData = images[0] || null;
    } else if (type === "artisan") {
      const artisan = await prisma.artisanProfile.findUnique({
        where: { id },
        select: { bannerImage: true, avatar: true }
      });
      // Prefer banner, fallback to avatar
      imageData = artisan?.bannerImage || artisan?.avatar || null;
    }

    if (!imageData) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // If it's a URL already, redirect to it
    if (imageData.startsWith("http")) {
      return NextResponse.redirect(imageData);
    }

    // If it's base64, decode and serve
    if (imageData.startsWith("data:image")) {
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const type = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": type,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    return new NextResponse("Invalid image format", { status: 400 });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
