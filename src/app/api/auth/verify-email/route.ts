import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return redirect("/login?error=MissingToken");
  }

  const existingToken = await prisma.verificationToken.findUnique({
    where: { token }
  });

  if (!existingToken) {
    return redirect("/login?error=InvalidToken");
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return redirect("/login?error=TokenExpired");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.identifier }
  });

  if (!existingUser) {
    return redirect("/login?error=UserNotFound");
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      // We also update the email if it was changed (not applicable here but good practice)
      email: existingToken.identifier, 
    }
  });

  await prisma.verificationToken.delete({
    where: { token }
  });

  return redirect("/?success=EmailVerified");
}
