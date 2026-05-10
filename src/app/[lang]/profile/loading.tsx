import { Skeleton } from "@/components/skeleton";

export default function ProfileLoading() {
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

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Sidebar / Profile Header Skeleton */}
          <aside className="lg:col-span-4 space-y-6 md:space-y-8">
            {/* Main Avatar & Profile card mockup */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-primary/5 border border-primary/5 relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Avatar skeleton */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
                
                {/* User Info skeleton */}
                <Skeleton className="w-48 h-8 rounded-lg mb-2" />
                <Skeleton className="w-32 h-4 rounded-md mb-6 md:mb-8" />
                
                {/* Profile navigation buttons mockup */}
                <div className="w-full grid grid-cols-1 gap-2">
                  <Skeleton className="h-12 md:h-14 rounded-2xl w-full" />
                  <Skeleton className="h-12 md:h-14 rounded-2xl w-full" />
                  <Skeleton className="h-12 md:h-14 rounded-2xl w-full" />
                </div>
              </div>
            </div>

            {/* Impact card mockup */}
            <div className="bg-primary text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-primary/20">
              <Skeleton className="w-32 h-6 md:h-7 bg-white/20 rounded-md mb-4 md:mb-6" />
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <Skeleton className="w-24 h-4 bg-white/20 rounded-md" />
                  <Skeleton className="w-8 h-8 bg-white/20 rounded-md" />
                </div>
                <div className="p-4 bg-white/10 rounded-2xl">
                  <Skeleton className="w-20 h-3 bg-white/10 rounded-sm mb-1" />
                  <Skeleton className="w-full h-10 bg-white/10 rounded-md" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            <section>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4">
                <div className="space-y-2">
                  <Skeleton className="w-56 h-8 md:h-10 rounded-lg" />
                  <Skeleton className="w-48 h-4 rounded-md" />
                </div>
                <Skeleton className="w-32 h-4 rounded-md" />
              </div>

              {/* Order items mock list */}
              <div className="space-y-4 md:space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
                    {/* Header bar */}
                    <div className="p-4 md:p-8 border-b border-primary/5 bg-cream/30 flex flex-wrap justify-between items-center gap-3">
                      <div className="flex flex-wrap gap-4 md:gap-8">
                        <div className="space-y-1">
                          <Skeleton className="w-16 h-3 rounded-md" />
                          <Skeleton className="w-20 h-4 rounded-md" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="w-16 h-3 rounded-md" />
                          <Skeleton className="w-20 h-4 rounded-md" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="w-16 h-3 rounded-md" />
                          <Skeleton className="w-20 h-4 rounded-md" />
                        </div>
                      </div>
                    </div>

                    {/* Order items details */}
                    <div className="p-4 md:p-8 space-y-6">
                      <div className="flex gap-4 md:gap-6 items-start md:items-center">
                        <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl shrink-0" />
                        <div className="flex-1 space-y-2 min-w-0">
                          <Skeleton className="w-3/4 h-5 md:h-6 rounded-md" />
                          <Skeleton className="w-48 h-4 rounded-md" />
                          <div className="flex items-center gap-2 pt-1">
                            <Skeleton className="w-16 h-5 rounded-full" />
                            <Skeleton className="w-24 h-4 rounded-md" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
