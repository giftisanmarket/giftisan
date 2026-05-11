import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { SuccessClient } from "@/components/success-client";
import { prisma } from "@/lib/prisma";

interface SuccessPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  
  const dict = await getDictionary(lang as any);
  const search = await searchParams;
  const orderId = search.orderId as string | undefined;

  let order = null;
  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }

  // Serialize Prisma models to plain JSON-compatible objects
  const serializedOrder = order ? {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map(item => ({
      ...item,
      product: {
        ...item.product,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString()
      }
    }))
  } : null;

  return <SuccessClient dict={dict} lang={lang} order={serializedOrder} />;
}
