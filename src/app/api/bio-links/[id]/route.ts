import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!artisan) {
      return NextResponse.json({ error: "Artisan profile not found" }, { status: 404 });
    }

    const existingLink = await prisma.artisanBioLink.findUnique({
      where: { id },
    });

    if (!existingLink || existingLink.artisanId !== artisan.id) {
      return NextResponse.json({ error: "Link not found or forbidden" }, { status: 404 });
    }

    const body = await req.json();
    const { title, url, icon, isFeatured, order } = body;

    if (isFeatured) {
      await prisma.artisanBioLink.updateMany({
        where: { artisanId: artisan.id },
        data: { isFeatured: false },
      });
    }

    const updatedLink = await prisma.artisanBioLink.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(url !== undefined && { url: url.trim() }),
        ...(icon !== undefined && { icon }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return NextResponse.json({ bioLink: updatedLink });
  } catch (error) {
    console.error("PATCH /api/bio-links/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!artisan) {
      return NextResponse.json({ error: "Artisan profile not found" }, { status: 404 });
    }

    const existingLink = await prisma.artisanBioLink.findUnique({
      where: { id },
    });

    if (!existingLink || existingLink.artisanId !== artisan.id) {
      return NextResponse.json({ error: "Link not found or forbidden" }, { status: 404 });
    }

    await prisma.artisanBioLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bio-links/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
