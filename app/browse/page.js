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

  const { category, location, minPrice, maxPrice, search, view = "grid" } = await searchParams;

  // Get paginated items
  const { items, pagination } = await getPaginatedItems({
    page,
    limit,
    category,
    location,
    minPrice,
    maxPrice,
    search,
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse All Items</h1>
          <p className="text-lg text-gray-600">Discover amazing second-hand deals from sellers near you</p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
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
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-gray-800">
                      {(page - 1) * limit + 1}-{Math.min(page * limit, pagination.totalCount)}
                    </span>{" "}
                    of <span className="font-semibold text-gray-800">{pagination.totalCount}</span> items
                    {search && ` for "${search}"`}
                    {category && ` in ${category}`}
                    {location && ` from ${location}`}
                  </p>
                </div>

                {/* View Toggle */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <Link
                      href={buildPageUrl(1).replace(`page=${page}`, "view=grid")}
                      className={`p-2 rounded-lg transition duration-300 ${
                        view === "grid" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}>
                      <FiGrid className="text-lg" />
                    </Link>
                    <Link
                      href={buildPageUrl(1).replace(`page=${page}`, "view=list")}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                      ))}
                    </div>
                  }>
                  <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-6 mb-8"}>
                    {items.map((item) => (
                      <ItemCard key={item.id} item={item} view={view} />
                    ))}
                  </div>
                </Suspense>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      {/* Previous Button */}
                      <div>
                        {pagination.hasPrevPage ? (
                          <Link
                            href={buildPageUrl(page - 1)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300">
                            <FiChevronLeft className="text-lg" />
                            <span>Previous</span>
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed">
                            <FiChevronLeft className="text-lg" />
                            <span>Previous</span>
                          </button>
                        )}
                      </div>

                      {/* Page Numbers */}
                      <div className="hidden sm:flex items-center space-x-1">
                        {generatePageNumbers().map((pageNum) => (
                          <Link
                            key={pageNum}
                            href={buildPageUrl(pageNum)}
                            className={`min-w-10 h-10 flex items-center justify-center rounded-lg transition duration-300 ${
                              pageNum === page ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25" : "text-gray-600 hover:bg-gray-100"
                            }`}>
                            {pageNum}
                          </Link>
                        ))}

                        {/* Ellipsis for many pages */}
                        {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}

                        {/* Last page */}
                        {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 1 && (
                          <Link
                            href={buildPageUrl(pagination.totalPages)}
                            className={`min-w-10 h-10 flex items-center justify-center rounded-lg transition duration-300 ${
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
                        Page {page} of {pagination.totalPages}
                      </div>

                      {/* Next Button */}
                      <div>
                        {pagination.hasNextPage ? (
                          <Link
                            href={buildPageUrl(page + 1)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300">
                            <span>Next</span>
                            <FiChevronRight className="text-lg" />
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed">
                            <span>Next</span>
                            <FiChevronRight className="text-lg" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms to find what you're looking for.</p>
                <Link
                  href="/browse"
                  className="inline-flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition duration-300 font-semibold">
                  <FiSliders className="text-lg" />
                  <span>Clear All Filters</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Item Card Component (same as before)
function ItemCard({ item, view }) {
  const discountPercentage =
    item.original_price && item.price < item.original_price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : 0;

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

  // Grid View (default)
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {item.image_urls && item.image_urls.length > 0 ? (
          <img
            src={item.image_urls[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-100 to-amber-100 flex items-center justify-center">
            <FiTag className="text-teal-400 text-3xl" />
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-teal-500 text-white px-2 py-1 rounded-full text-sm font-medium">{item.category}</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-teal-600 transition duration-300">
          {item.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
            {item.original_price && item.original_price > item.price && (
              <p className="text-sm text-gray-500 line-through">₹{item.original_price.toLocaleString()}</p>
            )}
          </div>
          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-sm font-medium">{item.condition}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <FiMapPin className="text-amber-500" />
            <span>{item.location}</span>
          </div>
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
        </div>

        <Link
          href={`/items/${item.id}`}
          className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition duration-300 block text-center">
          View Details
        </Link>
      </div>
    </div>
  );
}
