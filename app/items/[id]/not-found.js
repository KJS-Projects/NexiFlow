// app/item/[id]/not-found.js
import Link from "next/link";
import { FiHome, FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSearch className="text-red-500 text-3xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">Item Not Found</h1>

          <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or may have been removed.</p>

          <div className="space-y-3">
            <Link
              href="/"
              className="w-full bg-gradient-to-r from-teal-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-amber-600 transition duration-300 shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2">
              <FiHome className="text-lg" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/browse"
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition duration-300 flex items-center justify-center space-x-2">
              <FiSearch className="text-lg" />
              <span>Browse Items</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
