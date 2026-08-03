"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens";

export async function signUp(formData: any, role: "CLIENT" | "ARTISAN") {
  try {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      return { success: false, error: "Please fill in all fields" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
      },
    });

    const verificationToken = await generateVerificationToken(user.email!);
    await sendVerificationEmail(user.email!, verificationToken.token);

    return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  } catch (error: any) {
    console.error("SignUp error:", error);
    return { success: false, error: error.message || "Failed to create account" };
  }
}

export async function login(formData: any) {
  try {
    const { email, password } = formData;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true, result };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function resendVerificationEmailAction(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, error: "User not found" };
    if (user.emailVerified) return { success: false, error: "Email already verified" };

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return { success: true, message: "Verification email sent!" };
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendPasswordResetEmailAction(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, error: "No account found with this email" };

    const resetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, resetToken.token);
    return { success: true, message: "Password reset link sent!" };
  } catch (error: any) {
    console.error("Reset password email error:", error);
    return { success: false, error: "Failed to send password reset email" };
  }
}

export async function resetPasswordAction(token: string, password: any) {
  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { success: false, error: "Invalid reset token" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { success: false, error: "Token has expired" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return { success: false, error: "User does not exist" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return { success: true, message: "Password updated successfully" };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
