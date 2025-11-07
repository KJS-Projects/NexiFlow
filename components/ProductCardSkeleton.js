// app/components/ProductCardSkeleton.js
export function ProductCardSkeleton({ view = "grid" }) {
  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="flex flex-col sm:flex-row">
          {/* Image Skeleton */}
          <div className="sm:w-48 sm:h-48 h-40 bg-gradient-to-br from-teal-100 to-amber-100"></div>

          {/* Content Skeleton */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="h-8 bg-gray-300 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-12 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Skeleton
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gradient-to-br from-teal-100 to-amber-100"></div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
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
  );
}
