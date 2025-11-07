// app/components/LoadingStates.js
export function ButtonLoading() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Loading...</span>
    </div>
  );
}

export function SearchLoading() {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-lg animate-pulse">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function FilterLoading() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
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
  );
}
