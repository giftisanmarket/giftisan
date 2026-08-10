import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!artisan) {
      return NextResponse.json({ error: "Artisan profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { instagram, facebook, tiktok, pinterest } = body;

    const updated = await prisma.artisanProfile.update({
      where: { id: artisan.id },
      data: {
        instagram: instagram !== undefined ? instagram.trim() : artisan.instagram,
        facebook: facebook !== undefined ? facebook.trim() : artisan.facebook,
        tiktok: tiktok !== undefined ? tiktok.trim() : artisan.tiktok,
        pinterest: pinterest !== undefined ? pinterest.trim() : artisan.pinterest,
      },
    });

    return NextResponse.json({ success: true, artisan: updated });
  } catch (error) {
    console.error("PATCH /api/artisan/socials error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export { PATCH as POST };

