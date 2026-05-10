import { Skeleton } from "@/components/skeleton";

export default function FavoritesLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Sticky Navbar Skeleton mockup to completely prevent header flashing and maintain layout continuity */}
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="w-10 h-10 rounded-md" />
            <Skeleton className="w-24 h-6 rounded-md" />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-20 md:w-28 h-9 rounded-full" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12 md:pt-16 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Favorites Header Mockup */}
          <header className="mb-12 text-center md:text-start space-y-4">
            <Skeleton className="w-64 h-12 rounded-lg mx-auto md:mx-0" />
            <Skeleton className="w-full max-w-lg h-6 rounded-md mx-auto md:mx-0" />
          </header>

          {/* List of Favorite Items */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div 
                key={i} 
                className="bg-white rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-8 border border-primary/5 shadow-xl shadow-primary/5"
              >
                {/* Image Skeleton matching w-full md:w-48 aspect-square rounded-[2rem] */}
                <div className="relative w-full md:w-48 aspect-square rounded-[2rem] overflow-hidden shrink-0">
                  <Skeleton className="w-full h-full" />
                </div>

                {/* Details Skeletons */}
                <div className="flex-1 text-center md:text-start space-y-3 w-full">
                  <Skeleton className="w-32 h-4 rounded-md mx-auto md:mx-0" />
                  <Skeleton className="w-3/4 h-8 rounded-lg mx-auto md:mx-0" />
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4 rounded-md" />
                    <Skeleton className="w-2/3 h-4 rounded-md mx-auto md:mx-0" />
                  </div>
                  <Skeleton className="w-24 h-6 rounded-md pt-2 mx-auto md:mx-0" />
                </div>

                {/* Action Button Skeletons */}
                <div className="flex gap-3 w-full md:w-auto shrink-0">
                  <Skeleton className="flex-1 md:w-48 h-14 rounded-2xl" />
                  <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
