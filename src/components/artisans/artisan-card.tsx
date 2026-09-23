"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Heart, CheckCircle2, MapPin, Package, ArrowUpRight } from "lucide-react";
import { BespokeImage } from "@/components/bespoke-image";
import { useFavorites } from "@/context/favorites-context";
import { cn } from "@/lib/utils";

const FALLBACK_CRAFT_IMAGES = [
  "/hero.webp",
  "/inlaid-box.png",
  "/kilim-rug.png",
  "/muski-vase.png",
  "/earrings.webp",
  "/journal.webp",
];

interface ArtisanCardProps {
  artisan: {
    id: string;
    slug?: string | null;
    studioName?: string | null;
    location?: string | null;
    avatar?: string | null;
    bannerImage?: string | null;
    brandColor?: string | null;
    isVerified?: boolean;
    user: {
      name: string;
    };
    products?: Array<{
      id: string;
      slug?: string | null;
      images: string[];
      name?: string;
      reviews?: Array<{ rating: number }>;
    }>;
  };
  dict?: any;
}

interface PreviewTile {
  key: string;
  type: "product" | "studio" | "studio-action";
  imageUrl?: string;
  name?: string;
  url: string;
  productId?: string;
}

export function ArtisanCard({ artisan, dict }: ArtisanCardProps) {
  const router = useRouter();
  const { isFavoriteArtisan, toggleFavoriteArtisan } = useFavorites();
  const isFollowed = isFavoriteArtisan(artisan.id);

  const toggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteArtisan(artisan);
  };

  const artisanSlug = artisan.slug || artisan.user.name.toLowerCase().replace(/\s+/g, "-");
  const artisanUrl = `/artisans/${encodeURI(artisanSlug)}`;
  const productCount = artisan.products?.length || 0;
  const isArabic = dict?.common?.home === "الرئيسية";
  const viewStudioText = isArabic ? "زيارة المتجر" : "Visit Studio";

  // 1. FIRST PRIORITY: Exactly 1 primary image from each DIFFERENT product
  const previewTiles: PreviewTile[] = [];
  const usedProductIds = new Set<string>();

  if (artisan.products && Array.isArray(artisan.products)) {
    for (const p of artisan.products) {
      if (!p || !p.id || usedProductIds.has(p.id)) continue;
      if (Array.isArray(p.images) && p.images.length > 0) {
        const validImg = p.images.find(
          (img: any) => typeof img === "string" && img.trim().length > 0
        );
        if (validImg) {
          usedProductIds.add(p.id);
          const slugOrId = (p.slug || p.id).trim();
          previewTiles.push({
            key: `prod-${p.id}`,
            type: "product",
            imageUrl: validImg,
            name: p.name || "",
            url: `/products/${encodeURI(slugOrId)}`,
            productId: p.id,
          });
          if (previewTiles.length >= 4) break;
        }
      }
    }
  }

  // 2. Only if the artisan has ONLY 1 product in total, allow alternate angles of that single product
  if (previewTiles.length === 1 && artisan.products?.length === 1) {
    const singleProduct = artisan.products[0];
    if (Array.isArray(singleProduct.images)) {
      const slugOrId = (singleProduct.slug || singleProduct.id).trim();
      for (const img of singleProduct.images) {
        if (
          img &&
          typeof img === "string" &&
          img.trim().length > 0 &&
          !previewTiles.some((t) => t.imageUrl === img)
        ) {
          previewTiles.push({
            key: `prod-${singleProduct.id}-${previewTiles.length}`,
            type: "product",
            imageUrl: img,
            name: singleProduct.name || "",
            url: `/products/${encodeURI(slugOrId)}`,
            productId: singleProduct.id,
          });
          if (previewTiles.length >= 3) break;
        }
      }
    }
  }

  // 3. If slots < 4 and banner image exists (and not already in preview), add it
  if (
    previewTiles.length < 4 &&
    artisan.bannerImage &&
    !previewTiles.some((t) => t.imageUrl === artisan.bannerImage)
  ) {
    previewTiles.push({
      key: `banner-${artisan.id}`,
      type: "studio",
      imageUrl: artisan.bannerImage,
      name: artisan.studioName || artisan.user.name,
      url: artisanUrl,
    });
  }

  // 4. Fill remaining slots up to 3 with fallback craft images
  while (previewTiles.length < 3) {
    const fallback = FALLBACK_CRAFT_IMAGES[previewTiles.length % FALLBACK_CRAFT_IMAGES.length];
    previewTiles.push({
      key: `fallback-${previewTiles.length}`,
      type: "studio",
      imageUrl: fallback,
      name: artisan.studioName || artisan.user.name,
      url: artisanUrl,
    });
  }

  // 5. If we have 3 tiles, the 4th slot is an elegant "Visit Studio" interactive tile
  if (previewTiles.length === 3) {
    previewTiles.push({
      key: `studio-action-${artisan.id}`,
      type: "studio-action",
      name: artisan.studioName || artisan.user.name,
      url: artisanUrl,
    });
  }

  // Final 4 tiles
  const finalTiles = previewTiles.slice(0, 4);

  // Review calculations
  let totalReviews = 0;
  if (artisan.products && Array.isArray(artisan.products)) {
    for (const p of artisan.products) {
      if (Array.isArray(p.reviews)) {
        totalReviews += p.reviews.length;
      }
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }
    router.push(artisanUrl);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl md:rounded-3xl border border-primary/10 hover:border-accent/40 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-3 sm:p-3.5 flex flex-col h-full relative group cursor-pointer"
    >
      {/* 2x2 Image Preview Grid: 1 image per distinct product */}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl md:rounded-2xl overflow-hidden aspect-square bg-cream/40 mb-3 relative p-1 border border-primary/5">
        {finalTiles.map((tile) => {
          if (tile.type === "studio-action") {
            return (
              <Link
                key={tile.key}
                href={tile.url}
                title={tile.name}
                className="relative w-full h-full aspect-square rounded-lg overflow-hidden bg-cream/60 hover:bg-cream border border-primary/10 hover:border-accent/40 flex flex-col items-center justify-center p-2 text-center transition-all duration-300 group/studio-tile"
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-primary/10 flex items-center justify-center text-primary group-hover/studio-tile:bg-accent group-hover/studio-tile:text-white group-hover/studio-tile:border-accent transition-all duration-300 mb-1">
                  <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg] transition-transform group-hover/studio-tile:translate-x-0.5 group-hover/studio-tile:-translate-y-0.5" />
                </div>
                <span className="text-[11px] font-heading font-bold text-primary group-hover/studio-tile:text-accent transition-colors line-clamp-1 max-w-full">
                  {tile.name}
                </span>
                <span className="text-[10px] text-charcoal/50 font-medium">
                  {viewStudioText}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tile.key}
              href={tile.url}
              title={tile.name}
              className="relative w-full h-full aspect-square rounded-lg overflow-hidden bg-cream/30 group/tile block"
            >
              <BespokeImage
                src={tile.imageUrl || "/hero.webp"}
                alt={tile.name || ""}
                fill
                className="object-cover group-hover/tile:scale-110 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 12vw"
              />
              {/* Product title hint on hover */}
              {tile.name && tile.type === "product" && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-1.5 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <p className="text-[10px] text-white font-medium truncate leading-tight">
                    {tile.name}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Studio Info Section */}
      <div className="flex items-center justify-between gap-2.5 pt-1 mt-auto">
        <Link
          href={artisanUrl}
          className="flex items-center gap-2.5 min-w-0 flex-1 group/studio"
        >
          {/* Studio Avatar */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-cream ring-1 ring-primary/10 shadow-xs bg-cream/40 flex items-center justify-center group-hover/studio:ring-accent/40 transition-all">
            {artisan.avatar ? (
              <BespokeImage
                type="artisan"
                id={artisan.id}
                src={artisan.avatar}
                alt={artisan.studioName || artisan.user.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <span className="font-heading font-black text-sm text-primary">
                {(artisan.studioName || artisan.user.name || "A").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Studio Details */}
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-bold text-base text-primary truncate leading-tight group-hover/studio:text-accent transition-colors flex items-center gap-1.5">
              <span className="truncate">{artisan.studioName || artisan.user.name}</span>
              {artisan.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              {/* Rating Stars & Count */}
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-charcoal/60 font-medium">({totalReviews})</span>
              </div>

              {/* Location or Products count */}
              {artisan.location ? (
                <span className="text-[11px] text-charcoal/50 flex items-center gap-0.5 truncate">
                  <span>•</span>
                  <MapPin className="w-2.5 h-2.5 text-accent shrink-0" />
                  <span className="truncate">{artisan.location}</span>
                </span>
              ) : productCount > 0 ? (
                <span className="text-[11px] text-charcoal/50 flex items-center gap-0.5 truncate">
                  <span>•</span>
                  <Package className="w-2.5 h-2.5 text-primary/40 shrink-0" />
                  <span>{productCount}</span>
                </span>
              ) : null}
            </div>
          </div>
        </Link>

        {/* Heart / Favorite Button */}
        <button
          type="button"
          onClick={toggleFollow}
          aria-label="Favorite studio"
          className={cn(
            "p-2 rounded-full border transition-all shrink-0 active:scale-75",
            isFollowed
              ? "bg-red-50 border-red-200 text-red-500 shadow-xs"
              : "bg-cream/40 border-primary/5 text-charcoal/40 hover:text-red-500 hover:bg-white hover:border-primary/10"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-transform",
              isFollowed ? "fill-current" : "fill-none"
            )}
          />
        </button>
      </div>
    </div>
  );
}
