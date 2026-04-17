import { Skeleton } from "@/components/skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex flex-col container mx-auto px-4 py-20 space-y-12">
        <div className="space-y-4">
          <Skeleton className="w-64 h-12 rounded-lg" />
          <Skeleton className="w-full h-16 rounded-2xl" />
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[3/4] rounded-[2rem]" />
              <div className="space-y-2">
                <Skeleton className="w-24 h-4 rounded-md" />
                <Skeleton className="w-48 h-8 rounded-lg" />
                <Skeleton className="w-20 h-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
