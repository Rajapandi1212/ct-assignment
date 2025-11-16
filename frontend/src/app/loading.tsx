export default function Loading() {
  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-neutral-200">
        <div className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 animate-progress" />
      </div>

      {/* Loading content */}
      <div className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-4">
              <div className="h-6 bg-neutral-200 rounded w-24 animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 bg-neutral-200 rounded w-32 animate-pulse" />
                  <div className="space-y-1 ml-4">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-4 bg-neutral-100 rounded w-28 animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="flex-1">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-neutral-200 rounded w-48 animate-pulse" />
              <div className="h-10 bg-neutral-200 rounded w-40 animate-pulse" />
            </div>

            {/* Product grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-200 rounded-lg mb-3" />
                  <div className="h-4 bg-neutral-200 rounded mb-2" />
                  <div className="h-3 bg-neutral-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
