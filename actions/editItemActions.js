// app/actions/items.js (add these functions)
export async function updateItem(itemId, formData) {
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
    };

    console.log("Update form data received:", itemData);

    // Validate required fields
    if (
      !itemData.title ||
      !itemData.description ||
      !itemData.category ||
      !itemData.price ||
      !itemData.location ||
      !itemData.condition ||
      !itemData.contactName ||
      !itemData.contactPhone
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

    console.log("New image files found:", imageFiles.length);

    const newImageUrls = [];

    // Upload each new image to Vercel Blob
    for (const imageFile of imageFiles) {
      try {
        console.log("Uploading new image:", imageFile.name);

        const blob = await put(`items/${Date.now()}-${imageFile.name}`, imageFile, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        console.log("New image uploaded to:", blob.url);
        newImageUrls.push(blob.url);
      } catch (error) {
        console.error("Failed to upload image:", error);
        throw new Error("Failed to upload one or more images");
      }
    }

    // Get existing images that are kept
    const existingImages = [];
    let existingIndex = 0;
    while (true) {
      const existingImage = formData.get(`existing-image-${existingIndex}`);
      if (!existingImage) break;
      existingImages.push(existingImage);
      existingIndex++;
    }

    console.log("Existing images kept:", existingImages);
    console.log("New images uploaded:", newImageUrls);

    // Combine existing and new images
    const allImageUrls = [...existingImages, ...newImageUrls];
    itemData.imageUrls = allImageUrls;

    // Update in database
    const updatedItem = await updateItemInDatabase(itemId, itemData);
    console.log("Item updated in database:", updatedItem);

    // Revalidate the cache
    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/my-items");
    revalidatePath(`/items/${itemId}`);

    return {
      success: true,
      itemId: updatedItem.id,
      message: "Item updated successfully!",
    };
  } catch (error) {
    console.error("Error updating item:", error);
    return {
      success: false,
      error: error.message || "Failed to update item listing",
    };
  }
}

export async function handleUpdateItem(itemId, formData) {
  const result = await updateItem(itemId, formData);

  if (result.success) {
    redirect(`/items/${itemId}?success=updated`);
  } else {
    redirect(`/items/${itemId}/edit?error=${encodeURIComponent(result.error)}`);
  }
}
