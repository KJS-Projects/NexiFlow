// app/signin/loading.js
export default function SignInLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
            </div>
          ))}
          <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
