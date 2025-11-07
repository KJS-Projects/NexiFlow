// app/actions/favorites.js
"use server";

import { addToFavorites, removeFromFavorites, isItemInFavorites, getFavoriteCount, getFavoritesByUserId } from "@/lib/queries/favorite";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(userId, itemId) {
  if (!userId) {
    return { success: false, error: "User must be logged in" };
  }

  try {
    // Check if already favorited
    const isFavorited = await isItemInFavorites(userId, itemId);

    if (isFavorited) {
      // Remove from favorites
      const result = await removeFromFavorites(userId, itemId);
      if (result.success) {
        revalidatePath("/favorites");
        revalidatePath(`/item/${itemId}`);
        revalidatePath("/");
        return {
          success: true,
          action: "removed",
          message: "Removed from favorites",
        };
      }
      return result;
    } else {
      // Add to favorites
      const result = await addToFavorites(userId, itemId);
      if (result.success) {
        revalidatePath("/favorites");
        revalidatePath(`/item/${itemId}`);
        revalidatePath("/");
        return {
          success: true,
          action: "added",
          message: "Added to favorites",
        };
      }
      return result;
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to update favorites" };
  }
}

export async function checkFavoriteStatus(userId, itemId) {
  if (!userId) {
    return { isFavorited: false, favoriteCount: 0 };
  }

  try {
    const [isFavorited, favoriteCount] = await Promise.all([isItemInFavorites(userId, itemId), getFavoriteCount(itemId)]);

    return { isFavorited, favoriteCount };
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return { isFavorited: false, favoriteCount: 0 };
  }
}

export async function getFavorites(userId) {
  if (!userId) {
    return { favorites: [] };
  }

  try {
    const result = await getFavoritesByUserId(userId);
    return result;
  } catch (error) {
    console.error("Error getting favorites:", error);
    return { favorites: [] };
  }
}
