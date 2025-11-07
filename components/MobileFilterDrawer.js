// app/components/MobileFilterDrawer.js
"use client";

import { useState, useEffect } from "react";
import { FiX, FiFilter, FiSearch, FiMapPin, FiTag, FiDollarSign } from "react-icons/fi";

export function MobileFilterDrawer({ categories = [], locations = [], initialValues = {}, isOpen, onClose, onApplyFilters }) {
  const [filters, setFilters] = useState(initialValues);

  // Update filters when initialValues change
  useEffect(() => {
    setFilters(initialValues);
  }, [initialValues]);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters = {
      search: "",
      category: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      view: "grid",
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FiFilter className="text-teal-600 mr-2" />
            Filters
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition duration-200">
            <FiX className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
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

          {/* Action Buttons - Sticky at bottom */}
          <div className="flex space-x-3 pt-4 pb-2 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition duration-200">
              Clear All
            </button>
            <button
              type="submit"
              className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition duration-200">
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
