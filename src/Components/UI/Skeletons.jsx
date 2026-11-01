export const CardGridSkeleton = ({ count = 6, className = "" }) => (
  <div
    className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    aria-busy="true"
    aria-label="Loading"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="surface-flat overflow-hidden">
        <div className="skeleton h-52 w-full rounded-none"></div>
        <div className="space-y-3 p-5">
          <div className="skeleton h-5 w-3/4"></div>
          <div className="skeleton h-4 w-1/2"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export const ListSkeleton = ({ rows = 5 }) => (
  <div className="surface-flat divide-y divide-base-content/10" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4">
        <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3"></div>
          <div className="skeleton h-3 w-1/3"></div>
        </div>
        <div className="skeleton hidden h-8 w-24 sm:block"></div>
      </div>
    ))}
  </div>
);

export const StatsSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xl:grid-cols-4" aria-busy="true" aria-label="Loading">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="surface-flat space-y-4 p-5">
        <div className="skeleton h-4 w-1/2"></div>
        <div className="skeleton h-8 w-2/3"></div>
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <StatsSkeleton />
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="skeleton h-72 rounded-2xl lg:col-span-2"></div>
      <div className="skeleton h-72 rounded-2xl"></div>
    </div>
  </div>
);
