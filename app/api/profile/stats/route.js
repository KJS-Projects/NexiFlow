// src/app/api/profile/stats/route.js
import { getItemsByUserId } from "@/lib/queries/items";
import { getUserFavoritesCount } from "@/lib/queries/favorite";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const [items, favoritesCount] = await Promise.all([getItemsByUserId(userId), getUserFavoritesCount(userId)]);

    return Response.json({
      items,
      favoritesCount,
      stats: {
        itemsCount: items.length,
        favoritesCount,
        activeChats: 0, // You can implement this later
      },
    });
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    return Response.json({ error: "Failed to fetch profile data" }, { status: 500 });
  }
}
