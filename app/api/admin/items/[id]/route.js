// app/api/admin/items/[id]/route.js
import { NextResponse } from "next/server";
import { updateItemStatus, deleteItem } from "@/lib/queries/items";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // Validate status
    const validStatuses = ["active", "inactive", "sold", "expired"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await updateItemStatus(id, status);
    return NextResponse.json({ message: "Item status updated successfully" });
  } catch (error) {
    console.error("Error updating item status:", error);
    return NextResponse.json({ error: "Failed to update item status" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteItem(id);
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
