import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const bioLink = await prisma.artisanBioLink.findUnique({
      where: { id },
    });

    if (!bioLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await prisma.artisanBioLink.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/bio-links/[id]/click error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
