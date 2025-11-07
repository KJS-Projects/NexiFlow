// app/loading.js
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">NexiFlow</h1>
          <p className="text-sm text-teal-600 font-medium">Second Hand</p>
        </div>

        {/* Animated Spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-teal-200 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-teal-500 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-gray-600 font-medium">Loading amazing deals...</p>
          <p className="text-sm text-gray-500">Preparing your marketplace experience</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-amber-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
