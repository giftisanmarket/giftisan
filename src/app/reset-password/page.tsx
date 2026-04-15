import { ResetPasswordClient } from "@/components/reset-password-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password | Giftisan",
  description: "Create a new secure password for your Giftisan account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
