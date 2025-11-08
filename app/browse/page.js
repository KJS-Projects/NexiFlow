// app/browse/page.js
import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { getPaginatedItems, getAllItems } from "@/lib/queries/items";
import {
  FiSearch,
  FiFilter,
  FiMapPin,
  FiTag,
  FiDollarSign,
  FiGrid,
  FiList,
  FiSliders,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";

// Client component for the filter form
import FilterForm from "./FilterForm";

export default async function BrowsePage({ searchParams }) {
  // Unwrap the Promise first
  const params = await searchParams;

  const pageParam = params.page;
  const page = parseInt(pageParam) || 1;
  const limit = 12;

  const { category, location, minPrice, maxPrice, search, view = "grid", seller } = await searchParams;

  // Get paginated items
  const { items, pagination } = await getPaginatedItems({
    page,
    limit,
    category,
    location,
    minPrice,
    maxPrice,
    search,
    seller,
  });

  // Get all items for filter options (without pagination)
  const allItems = await getAllItems();
  const categories = [...new Set(allItems.map((item) => item.category))].sort();
  const locations = [...new Set(allItems.map((item) => item.location))].sort();

  // Helper function to build pagination URL
  function buildPageUrl(newPage) {
    const params = new URLSearchParams();

    // Add all current filters
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (view) params.set("view", view);
    if (seller) params.set("seller", seller);

    // Set the new page
    params.set("page", newPage.toString());

    return `/browse?${params.toString()}`;
  }

  // Generate page numbers for pagination
  function generatePageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;
    const { currentPage, totalPages } = pagination;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're at the beginning
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Mobile Filter Bar - Sticky at top */}
        <div className="lg:hidden hidden bg-white rounded-xl shadow-sm p-3 mb-4 sticky top-16 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{pagination.totalCount} items</span>
              <span>•</span>
              <span>Page {page}</span>
            </div>
            <Link href="#filters" className="flex items-center space-x-1 bg-teal-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
              <FiFilter className="text-sm" />
              <span>Filters</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Sidebar Filters - Hidden on mobile, shown in modal/drawer */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FiFilter className="text-teal-600 mr-2" />
                  Filters
                </h2>
                <Link href="/browse" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Clear All
                </Link>
              </div>

              {/* Use the client-side filter form */}
              <FilterForm
                categories={categories}
                locations={locations}
                initialValues={{
                  search: search || "",
                  category: category || "",
                  location: location || "",
                  minPrice: minPrice || "",
                  maxPrice: maxPrice || "",
                  view: view || "grid",
                }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header - Simplified on mobile */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm lg:shadow-lg p-4 lg:p-6 mb-4 lg:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-3 sm:mb-0">
                  <p className="text-sm lg:text-base text-gray-600">
                    <span className="font-semibold text-gray-800">
                      {(page - 1) * limit + 1}-{Math.min(page * limit, pagination.totalCount)}
                    </span>{" "}
                    of <span className="font-semibold text-gray-800">{pagination.totalCount}</span>
                    {search && ` for "${search}"`}
                  </p>
                  {(category || location) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {category && `Category: ${category}`}
                      {category && location && " • "}
                      {location && `Location: ${location}`}
                    </p>
                  )}
                </div>

                {/* View Toggle - Hidden on mobile since we're forcing grid */}
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <Link
                      href={buildPageUrl(1).replace(`view=${view}`, "view=grid")}
                      className={`p-2 rounded-lg transition duration-300 ${
                        view === "grid" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}>
                      <FiGrid className="text-lg" />
                    </Link>
                    <Link
                      href={buildPageUrl(1).replace(`view=${view}`, "view=list")}
                      className={`p-2 rounded-lg transition duration-300 ${
                        view === "list" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}>
                      <FiList className="text-lg" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Grid/List */}
            {items.length > 0 ? (
              <>
                <Suspense
                  fallback={
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                      {[...Array(6)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                      ))}
                    </div>
                  }>
                  {/* Force grid view on mobile, respect user choice on desktop */}
                  <div
                    className={
                      view === "list"
                        ? "hidden lg:block space-y-6 mb-8"
                        : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8"
                    }>
                    {items.map((item) => (
                      <ItemCard key={item.id} item={item} view={view} />
                    ))}
                  </div>
                </Suspense>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm lg:shadow-lg p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      {/* Previous Button */}
                      <div>
                        {pagination.hasPrevPage ? (
                          <Link
                            href={buildPageUrl(page - 1)}
                            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300 text-sm">
                            <FiChevronLeft className="text-base" />
                            <span className="hidden sm:inline">Previous</span>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed text-sm">
                            <FiChevronLeft className="text-base" />
                            <span className="hidden sm:inline">Previous</span>
                          </button>
                        )}
                      </div>

                      {/* Page Numbers */}
                      <div className="hidden sm:flex items-center space-x-1">
                        {generatePageNumbers().map((pageNum) => (
                          <Link
                            key={pageNum}
                            href={buildPageUrl(pageNum)}
                            className={`min-w-8 h-8 lg:min-w-10 lg:h-10 flex items-center justify-center rounded-lg transition duration-300 text-sm ${
                              pageNum === page ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25" : "text-gray-600 hover:bg-gray-100"
                            }`}>
                            {pageNum}
                          </Link>
                        ))}

                        {/* Ellipsis for many pages */}
                        {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}

                        {/* Last page */}
                        {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 1 && (
                          <Link
                            href={buildPageUrl(pagination.totalPages)}
                            className={`min-w-8 h-8 lg:min-w-10 lg:h-10 flex items-center justify-center rounded-lg transition duration-300 text-sm ${
                              pagination.totalPages === page
                                ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}>
                            {pagination.totalPages}
                          </Link>
                        )}
                      </div>

                      {/* Mobile Page Info */}
                      <div className="sm:hidden text-sm text-gray-600">
                        {page} / {pagination.totalPages}
                      </div>

                      {/* Next Button */}
                      <div>
                        {pagination.hasNextPage ? (
                          <Link
                            href={buildPageUrl(page + 1)}
                            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300 text-sm">
                            <span className="hidden sm:inline">Next</span>
                            <FiChevronRight className="text-base" />
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed text-sm">
                            <span className="hidden sm:inline">Next</span>
                            <FiChevronRight className="text-base" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm lg:shadow-lg p-8 lg:p-12 text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="text-gray-400 text-xl lg:text-2xl" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base">Try adjusting your filters or search terms.</p>
                <Link
                  href="/browse"
                  className="inline-flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl hover:bg-teal-600 transition duration-300 font-semibold text-sm lg:text-base">
                  <FiSliders className="text-base" />
                  <span>Clear Filters</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Updated Item Card Component for Mobile Optimization
function ItemCard({ item, view }) {
  const discountPercentage =
    item.original_price && item.price < item.original_price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : 0;

  // List View (Desktop only)
  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-48 sm:h-48 h-40 bg-gray-200 flex-shrink-0">
            {item.image_urls && item.image_urls.length > 0 ? (
              <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-100 to-amber-100 flex items-center justify-center">
                <FiTag className="text-teal-400 text-2xl" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">{item.category}</span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">{item.condition}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <FiMapPin className="text-amber-500" />
                    <span>{item.location}</span>
                  </div>
                  <span>•</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                  {item.original_price && item.original_price > item.price && (
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-gray-500 line-through">₹{item.original_price.toLocaleString()}</p>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">{discountPercentage}% OFF</span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/items/${item.id}`}
                  className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition duration-300">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Mobile Optimized)
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden group">
      {/* Image - Smaller on mobile */}
      <div className="relative h-32 sm:h-36 lg:h-48 bg-gray-200 overflow-hidden">
        {item.image_urls && item.image_urls.length > 0 ? (
          <img
            src={item.image_urls[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-100 to-amber-100 flex items-center justify-center">
            <FiTag className="text-teal-400 text-xl lg:text-3xl" />
          </div>
        )}

        {/* Discount Badge - Smaller on mobile */}
        {discountPercentage > 0 && (
          <div className="absolute top-1 left-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold lg:top-2 lg:left-2 lg:px-2 lg:py-1 lg:text-sm">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Category Badge - Smaller on mobile */}
        <div className="absolute top-1 right-1 bg-teal-500 text-white px-1 py-0.5 rounded text-xs font-medium lg:top-2 lg:right-2 lg:px-2 lg:py-1 lg:text-sm">
          {item.category}
        </div>
      </div>

      {/* Content - Compact on mobile */}
      <div className="p-2 lg:p-4">
        {/* Title - Smaller font on mobile */}
        <h3 className="font-semibold text-sm lg:text-lg text-gray-800 mb-1 lg:mb-2 line-clamp-2 group-hover:text-teal-600 transition duration-300 leading-tight">
          {item.title}
        </h3>

        {/* Description - Hidden on mobile, shown on desktop */}
        <p className="text-gray-600 text-xs lg:text-sm mb-2 lg:mb-3 line-clamp-2 hidden sm:block">{item.description}</p>

        <div className="flex items-center justify-between mb-2 lg:mb-3">
          <div>
            {/* Price - Smaller on mobile */}
            <p className="text-lg lg:text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
            {item.original_price && item.original_price > item.price && (
              <p className="text-xs lg:text-sm text-gray-500 line-through hidden sm:block">₹{item.original_price.toLocaleString()}</p>
            )}
          </div>
          {/* Condition badge - Smaller on mobile */}
          <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-xs font-medium lg:px-2 lg:py-1 lg:text-sm">
            {item.condition}
          </span>
        </div>

        {/* Location and Date - Smaller on mobile */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 lg:mb-4">
          <div className="flex items-center space-x-1">
            <FiMapPin className="text-amber-500 text-xs lg:text-sm" />
            <span className="truncate max-w-[80px] lg:max-w-none">{item.location}</span>
          </div>
          <span className="text-xs">{new Date(item.created_at).toLocaleDateString()}</span>
        </div>

        {/* Button - Smaller on mobile */}
        <Link
          href={`/items/${item.id}`}
          className="w-full bg-gray-800 text-white py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold hover:bg-teal-700 transition duration-300 block text-center text-sm lg:text-base">
          View Details
        </Link>
      </div>
    </div>
  );
}
