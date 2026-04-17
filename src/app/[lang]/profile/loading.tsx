import { Skeleton } from "@/components/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-32 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 mb-12">
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
              <Skeleton className="w-32 h-32 rounded-full border-4 border-white shadow-xl flex-shrink-0" />
              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                  <div className="space-y-2">
                    <Skeleton className="w-48 h-8 rounded-lg" />
                    <Skeleton className="w-32 h-4 rounded-md" />
                  </div>
                  <Skeleton className="w-40 h-12 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                  <Skeleton className="w-32 h-6 rounded-full" />
                  <Skeleton className="w-32 h-6 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 transition-all order-2 lg:order-1">
              <div className="bg-white rounded-[2.5rem] p-8 border border-primary/5 shadow-xl shadow-primary/5 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 rounded-2xl w-full" />
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-primary/5 shadow-xl shadow-primary/5 min-h-[500px] flex flex-col items-center justify-center text-center space-y-6">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-3 w-full max-w-sm">
                  <Skeleton className="h-8 rounded-lg w-full" />
                  <Skeleton className="h-6 rounded-md w-2/3 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
