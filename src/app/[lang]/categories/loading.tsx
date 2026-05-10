import { Skeleton } from "@/components/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="pt-24 md:pt-40 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="max-w-3xl mb-16 space-y-4">
            <Skeleton className="w-56 h-12 md:w-96 md:h-16 rounded-xl" />
            <Skeleton className="w-full max-w-xl h-6 rounded-md" />
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i}
                className="bg-white rounded-[3rem] p-8 md:p-10 border border-primary/5 flex flex-col justify-between"
              >
                <div>
                  {/* Category Icon box skeleton */}
                  <Skeleton className="w-16 h-16 rounded-2xl mb-8" />
                  
                  {/* Category Title */}
                  <Skeleton className="w-48 h-8 rounded-lg mb-4" />
                  
                  {/* Category Description Lines */}
                  <div className="space-y-2 mb-8">
                    <Skeleton className="w-full h-4 rounded-md" />
                    <Skeleton className="w-full h-4 rounded-md" />
                    <Skeleton className="w-2/3 h-4 rounded-md" />
                  </div>
                </div>
                
                {/* Bottom row block */}
                <div className="pt-8 border-t border-primary/5 flex items-center justify-between">
                  <Skeleton className="w-24 h-4 rounded-md" />
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
