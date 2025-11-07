// app/favorites/FavoritesClient.js
"use client";

import { useState, useEffect } from "react";
import { FiHeart, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { getFavorites } from "@/actions/favorites";
import { auth } from "@/utils/firebase"; // Make sure this path is correct
import { onAuthStateChanged } from "firebase/auth";

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const result = await getFavorites(user.uid);
          setFavorites(result.favorites || []);
        } catch (error) {
          console.error("Error fetching favorites:", error);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-20 bg-gray-300 rounded-full w-20 mx-auto mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-red-500 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h3>
            <p className="text-gray-600 mb-8">You need to be signed in to view your favorites.</p>
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

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-red-500 text-2xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Favorites</h1>
            <p className="text-lg text-gray-600">
              {favorites.length} saved item{favorites.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
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
                      <FiHeart className="text-red-500" />
                      <span>{item.location}</span>
                    </div>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>

                  <Link
                    href={`/items/${item.id}`}
                    className="w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition duration-300 block text-center">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-red-500 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No favorites yet</h3>
            <p className="text-gray-600 mb-8">Items you like will appear here. Click the heart icon on any item to save it for later.</p>
            <Link
              href="/browse"
              className="inline-flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition duration-300">
              <FiShoppingBag className="text-lg" />
              <span>Start Browsing</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
