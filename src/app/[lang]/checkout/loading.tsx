import { Skeleton } from "@/components/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar Skeleton */}
      <div className="h-20 border-b border-primary/5 px-4 flex items-center justify-between container mx-auto">
        <Skeleton className="w-32 h-10 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="w-32 h-5 rounded-md" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-12 border border-primary/5 space-y-8">
              <Skeleton className="w-64 h-10 rounded-lg" />
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="w-24 h-3 rounded-sm" />
                    <Skeleton className="w-full h-14 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-12 border border-primary/5 space-y-8">
              <Skeleton className="w-64 h-10 rounded-lg" />
              <div className="space-y-6">
                <Skeleton className="w-full h-14 rounded-2xl" />
                <div className="grid md:grid-cols-2 gap-6">
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-primary rounded-[2.5rem] p-10 space-y-8">
              <Skeleton className="w-48 h-8 rounded-lg bg-white/10" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-16 h-16 rounded-xl bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-3/4 h-4 rounded bg-white/10" />
                      <Skeleton className="w-1/4 h-3 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-white/10 space-y-4">
                <Skeleton className="w-full h-16 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
