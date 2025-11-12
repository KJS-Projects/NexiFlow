// app/sell/page.js
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FiLogIn,
} from "react-icons/fi";
import { handleCreateItem } from "@/actions/addItemActions";
import { auth } from "@/utils/firebaseBrowser";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function SellPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    if (files.length + imagePreviews.length > 8) {
      setError("Maximum 8 images allowed");
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
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
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (formData) => {
    if (!currentUser) {
      setError("Please sign in to list an item");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Add user data to formData
      formData.append("userId", currentUser.uid);
      formData.append("userEmail", currentUser.email);
      formData.append("userName", currentUser.displayName || currentUser.email);

      // Add image files to formData with unique names
      imagePreviews.forEach((preview, index) => {
        formData.append(`image-${index}`, preview.file);
      });

      console.log("Submitting form with user:", currentUser.uid);

      await handleCreateItem(formData);
    } catch (err) {
      setError(err.message || "Failed to create listing");
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

  // Show login prompt if user is not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiLogIn className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to list items for sale. Please sign in or create an account to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signin"
                className="flex-1 px-6 py-3 border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition duration-300">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-amber-600 transition duration-300 shadow-lg shadow-teal-500/25">
                Sign Up
              </Link>
            </div>
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
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium mb-4 transition duration-300">
            <FiArrowLeft className="text-lg" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Sell Your Item</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill in the details below to list your item. The more information you provide, the faster it will sell.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-teal-600">
              <FiUser className="text-base" />
              <span>
                Listing as: <strong>{currentUser.displayName || currentUser.email}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center space-x-3">
            <FiAlertCircle className="text-red-500 text-xl flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            {["Item Details", "Photos", "Contact Info", "Review"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                    index === 0 ? "bg-teal-500 border-teal-500 text-white" : "border-gray-300 text-gray-400"
                  }`}>
                  {index === 0 ? <FiCheck className="text-lg" /> : index + 1}
                </div>
                <span className={`ml-2 font-medium hidden sm:block ${index === 0 ? "text-teal-600" : "text-gray-500"}`}>{step}</span>
                {index < 3 && <div className={`w-8 sm:w-16 h-0.5 mx-4 ${index === 0 ? "bg-teal-500" : "bg-gray-300"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form action={handleSubmit} className="space-y-6">
          {/* Hidden user data fields */}
          <input type="hidden" name="userId" value={currentUser.uid} />
          <input type="hidden" name="userEmail" value={currentUser.email} />
          <input type="hidden" name="userName" value={currentUser.displayName || currentUser.email} />

          {/* Item Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiTag className="text-teal-600 mr-3" />
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
                <span className="text-sm text-gray-500 group-hover:text-teal-600 text-center px-2">Add Photos</span>
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {/* Image Previews */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="aspect-square relative group">
                  <img src={preview.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-2xl" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition duration-300">
                    ×
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-2xl transition duration-300" />
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center">Upload up to 8 clear photos. First image will be the cover photo.</p>
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
                    defaultValue={currentUser.displayName || ""}
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
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                <FiFileText className="text-amber-600 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important Notes</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Provide accurate and honest descriptions of your item</li>
                  <li>• Upload clear, well-lit photos from multiple angles</li>
                  <li>• Price your item reasonably for faster sale</li>
                  <li>• Be responsive to buyer inquiries</li>
                  <li>• Meet buyers in safe, public locations</li>
                </ul>
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
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <FiCheck className="text-lg" />
                  <span>Publish Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
