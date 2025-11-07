// app/actions/items.js
"use server";

import { updateItemStatus, deleteItem } from "@/lib/queries/items";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUserItemsByUserId } from "@/lib/queries/items";

export async function updateItemStatusAction(itemId, status, userId) {
  try {
    // Verify ownership on the server side
    // You might want to add a function to check if the user owns the item
    await updateItemStatus(itemId, status);

    revalidatePath(`/item/${itemId}`);
    revalidatePath("/browse");
    revalidatePath("/");

    return { success: true, message: `Item marked as ${status}` };
  } catch (error) {
    console.error("Error updating item status:", error);
    return { success: false, error: "Failed to update item status" };
  }
}

export async function deleteItemAction(itemId, userId) {
  try {
    // Verify ownership on the server side
    await deleteItem(itemId);

    revalidatePath("/browse");
    revalidatePath("/");

    return { success: true, message: "Item deleted successfully" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function getMyItems(userId) {
  if (!userId) {
    return { items: [] };
  }

  try {
    const items = await getUserItemsByUserId(userId);
    return { items };
  } catch (error) {
    console.error("Error getting user's items:", error);
    return { items: [] };
  }
}
