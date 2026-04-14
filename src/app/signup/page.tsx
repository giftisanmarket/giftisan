import { SignupClient } from "@/components/signup-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Circle | Signup for Giftisan",
  description: "Become a Giftisan curator or open your own master studio today. Join a global community of creators and treasure hunters.",
};

export default function SignupPage() {
  return <SignupClient />;
}
