// src/app/api/profile/update-items/route.js
import { sql } from "@/lib/db";

export async function POST(request) {
  try {
    const { userId, userEmail, userName } = await request.json();

    if (!userId || !userEmail || !userName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update all items associated with this user
    const result = await sql`
      UPDATE items 
      SET user_email = ${userEmail}, user_name = ${userName}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING id
    `;

    return Response.json({
      success: true,
      updatedCount: result.length,
      updatedItems: result,
    });
  } catch (error) {
    console.error("Error updating user items:", error);
    return Response.json({ error: "Failed to update user items" }, { status: 500 });
  }
}
