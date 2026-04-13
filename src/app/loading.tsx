import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar Skeleton */}
      <div className="h-20 border-b border-primary/5 px-4 flex items-center justify-between container mx-auto">
        <Skeleton className="w-32 h-10 rounded-lg" />
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <Skeleton className="w-full h-12 rounded-full" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 space-y-20">
        {/* Hero Skeleton */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-full h-20 rounded-2xl" />
            <Skeleton className="w-3/4 h-20 rounded-2xl" />
            <Skeleton className="w-2/3 h-12 rounded-xl" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="w-40 h-14 rounded-full" />
              <Skeleton className="w-40 h-14 rounded-full" />
            </div>
          </div>
          <Skeleton className="aspect-square rounded-[3rem]" />
        </div>

        {/* Section Skeleton */}
        <div className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <Skeleton className="w-48 h-10 rounded-lg" />
              <Skeleton className="w-64 h-5 rounded-md" />
            </div>
            <Skeleton className="w-32 h-6" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-[2rem]" />
                <Skeleton className="w-24 h-4 rounded-md" />
                <Skeleton className="w-48 h-8 rounded-lg" />
                <Skeleton className="w-20 h-6 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
