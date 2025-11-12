// app/items/[id]/edit/page.js
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiUpload,
  FiCamera,
  FiDollarSign,
  FiMapPin,
  FiTag,
  FiFileText,
  FiUser,
  FiPhone,
  FiCheck,
  FiArrowLeft,
  FiAlertCircle,
  FiEdit,
} from "react-icons/fi";
import { auth } from "@/utils/firebaseBrowser";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const fileInputRef = useRef(null);

  // Check if user is authenticated and load item data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user && itemId) {
        await loadItemData(itemId, user.uid);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [itemId]);

  const loadItemData = async (itemId, userId) => {
    try {
      const response = await fetch(`/api/items/${itemId}`);

      if (!response.ok) {
        throw new Error("Failed to load item data");
      }

      const itemData = await response.json();

      // Check if user owns this item
      if (itemData.user_id !== userId) {
        setError("You don't have permission to edit this item");
        setItem(null);
        return;
      }

      setItem(itemData);

      // Set existing images
      if (itemData.image_urls && itemData.image_urls.length > 0) {
        setImagePreviews(
          itemData.image_urls.map((url) => ({
            url,
            isExisting: true,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading item:", error);
      setError("Failed to load item data");
    }
  };

  const categories = [
    "Electronics",
    "Furniture",
    "Fashion",
    "Sports & Fitness",
    "Books & Media",
    "Vehicles",
    "Real Estate",
    "Toys & Games",
    "Home Appliances",
    "Mobile Phones",
    "Laptops & Computers",
    "Other",
  ];

  const conditions = ["Like New", "Excellent", "Good", "Fair", "Needs Repair"];

  const locations = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Surat",
    "Jaipur",
    "Lucknow",
    "Other",
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = imagePreviews.filter((img) => !img.isExisting).length + files.length;

    if (totalImages > 8) {
      setError("Maximum 8 images allowed");
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      const removed = newPreviews[index];

      // Only revoke URL if it's a new image (not existing)
      if (!removed.isExisting) {
        URL.revokeObjectURL(removed.preview);
      }

      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !item) {
      setError("Please sign in to edit this item");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.target);

      // Prepare the data for API
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

      // Handle image uploads
      const newImageFiles = [];
      const existingImages = [];

      // Separate existing and new images
      imagePreviews.forEach((preview) => {
        if (preview.isExisting) {
          existingImages.push(preview.url);
        } else if (preview.file) {
          newImageFiles.push(preview.file);
        }
      });

      // Upload new images to Vercel Blob
      const newImageUrls = [];
      for (const imageFile of newImageFiles) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("image", imageFile);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload image");
          }

          const { url } = await uploadResponse.json();
          newImageUrls.push(url);
        } catch (error) {
          console.error("Failed to upload image:", error);
          throw new Error("Failed to upload one or more images");
        }
      }

      // Combine existing and new images
      itemData.imageUrls = [...existingImages, ...newImageUrls];

      // Update item via API
      const updateResponse = await fetch(`/api/items/${itemId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      const result = await updateResponse.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update item");
      }

      setSuccess("Item updated successfully!");

      // Redirect to item page after a short delay
      setTimeout(() => {
        router.push(`/items/${itemId}?success=updated`);
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-300 rounded-xl mb-6"></div>
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if user doesn't own the item or item not found
  if (error && !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col gap-4">
              <Link
                href="/my-items"
                className="px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition duration-300">
                Back to My Items
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition duration-300">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Item Not Found</h2>
            <p className="text-gray-600 mb-6">The item you're trying to edit doesn't exist.</p>
            <Link
              href="/my-items"
              className="px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition duration-300">
              Back to My Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium transition duration-300">
              <FiArrowLeft className="text-lg" />
              <span>Back</span>
            </button>

            <Link
              href={`/items/${itemId}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-medium transition duration-300">
              <span>View Item</span>
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Edit Your Item</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Update your item details below. Changes will be reflected immediately.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-teal-600">
              <FiUser className="text-base" />
              <span>
                Editing as: <strong>{currentUser.displayName || currentUser.email}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center space-x-3">
            <FiCheck className="text-green-500 text-xl flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center space-x-3">
            <FiAlertCircle className="text-red-500 text-xl flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiEdit className="text-teal-600 mr-3" />
              Item Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={item.title}
                  placeholder="e.g., MacBook Pro 2020 - Excellent Condition"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  defaultValue={item.description}
                  placeholder="Describe your item in detail. Include features, specifications, and any flaws..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  required
                  defaultValue={item.category}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300">
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition *</label>
                <select
                  name="condition"
                  required
                  defaultValue={item.condition}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300">
                  <option value="">Select Condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price (₹) *</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    defaultValue={item.price}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
                  />
                </div>
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price (₹)</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="number"
                    name="originalPrice"
                    min="0"
                    step="0.01"
                    defaultValue={item.original_price || ""}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <select
                    name="location"
                    required
                    defaultValue={item.location}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300">
                    <option value="">Select Your City</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Photos Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiCamera className="text-teal-600 mr-3" />
              Photos
              <span className="text-sm font-normal text-gray-500 ml-2">({imagePreviews.length}/8)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {/* Image Upload Box */}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition duration-300 group">
                <FiUpload className="text-3xl text-gray-400 group-hover:text-teal-500 mb-2" />
                <span className="text-sm text-gray-500 group-hover:text-teal-600 text-center px-2">Add More Photos</span>
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {/* Image Previews */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="aspect-square relative group">
                  <img
                    src={preview.isExisting ? preview.url : preview.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition duration-300">
                    ×
                  </button>
                  {preview.isExisting && (
                    <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">Existing</div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-2xl transition duration-300" />
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center">You can add new photos or remove existing ones. Maximum 8 photos total.</p>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiUser className="text-teal-600 mr-3" />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="contactName"
                    required
                    defaultValue={item.contact_name}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="tel"
                    name="contactPhone"
                    required
                    defaultValue={item.contact_phone}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition duration-300">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FiCheck className="text-lg" />
                  <span>Update Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
