import { ForgotPasswordClient } from "@/components/forgot-password-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recover Your Access | Giftisan",
  description: "Reset your Giftisan password to continue discovering unique handcrafted treasures.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
