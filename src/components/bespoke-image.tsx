"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface BespokeImageProps extends ImageProps {
  containerClassName?: string;
  type?: "product" | "artisan" | "review";
  id?: string;
}

export function BespokeImage({ 
  src, 
  alt, 
  className, 
  containerClassName,
  type,
  id,
  ...props 
}: BespokeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const isFill = !!props.fill;
  const isOptimized = !!(type && id);

  // Simple hash or version key based on the image URL/content to bust browser cache
  const getVersion = (s: any) => {
    if (typeof s !== "string") return "1";
    if (s.startsWith("data:")) {
      let hash = 0;
      for (let i = 0; i < Math.min(s.length, 100); i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return `${s.length}-${Math.abs(hash)}`;
    }
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString();
  };

  const version = getVersion(src);

  return (
    <div className={cn(
      "relative overflow-hidden", 
      isFill && "h-full w-full",
      containerClassName
    )}>
      {isLoading && <Skeleton className="absolute inset-0 z-10" />}
      <Image
        loader={isOptimized ? ({ src: loaderSrc, width, quality }) => {
          return `/api/image/${type}/${id}?w=${width}&q=${quality || 85}&v=${version}`
        } : undefined}
        src={isOptimized ? `giftisan-${type}-${id}-${version}` : src}
        alt={alt}
        className={cn(
          "transition-all duration-700",
          isLoading ? "scale-105 blur-lg grayscale" : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
        sizes={props.sizes || (isFill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined)}
        {...props}
      />
    </div>
  );
}

