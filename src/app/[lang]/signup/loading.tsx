import { Skeleton } from "@/components/skeleton";

export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center py-12 px-6 md:p-20 relative">
      {/* Back to shop button mockup */}
      <div className="absolute top-12 start-12 flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-20 h-4 rounded-md" />
      </div>

      {/* Main card container mockup */}
      <div className="w-full max-w-2xl bg-white rounded-3xl md:rounded-[3rem] p-8 py-12 md:p-20 shadow-2xl shadow-primary/5 border border-primary/5 relative z-10 mt-20 md:mt-32 space-y-8 md:space-y-12">
        {/* Header titles */}
        <div className="space-y-4 text-center">
          <Skeleton className="w-64 md:w-80 h-10 md:h-14 rounded-xl mx-auto" />
          <Skeleton className="w-48 md:w-64 h-5 rounded-md mx-auto" />
        </div>

        {/* Google button mockup */}
        <Skeleton className="w-full h-14 md:h-16 rounded-2xl" />

        {/* Divider mockup */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/5"></div>
          </div>
          <div className="relative flex justify-center">
            <Skeleton className="w-24 h-4 rounded bg-white" />
          </div>
        </div>

        {/* Role select grid mockup */}
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-primary/5 bg-cream/10 flex flex-col items-center text-center gap-4 md:gap-6">
              <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="w-32 h-6 rounded-md mx-auto" />
                <Skeleton className="w-full h-8 rounded-md mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Next step button mockup */}
        <Skeleton className="w-full h-14 md:h-16 rounded-2xl" />

        {/* Footer sign in text */}
        <Skeleton className="w-56 h-4 rounded-md mx-auto" />
      </div>
    </div>
  );
}
