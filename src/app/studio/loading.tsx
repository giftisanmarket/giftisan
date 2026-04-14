import { Skeleton } from "@/components/skeleton";

export default function StudioLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-32 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <Skeleton className="w-64 h-12 rounded-lg" />
            <Skeleton className="w-48 h-6 rounded-md" />
          </div>
          <Skeleton className="w-48 h-14 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-[2rem]" />
          ))}
        </div>

        <div className="flex gap-4 mb-8">
          <Skeleton className="w-40 h-12 rounded-full" />
          <Skeleton className="w-40 h-12 rounded-full" />
        </div>

        <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-primary/5 border border-primary/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-square rounded-[2.5rem]" />
                <div className="space-y-3">
                  <Skeleton className="w-3/4 h-8 rounded-lg" />
                  <Skeleton className="w-1/2 h-6 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
