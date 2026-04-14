import { CheckoutClient } from "@/components/checkout-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Complete Your Handcrafted Purchase",
  description: "Securely finalize your order and bring home your artisanal treasures from global creators.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
