import { Skeleton } from "@/components/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header Skeleton */}
      <div className="py-24 bg-white border-b border-primary/5">
        <div className="container mx-auto px-4 text-center space-y-4">
          <Skeleton className="w-24 h-6 rounded-full mx-auto" />
          <Skeleton className="w-96 h-12 rounded-lg mx-auto" />
          <Skeleton className="w-full max-w-lg h-5 rounded-md mx-auto" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div 
              key={i}
              className="group aspect-[4/5] bg-white rounded-[2.5rem] border border-primary/5 p-8 flex flex-col items-center justify-center gap-6"
            >
              <Skeleton className="w-24 h-24 rounded-3xl" />
              <div className="text-center space-y-3 w-full">
                <Skeleton className="h-10 w-3/4 mx-auto rounded-lg" />
                <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
                <div className="h-12 border-t border-primary/5 mt-6 pt-6 w-full">
                  <Skeleton className="h-4 w-1/4 mx-auto rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
