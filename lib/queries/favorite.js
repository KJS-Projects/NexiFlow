// src/lib/queries/favorites.js
import { sql } from "@/lib/db";

// Ensure the favorites table exists
async function ensureTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      -- Ensure a user can't favorite the same item multiple times
      UNIQUE(user_id, item_id),
      
      -- Foreign key constraint to items table
      CONSTRAINT fk_item
        FOREIGN KEY(item_id) 
        REFERENCES items(id)
        ON DELETE CASCADE
    )
  `;

  // Create index for faster queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_favorites_user_id 
    ON favorites(user_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_favorites_item_id 
    ON favorites(item_id)
  `;
}

// Add item to favorites
export async function addToFavorites(userId, itemId) {
  await ensureTableExists();

  try {
    const result = await sql`
      INSERT INTO favorites (user_id, item_id)
      VALUES (${userId}, ${itemId})
      RETURNING *
    `;
    return { success: true, favorite: result[0] };
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      return { success: false, error: "Item already in favorites" };
    }
    console.error("Error adding to favorites:", error);
    return { success: false, error: "Failed to add to favorites" };
  }
}

// Remove item from favorites
export async function removeFromFavorites(userId, itemId) {
  await ensureTableExists();

  try {
    const result = await sql`
      DELETE FROM favorites 
      WHERE user_id = ${userId} AND item_id = ${itemId}
      RETURNING *
    `;

    if (result.length === 0) {
      return { success: false, error: "Favorite not found" };
    }

    return { success: true, removed: result[0] };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return { success: false, error: "Failed to remove from favorites" };
  }
}

// Check if item is in user's favorites
export async function isItemInFavorites(userId, itemId) {
  await ensureTableExists();

  try {
    const result = await sql`
      SELECT id FROM favorites 
      WHERE user_id = ${userId} AND item_id = ${itemId}
      LIMIT 1
    `;

    return result.length > 0;
  } catch (error) {
    console.error("Error checking favorites:", error);
    return false;
  }
}

// Get all favorite items for a user with pagination
export async function getFavoritesByUserId(userId, page = 1, limit = 12) {
  await ensureTableExists();

  const offset = (page - 1) * limit;

  try {
    // Get favorite items with item details
    const favoritesResult = await sql`
      SELECT 
        f.id as favorite_id,
        f.created_at as favorited_at,
        i.id,
        i.title,
        i.description,
        i.category,
        i.price,
        i.original_price,
        i.location,
        i.condition,
        i.contact_name,
        i.contact_phone,
        i.image_urls,
        i.user_id,
        i.user_email,
        i.user_name,
        i.created_at,
        i.updated_at
      FROM favorites f
      INNER JOIN items i ON f.item_id = i.id
      WHERE f.user_id = ${userId}
      ORDER BY f.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as total_count
      FROM favorites f
      INNER JOIN items i ON f.item_id = i.id
      WHERE f.user_id = ${userId}
    `;

    const totalCount = parseInt(countResult[0].total_count);
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Parse image URLs
    const favorites = favoritesResult.map((fav) => ({
      ...fav,
      image_urls: parseImageUrls(fav.image_urls),
    }));

    return {
      favorites,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    };
  } catch (error) {
    console.error("Error getting favorites:", error);
    return { favorites: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false, limit } };
  }
}

// Get favorite count for an item
export async function getFavoriteCount(itemId) {
  await ensureTableExists();

  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM favorites 
      WHERE item_id = ${itemId}
    `;
    return parseInt(result[0].count);
  } catch (error) {
    console.error("Error getting favorite count:", error);
    return 0;
  }
}

// Get user's favorite items count
export async function getUserFavoritesCount(userId) {
  await ensureTableExists();

  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM favorites f
      INNER JOIN items i ON f.item_id = i.id
      WHERE f.user_id = ${userId}
    `;
    return parseInt(result[0].count);
  } catch (error) {
    console.error("Error getting user favorites count:", error);
    return 0;
  }
}

// Remove all favorites for an item (useful when item is deleted)
export async function removeAllFavoritesForItem(itemId) {
  await ensureTableExists();

  try {
    const result = await sql`
      DELETE FROM favorites 
      WHERE item_id = ${itemId}
      RETURNING *
    `;
    return { success: true, removed: result };
  } catch (error) {
    console.error("Error removing favorites for item:", error);
    return { success: false, error: "Failed to remove favorites" };
  }
}

// Helper function to parse image URLs
function parseImageUrls(imageUrls) {
  if (!imageUrls) return [];
  if (Array.isArray(imageUrls)) return imageUrls;

  if (typeof imageUrls === "string") {
    try {
      return imageUrls
        .replace(/[{}]/g, "")
        .split(",")
        .filter((url) => url.trim());
    } catch (error) {
      console.error("Error parsing image URLs:", error);
      return [];
    }
  }

  return [];
}
