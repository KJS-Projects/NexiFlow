// app/browse/FilterForm.js
"use client";

import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiTag, FiDollarSign } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function FilterForm({ categories = [], locations = [], initialValues = {} }) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialValues);

  // Update filters when initialValues change
  useEffect(() => {
    setFilters(initialValues);
  }, [initialValues]);

  const handleInputChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(newFilters);

    // Debounced URL update
    const timeoutId = setTimeout(() => {
      updateURL(newFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const updateURL = (filterValues) => {
    const params = new URLSearchParams();

    // Add non-empty filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      }
    });

    // Always include page=1 when filters change
    params.set("page", "1");

    router.push(`/browse?${params.toString()}`);
  };

  const handleClearAll = () => {
    router.push("/browse");
  };

  return (
    <form className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            placeholder="What are you looking for?"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <div className="relative">
          <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filters.category || ""}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white">
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filters.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white">
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) => handleInputChange("minPrice", e.target.value)}
              placeholder="Min"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              placeholder="Max"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Clear All Button */}
      <button
        type="button"
        onClick={handleClearAll}
        className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition duration-200">
        Clear All Filters
      </button>
    </form>
  );
}
