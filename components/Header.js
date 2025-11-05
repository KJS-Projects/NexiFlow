// app/components/Header.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get current category from URL or breadcrumb
  const getBreadcrumb = () => {
    if (pathname === "/") return "All Categories";
    if (pathname.includes("/category/")) {
      const category = pathname.split("/").pop();
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
    if (pathname.includes("/search")) return "Search Results";
    return "Browse";
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-white shadow-sm"}`}>
      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-blue-600">NexiFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/browse"
              className={`font-medium transition-colors ${pathname === "/browse" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
              Browse
            </Link>
            <Link
              href="/categories"
              className={`font-medium transition-colors ${
                pathname.includes("/categories") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}>
              Categories
            </Link>
            <Link
              href="/sell"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">
              Sell Now
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition duration-300">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium hidden sm:block">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Breadcrumb and Search Section */}
      <div className="border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Breadcrumb and Filters Toggle */}
            <div className="flex items-center justify-between lg:justify-start space-x-4">
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm">
                <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-blue-600 font-medium">{getBreadcrumb()}</span>
              </div>

              {/* Mobile Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-white transition duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                  />
                </svg>
                <span>Filters</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for items, brands, or categories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  defaultValue={searchParams.get("q") || ""}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-300 text-sm">
                  Search
                </button>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="fashion">Fashion</option>
                <option value="sports">Sports</option>
              </select>

              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Locations</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters (Mobile) */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="fashion">Fashion</option>
                  <option value="sports">Sports</option>
                </select>

                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="">All Locations</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="chennai">Chennai</option>
                </select>

                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 col-span-2">
                  <option value="">Price Range</option>
                  <option value="0-1000">Under ₹1,000</option>
                  <option value="1000-5000">₹1,000 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="10000+">Above ₹10,000</option>
                </select>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition duration-300">
                  Cancel
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
