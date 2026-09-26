import { Skeleton } from "@/components/skeleton";
import { NavbarSkeleton } from "@/components/navbar-skeleton";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Sticky Navbar Skeleton */}
      <NavbarSkeleton />

      <div className="container mx-auto px-4 pt-40 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Introduction mockup */}
          <div className="text-center space-y-4 mb-16 px-4">
            <Skeleton className="w-80 md:w-96 h-12 md:h-20 rounded-xl mx-auto" />
            <Skeleton className="w-full max-w-2xl h-10 rounded-md mx-auto" />
          </div>

          {/* Dual Column Content Grid Mockup */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info (Left Column) */}
            <div className="space-y-10 order-2 md:order-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-primary/5 shrink-0">
                    <Skeleton className="w-6 h-6 rounded-md" />
                  </div>
                  <div className="space-y-2 flex-1 pt-1">
                    <Skeleton className="w-32 h-5 rounded-md" />
                    <Skeleton className="w-48 h-4 rounded-md" />
                    <Skeleton className="w-20 h-3 rounded-md" />
                  </div>
                </div>
              ))}

              {/* Artisan promo notice box mockup */}
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/5 space-y-3">
                <Skeleton className="w-40 h-5 rounded-md bg-primary/10" />
                <Skeleton className="w-full h-12 rounded-lg bg-primary/10" />
              </div>
            </div>

            {/* Contact Form card (Right Column) */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-primary/5 shadow-2xl order-1 md:order-2 space-y-6">
              <div className="mb-8 space-y-2">
                <Skeleton className="w-48 h-8 rounded-lg" />
                <Skeleton className="w-64 h-4 rounded-md" />
              </div>

              {/* Form inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="w-20 h-4 rounded-md ms-1" />
                  <Skeleton className="w-full h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-24 h-4 rounded-md ms-1" />
                  <Skeleton className="w-full h-14 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-32 h-4 rounded-md ms-1" />
                  <Skeleton className="w-full h-32 rounded-2xl" />
                </div>

                {/* Submit button mockup */}
                <Skeleton className="w-full h-16 rounded-2xl" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
