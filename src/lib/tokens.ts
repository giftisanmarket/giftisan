import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export const generateVerificationToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000 * 24); // 24 hours

  const existingToken = await prisma.verificationToken.findFirst({
    where: { identifier: email }
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { token: existingToken.token }
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    }
  });

  return verificationToken;
};
export const generatePasswordResetToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email }
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return passwordResetToken;
};
