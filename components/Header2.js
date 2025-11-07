// app/components/Header2.js
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiHeart, FiUser, FiPlusCircle, FiMapPin, FiFilter, FiChevronRight, FiX, FiSearch } from "react-icons/fi";

export default function Header2() {
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    location: "",
    price: "",
  });
  const pathname = usePathname();
  const router = useRouter();

  const categories = ["Electronics", "Furniture", "Fashion", "Sports", "Books", "Vehicles", "Real Estate", "Toys", "Mobile", "Laptop"];

  const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"];

  // Function to build browse URL with filters
  const buildBrowseUrl = (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.set(key, value);
      }
    });

    return `/browse?${params.toString()}`;
  };

  const handleFilterClick = (type, value) => {
    const newFilters = {
      ...activeFilters,
      [type]: activeFilters[type] === value ? "" : value,
    };

    setActiveFilters(newFilters);

    // Navigate to browse page with the selected filter
    if (newFilters[type] === value) {
      // Only navigate if we're setting the filter (not clearing it)
      router.push(buildBrowseUrl(newFilters));
    } else {
      // If clearing the filter, navigate with remaining filters
      const remainingFilters = { ...newFilters };
      remainingFilters[type] = "";
      router.push(buildBrowseUrl(remainingFilters));
    }
  };

  const clearFilters = () => {
    setActiveFilters({ category: "", location: "", price: "" });
    router.push("/browse");
  };

  const removeFilter = (type) => {
    const newFilters = { ...activeFilters, [type]: "" };
    setActiveFilters(newFilters);
    router.push(buildBrowseUrl(newFilters));
  };

  // Make filter buttons actual links for better SEO and accessibility
  const FilterButton = ({ type, value, children, isActive, onClick }) => (
    <Link
      href={buildBrowseUrl({ ...activeFilters, [type]: isActive ? "" : value })}
      onClick={(e) => {
        e.preventDefault();
        onClick(type, value);
      }}
      className={`px-3 py-1 rounded-full border transition-all duration-300 text-xs font-medium whitespace-nowrap ${
        isActive
          ? type === "category"
            ? "bg-teal-500 text-white border-teal-500 shadow-sm"
            : "bg-amber-500 text-white border-amber-500 shadow-sm"
          : "bg-white text-gray-700 border-gray-300 hover:border-teal-300 hover:text-teal-600"
      }`}>
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Main Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-amber-500 rounded-xl flex items-center justify-center">
                <FiHome className="text-white text-lg" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800">NexiFlow</span>
                <span className="block text-xs text-teal-600 font-medium -mt-1">Second Hand</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/browse"
                className="flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-teal-50 hover:text-teal-600 text-gray-600">
                <FiSearch className="text-lg" />
                <span>Browse</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-teal-50 hover:text-teal-600 text-gray-600">
                <span>Categories</span>
              </Link>
              <Link
                href="/items/new"
                className="flex items-center space-x-1 ml-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-teal-500/25">
                <FiPlusCircle className="text-lg" />
                <span>Sell Item</span>
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition duration-300">
                <FiHeart className="text-xl" />
              </button>
              <div className="hidden sm:flex items-center space-x-3">
                <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-teal-600 font-medium transition duration-300">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-300 font-medium shadow-lg">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filter Breadcrumb Section */}
      <div className="bg-gradient-to-r from-teal-50 to-amber-50/30 border-b border-teal-100/50">
        <div className="container mx-auto px-4 py-2">
          {/* Breadcrumb and Active Filters */}
          <div className="flex items-center justify-between mb-2">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 transition-colors">
                <FiHome className="text-base" />
                <span>Home</span>
              </Link>
              <FiChevronRight className="text-gray-400 text-xs" />
              <span className="text-gray-800 font-medium">All Items</span>
            </div>

            {/* Active Filters */}
            {(activeFilters.category || activeFilters.location || activeFilters.price) && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {activeFilters.category && (
                    <span className="flex items-center space-x-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                      {activeFilters.category}
                      <button onClick={() => removeFilter("category")} className="hover:text-teal-900 transition duration-300">
                        <FiX className="text-xs" />
                      </button>
                    </span>
                  )}
                  {activeFilters.location && (
                    <span className="flex items-center space-x-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      {activeFilters.location}
                      <button onClick={() => removeFilter("location")} className="hover:text-amber-900 transition duration-300">
                        <FiX className="text-xs" />
                      </button>
                    </span>
                  )}
                  {activeFilters.price && (
                    <span className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {activeFilters.price}
                      <button onClick={() => removeFilter("price")} className="hover:text-gray-900 transition duration-300">
                        <FiX className="text-xs" />
                      </button>
                    </span>
                  )}
                </div>
                <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700 font-medium transition duration-300">
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Horizontal Filter Row with Scrolling */}
          <div className="flex space-x-4 pb-1 overflow-x-auto scrollbar-hide">
            {/* Categories Section */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1 text-xs font-semibold text-gray-700 whitespace-nowrap">
                <FiFilter className="text-teal-600" />
                <span>Categories:</span>
              </div>
              <div className="flex space-x-1">
                {categories.map((category, index) => (
                  <FilterButton
                    key={index}
                    type="category"
                    value={category}
                    isActive={activeFilters.category === category}
                    onClick={handleFilterClick}>
                    {category}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Locations Section */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1 text-xs font-semibold text-gray-700 whitespace-nowrap">
                <FiMapPin className="text-amber-600" />
                <span>Locations:</span>
              </div>
              <div className="flex space-x-1">
                {locations.map((location, index) => (
                  <FilterButton
                    key={index}
                    type="location"
                    value={location}
                    isActive={activeFilters.location === location}
                    onClick={handleFilterClick}>
                    {location}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
