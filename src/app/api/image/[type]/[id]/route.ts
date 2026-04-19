import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  // Optimization parameters
  const width = parseInt(searchParams.get("w") || "1080");
  const quality = parseInt(searchParams.get("q") || "80");
  const format = searchParams.get("f") || "webp"; // Default to webp for performance

  try {
    let imageData: string | null = null;

    if (type === "product") {
      const product = await prisma.product.findUnique({
        where: { id },
        select: { images: true }
      });
      imageData = product?.images[0] || null;
    } else if (type === "artisan") {
      const artisan = await prisma.artisanProfile.findUnique({
        where: { id },
        select: { bannerImage: true, avatar: true }
      });
      imageData = artisan?.bannerImage || artisan?.avatar || null;
    } else if (type === "review") {
      const review = await prisma.review.findUnique({
        where: { id },
        select: { images: true }
      });
      imageData = review?.images[0] || null;
    }

    if (!imageData) {
      return new NextResponse("Image not found", { status: 404 });
    }

    let buffer: Buffer;
    let contentType: string;

    if (imageData.startsWith("http")) {
      // Fetch remote image
      const response = await fetch(imageData);
      buffer = Buffer.from(await response.arrayBuffer());
      contentType = response.headers.get("Content-Type") || "image/jpeg";
    } else if (imageData.startsWith("data:image")) {
      // Decode base64
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return new NextResponse("Invalid image format", { status: 400 });
      }
      contentType = matches[1];
      buffer = Buffer.from(matches[2], "base64");
    } else {
      return new NextResponse("Unknown image source", { status: 400 });
    }

    // Processing with Sharp
    let transformed = sharp(buffer);

    // Metadata for original size
    const metadata = await transformed.metadata();
    
    // Only resize if requested width is smaller than original
    if (metadata.width && metadata.width > width) {
      transformed = transformed.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Apply format and quality
    if (format === "webp") {
      transformed = transformed.webp({ quality, effort: 4 });
      contentType = "image/webp";
    } else if (format === "avif") {
      transformed = transformed.avif({ quality, effort: 4 });
      contentType = "image/avif";
    } else {
      transformed = transformed.jpeg({ quality, mozjpeg: true, progressive: true });
      contentType = "image/jpeg";
    }

    const outputBuffer = await transformed.toBuffer();

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Image-Optimizer": "Sharp",
      },
    });
  } catch (error) {
    console.error("Image optimization error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
