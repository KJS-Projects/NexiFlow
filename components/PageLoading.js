import { SkeletonLoading } from "./SkeletonLoading";

// app/components/PageLoading.js
export function BrowsePageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoading />
      </div>
    </div>
  );
}

export function ItemPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-teal-100 to-amber-100 rounded-2xl"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>

          {/* Item Details Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                  <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                </div>
              </div>

              <div className="flex items-end space-x-4 mb-4">
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>

              <div className="h-12 bg-gray-300 rounded-xl"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-3 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
