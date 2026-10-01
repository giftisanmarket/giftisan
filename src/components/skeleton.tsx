import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-2xl bg-primary/[0.07]",
        shimmer ? "skeleton-shimmer" : "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("group block space-y-2.5", className)}>
      {/* Product Image Mockup */}
      <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-primary/5">
        <Skeleton className="w-full h-full rounded-xl md:rounded-2xl" />
      </div>

      {/* Product Details Mockup */}
      <div className="space-y-1.5 px-0.5 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="w-20 h-3 rounded-md" />
          <Skeleton className="w-8 h-3 rounded-md" />
        </div>
        <Skeleton className="w-4/5 h-4 rounded-md" />
        <div className="flex items-center justify-between pt-0.5">
          <Skeleton className="w-16 h-4 rounded-md" />
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
