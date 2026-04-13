"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface BespokeImageProps extends ImageProps {
  containerClassName?: string;
}

export function BespokeImage({ 
  src, 
  alt, 
  className, 
  containerClassName,
  ...props 
}: BespokeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const isFill = !!props.fill;

  return (
    <div className={cn(
      "relative overflow-hidden", 
      isFill && "h-full w-full",
      containerClassName
    )}>
      {isLoading && <Skeleton className="absolute inset-0 z-10" />}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-all duration-700",
          isLoading ? "scale-105 blur-lg grayscale" : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
