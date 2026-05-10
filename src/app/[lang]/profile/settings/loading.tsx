import { Skeleton } from "@/components/skeleton";

export default function SettingsLoading() {
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
        <div className="max-w-4xl mx-auto">
          {/* Settings Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-24 h-4 rounded-md" />
            </div>
            <Skeleton className="w-64 h-12 md:h-16 rounded-xl" />
          </div>

          {/* Settings Main Content Grid */}
          <div className="grid md:grid-cols-12 gap-6 md:gap-12">
            {/* Left Column (Avatar & Info Cards) */}
            <div className="md:col-span-4 space-y-6 md:space-y-8">
              {/* Avatar Preview Card */}
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-primary/5 border border-primary/5 flex flex-col items-center text-center">
                <div className="relative w-28 h-28 md:w-40 md:h-40 mb-4 md:mb-6">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
                <Skeleton className="w-32 h-6 rounded-md mb-2" />
                <Skeleton className="w-24 h-4 rounded-md" />
              </div>

              {/* Privacy Notice Card */}
              <div className="p-5 md:p-8 bg-primary rounded-[1.5rem] md:rounded-[2.5rem] space-y-3 md:space-y-4 shadow-xl">
                <Skeleton className="w-24 h-4 bg-white/20 rounded-md" />
                <Skeleton className="w-full h-12 bg-white/10 rounded-md" />
              </div>
            </div>

            {/* Right Column (Form Details & Danger Zone) */}
            <div className="md:col-span-8 space-y-8 md:space-y-12">
              {/* Settings Form Mockup */}
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-5 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-6 md:space-y-10">
                <div className="space-y-5 md:space-y-6">
                  {/* Full Name input mockup */}
                  <div className="grid gap-1.5 md:gap-2">
                    <Skeleton className="w-20 h-4 rounded-md ms-4" />
                    <Skeleton className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl" />
                  </div>

                  {/* Profile Photo input mockup */}
                  <div className="grid gap-1.5 md:gap-2">
                    <Skeleton className="w-24 h-4 rounded-md ms-4" />
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <Skeleton className="flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl" />
                      <Skeleton className="w-32 h-14 md:h-16 rounded-xl md:rounded-2xl" />
                    </div>
                  </div>

                  {/* Email Address readonly mockup */}
                  <div className="grid gap-1.5 md:gap-2">
                    <Skeleton className="w-24 h-4 rounded-md ms-4" />
                    <Skeleton className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl" />
                  </div>
                </div>

                {/* Save Button mockup */}
                <div className="pt-6 md:pt-8 border-t border-primary/5">
                  <Skeleton className="w-40 h-14 md:h-16 rounded-xl md:rounded-2xl" />
                </div>
              </div>

              {/* Danger Zone Mockup */}
              <div className="bg-red-50/50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 border border-red-100 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 text-center lg:text-start">
                  <Skeleton className="w-32 h-6 rounded-md mx-auto lg:mx-0" />
                  <Skeleton className="w-48 h-4 rounded-md mx-auto lg:mx-0" />
                </div>
                <Skeleton className="w-full lg:w-40 h-14 rounded-2xl shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
