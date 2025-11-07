// app/browse/FilterForm.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiMapPin, FiTag, FiDollarSign } from "react-icons/fi";

export default function FilterForm({ categories, locations, initialValues }) {
  const router = useRouter();
  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build URL parameters, excluding empty values
    const params = new URLSearchParams();

    Object.entries(formValues).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.append(key, value);
      }
    });

    // Navigate to the filtered URL
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Search Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
          <FiSearch className="text-gray-400 mr-2" />
          Search
        </h3>
        <input
          type="text"
          name="search"
          value={formValues.search}
          onChange={handleInputChange}
          placeholder="Search items..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-amber-600 transition duration-300 shadow-lg shadow-teal-500/25">
        Apply Filters
      </button>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
          <FiTag className="text-gray-400 mr-2" />
          Category
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="category"
              value=""
              checked={!formValues.category}
              onChange={handleInputChange}
              className="text-teal-500 focus:ring-teal-500"
            />
            <span className="text-gray-600 group-hover:text-gray-800 transition-colors">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={formValues.category === cat}
                onChange={handleInputChange}
                className="text-teal-500 focus:ring-teal-500"
              />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
          <FiMapPin className="text-gray-400 mr-2" />
          Location
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="location"
              value=""
              checked={!formValues.location}
              onChange={handleInputChange}
              className="text-teal-500 focus:ring-teal-500"
            />
            <span className="text-gray-600 group-hover:text-gray-800 transition-colors">All Locations</span>
          </label>
          {locations.map((loc) => (
            <label key={loc} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="location"
                value={loc}
                checked={formValues.location === loc}
                onChange={handleInputChange}
                className="text-teal-500 focus:ring-teal-500"
              />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{loc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
          <FiDollarSign className="text-gray-400 mr-2" />
          Price Range
        </h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="number"
              name="minPrice"
              value={formValues.minPrice}
              onChange={handleInputChange}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <input
              type="number"
              name="maxPrice"
              value={formValues.maxPrice}
              onChange={handleInputChange}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Hidden view field */}
      <input type="hidden" name="view" value={formValues.view} />

      {/* Apply Filters Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-amber-600 transition duration-300 shadow-lg shadow-teal-500/25">
        Apply Filters
      </button>
    </form>
  );
}
