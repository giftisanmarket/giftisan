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

  return (
    <div className={cn(
      "relative overflow-hidden", 
      isFill && "h-full w-full",
      containerClassName
    )}>
      {isLoading && <Skeleton className="absolute inset-0 z-10" />}
      <Image
        loader={isOptimized ? ({ src, width, quality }) => {
          return `/api/image/${type}/${id}?w=${width}&q=${quality || 85}`
        } : undefined}
        src={isOptimized ? `giftisan-${type}-${id}` : src}
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

