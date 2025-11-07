// app/actions/items.js
"use server";

import { addItem, updateItemStatus, deleteItem } from "@/lib/queries/items";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createItem(formData) {
  try {
    // Extract form data
    const itemData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: parseFloat(formData.get("price")),
      originalPrice: formData.get("originalPrice") ? parseFloat(formData.get("originalPrice")) : null,
      location: formData.get("location"),
      condition: formData.get("condition"),
      contactName: formData.get("contactName"),
      contactPhone: formData.get("contactPhone"),
      // Add user data
      userId: formData.get("userId"),
      userEmail: formData.get("userEmail"),
      userName: formData.get("userName"),
    };

    console.log("Form data received:", itemData);

    // Validate required fields
    if (
      !itemData.title ||
      !itemData.description ||
      !itemData.category ||
      !itemData.price ||
      !itemData.location ||
      !itemData.condition ||
      !itemData.contactName ||
      !itemData.contactPhone ||
      !itemData.userId
    ) {
      throw new Error("All required fields must be filled");
    }

    // Handle image uploads to Vercel Blob
    const imageFiles = [];
    let index = 0;

    // Get all image files from FormData
    while (true) {
      const file = formData.get(`image-${index}`);
      if (!file) break;

      // Check if it's a File object and has size
      if (file instanceof File && file.size > 0 && file.name) {
        imageFiles.push(file);
      }
      index++;
    }

    console.log("Image files found:", imageFiles.length, imageFiles);

    const imageUrls = [];

    // Upload each image to Vercel Blob
    for (const imageFile of imageFiles) {
      try {
        console.log("Uploading image:", imageFile.name, imageFile.size, imageFile.type);

        const blob = await put(`items/${Date.now()}-${imageFile.name}`, imageFile, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        console.log("Image uploaded to:", blob.url);
        imageUrls.push(blob.url);
      } catch (error) {
        console.error("Failed to upload image:", error);
        throw new Error("Failed to upload one or more images");
      }
    }

    console.log("All image URLs:", imageUrls);

    // Add image URLs to item data
    itemData.imageUrls = imageUrls;

    // Save to database
    const newItem = await addItem(itemData);
    console.log("Item saved to database:", newItem);

    // Revalidate the cache and redirect
    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/my-items");

    return {
      success: true,
      itemId: newItem.id,
      message: "Item listed successfully!",
    };
  } catch (error) {
    console.error("Error creating item:", error);
    return {
      success: false,
      error: error.message || "Failed to create item listing",
    };
  }
}

// Alternative server action that can be used directly in the form
export async function handleCreateItem(formData) {
  const result = await createItem(formData);

  if (result.success) {
    redirect(`/items/${result.itemId}?success=true`);
  } else {
    redirect(`/sell?error=${encodeURIComponent(result.error)}`);
  }
}

export async function updateItemStatusAction(itemId, status) {
  try {
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

export async function deleteItemAction(itemId) {
  try {
    await deleteItem(itemId);

    revalidatePath("/browse");
    revalidatePath("/");

    return { success: true, message: "Item deleted successfully" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}
