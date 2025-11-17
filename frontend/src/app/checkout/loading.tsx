export default function CheckoutLoading() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-7 space-y-8">
            {/* Cart Items Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="h-6 bg-neutral-200 rounded w-32 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-20 bg-neutral-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-4 bg-neutral-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Form Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="h-6 bg-neutral-200 rounded w-40 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
                    <div className="h-10 bg-neutral-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="h-6 bg-neutral-200 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                <div className="h-10 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-6 bg-neutral-200 rounded mt-6"></div>
                <div className="h-12 bg-neutral-200 rounded mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
