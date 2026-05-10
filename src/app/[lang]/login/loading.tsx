import { Skeleton } from "@/components/skeleton";

export default function LoginLoading() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* Visual Side (Left Column) */}
      <div className="hidden lg:block relative overflow-hidden h-full bg-primary/5">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-20 text-center">
          <div className="bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/20 shadow-2xl w-full max-w-sm space-y-4">
            <Skeleton className="w-48 h-8 rounded-lg bg-white/20 mx-auto" />
            <Skeleton className="w-full h-12 bg-white/10 rounded-md" />
          </div>
        </div>
      </div>

      {/* Form Side (Right Column) */}
      <div className="flex flex-col justify-center items-center py-16 px-6 md:p-20 relative">
        {/* Back button link */}
        <div className="md:absolute md:top-12 md:start-12 flex items-center gap-2 mb-8 md:mb-0 self-start md:self-auto">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>

        {/* Form container mockup */}
        <div className="w-full max-w-md space-y-8 md:space-y-12">
          {/* Header titles */}
          <div className="space-y-3 md:space-y-4">
            <Skeleton className="w-64 h-12 md:h-16 rounded-xl" />
            <Skeleton className="w-48 h-4 rounded-md" />
          </div>

          {/* Form fields mockup */}
          <div className="space-y-5 md:space-y-6">
            {/* Google button mockup */}
            <Skeleton className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl" />

            {/* Divider mockup */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/5"></div>
              </div>
              <div className="relative flex justify-center">
                <Skeleton className="w-10 h-4 rounded bg-cream" />
              </div>
            </div>

            {/* Email input field mockup */}
            <div className="space-y-2">
              <Skeleton className="w-20 h-4 rounded-md ms-1" />
              <Skeleton className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl" />
            </div>

            {/* Password input field mockup */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Skeleton className="w-24 h-4 rounded-md ms-1" />
                <Skeleton className="w-28 h-4 rounded-md" />
              </div>
              <Skeleton className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl" />
            </div>

            {/* Submit button mockup */}
            <Skeleton className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl" />
          </div>

          {/* Footer apply text */}
          <Skeleton className="w-56 h-4 rounded-md mx-auto" />
        </div>
      </div>
    </div>
  );
}
