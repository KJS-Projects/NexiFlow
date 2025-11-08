// app/api/items/[id]/update/route.js
import { updateItemInDatabase } from "@/lib/queries/items";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const itemData = await request.json();

    const updatedItem = await updateItemInDatabase(id, itemData);

    return NextResponse.json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update item",
      },
      { status: 500 }
    );
  }
}
