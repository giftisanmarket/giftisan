import { auth } from "@/auth";
import { getProductForEdit, getArtisanData } from "@/lib/actions";
import { NewProductClient } from "@/components/new-product-client";
import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as any);
  const product = await getProductForEdit(id);

  const editLabel =
    typeof dict.studio?.edit_product === "string"
      ? dict.studio.edit_product
      : "Edit";

  return {
    title: product ? `${editLabel}: ${product.name}` : `${editLabel} Product`,
    description: "Update your handcrafted product listing.",
    robots: { index: false, follow: false },
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;

  if (!hasLocale(lang)) notFound();

  const session = await auth();

  if (!session?.user) {
    redirect(`/${lang}/login?callbackUrl=/${lang}/studio/products/${id}/edit`);
  }

  if (session.user.role !== "ARTISAN" && session.user.role !== "ADMIN") {
    redirect(`/${lang}/profile`);
  }

  // Fetch the product with auth guard inside getProductForEdit
  const product = await getProductForEdit(id);

  if (!product) {
    notFound();
  }

  // Get the artisan profile for the artisanId prop
  const artisan = await getArtisanData(session.user.id as string);

  if (!artisan && session.user.role !== "ADMIN") {
    redirect(`/${lang}/profile`);
  }

  const dict = await getDictionary(lang as any);

  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images,
    canPersonalize: product.canPersonalize,
    personalizationPrompt: product.personalizationPrompt,
    requiresClientImage: product.requiresClientImage,
    clientImagePrompt: product.clientImagePrompt,
    stock: product.stock,
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      stock: v.stock,
      sku: v.sku,
      image: v.image,
      options: v.options,
    })),
  };

  return (
    <NewProductClient
      artisanId={artisan?.id ?? product.artisanId}
      dict={dict}
      lang={lang}
      initialData={initialData}
    />
  );
}
