import ComingSoon from "@/components/coming-soon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | Giftisan",
  description: "Something exceptional is coming to Giftisan. Stay tuned for our grand opening.",
};

export default function Page() {
  return <ComingSoon />;
}
