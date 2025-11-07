// app/components/LoadingSpinner.js
export function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-teal-200 rounded-full`}></div>
        <div
          className={`${sizeClasses[size]} border-4 border-teal-500 rounded-full animate-spin border-t-transparent absolute top-0 left-0`}></div>
      </div>
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
}

export function PulseLoader({ count = 3 }) {
  return (
    <div className="flex space-x-2 justify-center items-center">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}></div>
      ))}
    </div>
  );
}
