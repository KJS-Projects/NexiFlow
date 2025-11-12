// app/components/Header2.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiHeart,
  FiUser,
  FiPlusCircle,
  FiMapPin,
  FiFilter,
  FiChevronRight,
  FiX,
  FiSearch,
  FiLogOut,
  FiSettings,
  FiShoppingBag,
  FiMessageSquare,
  FiMenu,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { auth } from "@/utils/firebaseBrowser";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header2() {
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    location: "",
    price: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const categories = ["Electronics", "Furniture", "Fashion", "Sports", "Books", "Vehicles", "Real Estate", "Toys", "Mobile", "Laptop"];
  const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"];

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
      setShowMobileMenu(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

    if (newFilters[type] === value) {
      router.push(buildBrowseUrl(newFilters));
    } else {
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

  // User menu dropdown component
  const UserMenu = () => (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-800 truncate">{user?.displayName || "User"}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>

      <Link
        href="/profile"
        onClick={() => setShowUserMenu(false)}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-200">
        <FiUser className="text-base" />
        <span>My Profile</span>
      </Link>

      <Link
        href="/my-items"
        onClick={() => setShowUserMenu(false)}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-200">
        <FiShoppingBag className="text-base" />
        <span>My Items</span>
      </Link>

      <Link
        href="/chats"
        onClick={() => setShowUserMenu(false)}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-200">
        <FiMessageSquare className="text-base" />
        <span>My Chats</span>
      </Link>

      <Link
        href="/favorites"
        onClick={() => setShowUserMenu(false)}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition duration-200">
        <FiHeart className="text-base" />
        <span>Favorites</span>
      </Link>

      <div className="border-t border-gray-100 mt-1 pt-1">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200">
          <FiLogOut className="text-base" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  // Mobile Menu Component
  const MobileMenu = () => (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      {/* Mobile Menu Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2" onClick={() => setShowMobileMenu(false)}>
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-amber-500 rounded-xl flex items-center justify-center">
            <FiHome className="text-white text-lg" />
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-800">MyStore</span>
            <span className="block text-xs text-teal-600 font-medium -mt-1">Second Hand new</span>
          </div>
        </Link>

        <button onClick={() => setShowMobileMenu(false)} className="p-2 text-gray-600 hover:text-gray-800 transition duration-300">
          <FiX className="text-2xl" />
        </button>
      </div>

      {/* Mobile Navigation Links */}
      <div className="p-4 space-y-4">
        {/* Main Navigation */}
        <div className="space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition duration-300"
            onClick={() => setShowMobileMenu(false)}>
            <FiHome className="text-xl" />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            href="/browse"
            className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition duration-300"
            onClick={() => setShowMobileMenu(false)}>
            <FiSearch className="text-xl" />
            <span className="font-medium">Browse Items</span>
          </Link>

          <Link
            href="/categories"
            className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition duration-300"
            onClick={() => setShowMobileMenu(false)}>
            <FiGrid className="text-xl" />
            <span className="font-medium">Categories</span>
          </Link>

          <Link
            href={user ? "/items/new" : "/auth/signin"}
            className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition duration-300"
            onClick={() => setShowMobileMenu(false)}>
            <FiPlusCircle className="text-xl" />
            <span className="font-medium">Sell Item</span>
          </Link>
        </div>

        {/* User Section */}
        {user ? (
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-800">{user?.displayName || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <Link
              href="/profile"
              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition duration-300"
              onClick={() => setShowMobileMenu(false)}>
              <FiUser className="text-xl" />
              <span className="font-medium">My Profile</span>
            </Link>

            <Link
              href="/my-items"
              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition duration-300"
              onClick={() => setShowMobileMenu(false)}>
              <FiShoppingBag className="text-xl" />
              <span className="font-medium">My Items</span>
            </Link>

            <Link
              href="/chats"
              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition duration-300"
              onClick={() => setShowMobileMenu(false)}>
              <FiMessageSquare className="text-xl" />
              <span className="font-medium">My Chats</span>
            </Link>

            <Link
              href="/favorites"
              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition duration-300"
              onClick={() => setShowMobileMenu(false)}>
              <FiHeart className="text-xl" />
              <span className="font-medium">Favorites</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-300">
              <FiLogOut className="text-xl" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <Link
              href="/auth/signin"
              className="flex items-center justify-center space-x-2 w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition duration-300 border border-gray-300"
              onClick={() => setShowMobileMenu(false)}>
              <FiUser className="text-xl" />
              <span className="font-medium">Login</span>
            </Link>

            <Link
              href="/auth/signup"
              className="flex items-center justify-center space-x-2 w-full p-3 bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-lg hover:from-teal-600 hover:to-amber-600 transition duration-300 font-medium"
              onClick={() => setShowMobileMenu(false)}>
              <FiUser className="text-xl" />
              <span className="font-medium">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  // Show loading state briefly
  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
              <div>
                <div className="h-6 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header onMouseLeave={() => setShowUserMenu(false)} className="sticky top-0 z-50 bg-white shadow-lg">
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
                <span className="text-2xl font-bold text-gray-800">MyStore</span>
                <span className="block text-xs text-teal-600 font-medium -mt-1">Second Hand new</span>
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
                href={user ? "/items/new" : "/auth/signin"}
                className="flex items-center space-x-1 ml-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-amber-600 transition-all duration-300 shadow-lg shadow-teal-500/25">
                <FiPlusCircle className="text-lg" />
                <span>Sell Item</span>
              </Link>
            </nav>

            {/* Right Section - Auth Buttons / User Menu */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="md:hidden p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition duration-300">
                <FiMenu className="text-xl" />
              </button>

              {/* Desktop: Favorites */}
              <Link href={user ? "/favorites" : "/auth/signin"} className="hidden md:block">
                <button className="p-2 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition duration-300">
                  <FiHeart className="text-xl" />
                </button>
              </Link>

              {user ? (
                // User is logged in - Show user menu (desktop)
                <div className="hidden md:block relative">
                  <button
                    onMouseEnter={() => setShowUserMenu(true)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-teal-50 transition duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                      {user?.displayName || "User"}
                    </span>
                  </button>

                  {showUserMenu && <UserMenu />}
                </div>
              ) : (
                // User is not logged in - Show login/signup buttons (desktop)
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/auth/signin" className="px-4 py-2 text-gray-600 hover:text-teal-600 font-medium transition duration-300">
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-lg hover:from-teal-600 hover:to-amber-600 transition duration-300 font-medium shadow-lg shadow-teal-500/25">
                    Sign Up
                  </Link>
                </div>
              )}
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
              <div className="hidden sm:flex items-center space-x-2">
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

      {/* Mobile Menu */}
      {showMobileMenu && <MobileMenu />}

      {/* Backdrop for user menu (mobile) */}
      {showUserMenu && <div className="fixed inset-0 z-40 bg-black bg-opacity-10 md:hidden" onClick={() => setShowUserMenu(false)} />}
    </header>
  );
}
