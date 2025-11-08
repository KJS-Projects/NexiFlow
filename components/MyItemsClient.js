// app/my-items/MyItemsClient.js
"use client";

import { useState, useEffect } from "react";
import { getMyItems } from "@/actions/itemsAction";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiShoppingBag, FiPlus, FiArrowLeft, FiCheck, FiX, FiEdit, FiDollarSign, FiMapPin, FiCalendar, FiTag } from "react-icons/fi";
import Link from "next/link";

export default function MyItemsClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const result = await getMyItems(user.uid);
          setItems(result.items || []);
        } catch (error) {
          console.error("Error fetching user items:", error);
          setItems([]);
        }
      } else {
        setItems([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Count items by status
  const activeItems = items.filter((item) => item.status === "active");
  const soldItems = items.filter((item) => item.status === "sold");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-8 bg-gray-300 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="text-teal-500 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h3>
            <p className="text-gray-600 mb-8">You need to be signed in to view your items.</p>
            <Link
              href="/signin"
              className="inline-flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition duration-300">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/browse"
            className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium mb-6 transition duration-300">
            <FiArrowLeft className="text-lg" />
            <span>Back to Browse</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Items</h1>
              <p className="text-lg text-gray-600">Manage your listings and track your sales</p>
            </div>

            <Link
              href="/sell"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-amber-600 transition duration-300 shadow-lg shadow-teal-500/25 mt-4 lg:mt-0">
              <FiPlus className="text-lg" />
              <span>List New Item</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">{items.length}</div>
              <div className="text-gray-600">Total Items</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{activeItems.length}</div>
              <div className="text-gray-600">Active Listings</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{soldItems.length}</div>
              <div className="text-gray-600">Sold Items</div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ${
                  item.status === "sold" ? "opacity-80" : ""
                }`}>
                {/* Status Badge */}
                <div
                  className={`px-4 py-2 text-sm font-semibold text-white ${
                    item.status === "active" ? "bg-green-500" : item.status === "sold" ? "bg-amber-500" : "bg-gray-500"
                  }`}>
                  {item.status === "active" ? "ACTIVE" : item.status === "sold" ? "SOLD" : "INACTIVE"}
                </div>

                {/* Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {item.image_urls && item.image_urls.length > 0 ? (
                    <img
                      src={item.image_urls[0]}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-100 to-amber-100 flex items-center justify-center">
                      <FiShoppingBag className="text-teal-400 text-3xl" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{item.title}</h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-sm font-medium">{item.condition}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <FiMapPin className="text-amber-500" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="text-gray-400" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/items/${item.id}`}
                      className="flex-1 bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition duration-300 text-center text-sm">
                      View
                    </Link>

                    {item.status === "active" && (
                      <Link
                        href={`/items/${item.id}/edit`}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition duration-300 text-center text-sm flex items-center justify-center space-x-1">
                        <FiEdit className="text-sm" />
                        <span>Manage</span>
                      </Link>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FiTag className="text-gray-400" />
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="text-gray-400" />
                      <span>Listed {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="text-teal-500 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No items yet</h3>
            <p className="text-gray-600 mb-8">
              You haven't listed any items for sale yet. Start selling your unused items and make some extra money!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sell"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-amber-600 transition duration-300">
                <FiPlus className="text-lg" />
                <span>List Your First Item</span>
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center space-x-2 border border-teal-500 text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition duration-300">
                <span>Browse Marketplace</span>
              </Link>
            </div>
          </div>
        )}

        {/* Tips for Sellers */}
        {items.length > 0 && (
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Tips for Better Sales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
              <div className="flex items-start space-x-2">
                <FiCheck className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Use clear, well-lit photos from multiple angles</span>
              </div>
              <div className="flex items-start space-x-2">
                <FiCheck className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Write detailed, honest descriptions</span>
              </div>
              <div className="flex items-start space-x-2">
                <FiCheck className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Price your items competitively</span>
              </div>
              <div className="flex items-start space-x-2">
                <FiCheck className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Respond quickly to buyer inquiries</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
