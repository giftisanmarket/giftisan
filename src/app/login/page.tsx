import { LoginClient } from "@/components/login-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Join the Giftisan Circle",
  description: "Access your artisan studio or customer profile to discover and manage handcrafted treasures.",
};

export default function LoginPage() {
  return <LoginClient />;
}
