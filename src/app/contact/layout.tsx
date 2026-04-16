import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect with Us",
  description: "Have a question or a story to share? Reach out to the Giftisan team. We're here to bridge the gap between creators and collectors.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
