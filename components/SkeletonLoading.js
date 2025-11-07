// app/components/SkeletonLoading.js
export function SkeletonLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="mb-6">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            {/* Results Header Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-8 bg-gray-300 rounded w-24"></div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  {/* Image Skeleton */}
                  <div className="h-48 bg-gradient-to-br from-teal-100 to-amber-100"></div>

                  {/* Content Skeleton */}
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="h-6 bg-gray-300 rounded w-16 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-12"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>

                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
