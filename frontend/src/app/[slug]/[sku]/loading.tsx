export default function PDPLoading() {
  return (
    <div className="py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square bg-neutral-200 rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-200 rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-1/4" />
          </div>
          <div className="h-8 bg-neutral-200 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-full" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
            <div className="h-4 bg-neutral-200 rounded w-2/3" />
          </div>
          <div className="h-12 bg-neutral-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
