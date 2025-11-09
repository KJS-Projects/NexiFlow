// app/components/FavoriteButton.js
"use client";

import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toggleFavorite, checkFavoriteStatus } from "@/actions/favorites";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ itemId, initialFavoriteCount = 0 }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Check if item is already favorited
        const status = await checkFavoriteStatus(user.uid, itemId);
        setIsFavorited(status.isFavorited);
        setFavoriteCount(status.favoriteCount);
      }
    });

    return () => unsubscribe();
  }, [itemId]);

  const handleFavoriteClick = async () => {
    if (!currentUser) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);

    try {
      const result = await toggleFavorite(currentUser.uid, itemId);

      if (result.success) {
        setIsFavorited(result.action === "added");
        setFavoriteCount((prev) => (result.action === "added" ? prev + 1 : prev - 1));
      } else {
        console.error("Failed to toggle favorite:", result.error);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteClick}
      disabled={loading}
      className={`p-3 rounded-xl transition duration-300 flex items-center space-x-2 ${
        isFavorited ? "bg-red-100 text-red-500 hover:bg-red-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
      <FiHeart className={`text-xl ${isFavorited ? "fill-current" : ""}`} />
      <span className="text-sm font-medium">{favoriteCount}</span>
    </button>
  );
}
