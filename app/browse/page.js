// app/browse/page.js
import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { getPaginatedItems, getAllItems, getItemsByCategoryWithLimit } from "@/lib/queries/items";
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
  FiChevronDown,
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

  // Get all items for filter options (without pagination)
  const allItems = await getAllItems();
  const categories = [...new Set(allItems.map((item) => item.category))].sort();
  const locations = [...new Set(allItems.map((item) => item.location))].sort();

  // Check if category filter is applied
  const hasCategoryFilter = !!category || !!search || !!location || !!minPrice || !!maxPrice || !!seller;

  // If category filter is applied, use paginated items
  let items = [];
  let pagination = null;
  let itemsByCategory = {};

  if (hasCategoryFilter) {
    // Category page: use pagination
    const result = await getPaginatedItems({
      page,
      limit,
      category,
      location,
      minPrice,
      maxPrice,
      search,
      seller,
    });
    items = result.items;
    pagination = result.pagination;
  } else {
    // Main page: get max 7 items per category
    // Group items by category with max 7 per category
    categories.forEach((cat) => {
      const categoryItems = allItems.filter((item) => item.category === cat).slice(0, 7);
      if (categoryItems.length > 0) {
        itemsByCategory[cat] = categoryItems;
      }
    });
  }

  // Helper function to build pagination URL (for category pages only)
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

  // Generate page numbers for pagination (category pages only)
  function generatePageNumbers() {
    if (!pagination) return [];

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

  // Calculate total items count for main page
  const mainPageTotalItems = Object.values(itemsByCategory).reduce((total, categoryItems) => total + categoryItems.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-6">
        {/* Mobile Filter Bar - Enhanced */}
        {/* <div className="lg:hidden bg-white rounded-xl shadow-sm p-3 mb-3 sticky top-16 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="font-medium">{hasCategoryFilter ? pagination?.totalCount || 0 : mainPageTotalItems} items</span>
              {hasCategoryFilter && (
                <>
                  <span>•</span>
                  <span>Page {page}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="#filters"
                className="flex items-center space-x-1 bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                <FiFilter className="text-xs" />
                <span>Filters</span>
              </Link>
              {hasCategoryFilter && (
                <Link
                  href={`?${new URLSearchParams({ ...params, view: view === "grid" ? "list" : "grid" })}`}
                  className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                  {view === "grid" ? <FiList className="text-xs" /> : <FiGrid className="text-xs" />}
                </Link>
              )}
            </div>
          </div>
        </div> */}

        {/* Quick Category Filter - Mobile Only */}
        {categories.length > 0 && (
          <div className="lg:hidden">
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Sidebar Filters - Hidden on mobile */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FiFilter className="text-teal-600 mr-2" />
                  Filters
                </h2>
                <Link href="/browse" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Clear All
                </Link>
              </div>
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
            {/* Results Header - Compact on mobile */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm lg:shadow-lg p-3 lg:p-6 mb-3 lg:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs lg:text-base text-gray-600">
                    {hasCategoryFilter ? (
                      <>
                        Showing{" "}
                        <span className="font-semibold text-gray-800">
                          {(page - 1) * limit + 1}-{Math.min(page * limit, pagination?.totalCount || 0)}
                        </span>{" "}
                        of <span className="font-semibold text-gray-800">{pagination?.totalCount || 0}</span>
                        {search && ` for "${search}"`}
                      </>
                    ) : (
                      <>
                        Showing <span className="font-semibold text-gray-800">{mainPageTotalItems}</span> items across{" "}
                        <span className="font-semibold text-gray-800">{Object.keys(itemsByCategory).length}</span> categories
                      </>
                    )}
                  </p>
                  {(category || location) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {category && `Category: ${category}`}
                      {category && location && " • "}
                      {location && `Location: ${location}`}
                    </p>
                  )}
                </div>

                {/* View Toggle - Only show on category pages */}
                {hasCategoryFilter && (
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
                )}
              </div>
            </div>

            {/* Items Display */}
            {hasCategoryFilter ? (
              /* CATEGORY PAGE: With Pagination */
              items.length > 0 ? (
                <>
                  <Suspense
                    fallback={
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-6">
                        {[...Array(6)].map((_, i) => (
                          <ProductCardSkeleton key={i} />
                        ))}
                      </div>
                    }>
                    {/* Standard Grid for category pages - 2 columns on mobile */}
                    <div
                      className={
                        view === "list"
                          ? "hidden lg:block space-y-6 mb-8"
                          : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-8"
                      }>
                      {items.map((item) => (
                        <ItemCard key={item.id} item={item} view={view} />
                      ))}
                    </div>
                  </Suspense>

                  {/* Pagination - Only for category pages */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm lg:shadow-lg p-3 lg:p-6">
                      <div className="flex items-center justify-between">
                        {/* Previous Button */}
                        <div>
                          {pagination.hasPrevPage ? (
                            <Link
                              href={buildPageUrl(page - 1)}
                              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300 text-xs sm:text-sm">
                              <FiChevronLeft className="text-sm sm:text-base" />
                              <span className="hidden sm:inline">Previous</span>
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed text-xs sm:text-sm">
                              <FiChevronLeft className="text-sm sm:text-base" />
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
                        </div>

                        {/* Mobile Page Info */}
                        <div className="sm:hidden text-xs text-gray-600">
                          {page} / {pagination.totalPages}
                        </div>

                        {/* Next Button */}
                        <div>
                          {pagination.hasNextPage ? (
                            <Link
                              href={buildPageUrl(page + 1)}
                              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300 text-xs sm:text-sm">
                              <span className="hidden sm:inline">Next</span>
                              <FiChevronRight className="text-sm sm:text-base" />
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed text-xs sm:text-sm">
                              <span className="hidden sm:inline">Next</span>
                              <FiChevronRight className="text-sm sm:text-base" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* No Results for Category */
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm lg:shadow-lg p-6 lg:p-12 text-center">
                  <div className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                    <FiSearch className="text-gray-400 text-lg lg:text-2xl" />
                  </div>
                  <h3 className="text-base lg:text-xl font-semibold text-gray-800 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-4 text-xs lg:text-base">Try adjusting your filters or search terms.</p>
                  <Link
                    href="/browse"
                    className="inline-flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl hover:bg-teal-600 transition duration-300 font-semibold text-xs lg:text-base">
                    <FiSliders className="text-sm" />
                    <span>Clear Filters</span>
                  </Link>
                </div>
              )
            ) : /* MAIN PAGE: No Pagination, Horizontal Scrolling by Category */
            Object.keys(itemsByCategory).length > 0 ? (
              // <Suspense
              //   fallback={
              //     <div className="space-y-4">
              //       {[...Array(3)].map((_, i) => (
              //         <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
              //           <div className="flex items-center justify-between mb-3">
              //             <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              //             <div className="h-3 bg-gray-200 rounded w-1/6 animate-pulse"></div>
              //           </div>
              //           <div className="flex space-x-3 overflow-x-auto pb-3">
              //             {[...Array(6)].map((_, j) => (
              //               <div key={j} className="flex-shrink-0 w-32 lg:w-64">
              //                 <ProductCardSkeleton />
              //               </div>
              //             ))}
              //           </div>
              //         </div>
              //       ))}
              //     </div>
              //   }>

              <div className="space-y-4 mb-6">
                {Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
                  <div key={categoryName} className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 text-sm">{categoryName}</h3>
                      <Link
                        href={`/browse?category=${encodeURIComponent(categoryName)}`}
                        className="text-xs text-teal-600 font-medium flex items-center">
                        View All <FiChevronDown className="ml-1 transform rotate-270" />
                      </Link>
                    </div>
                    <div className="flex space-x-3 overflow-x-auto pb-3 hide-scrollbar">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-32 lg:w-64">
                          <CompactItemCard item={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // </Suspense>
              /* No Items at All */
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm lg:shadow-lg p-6 lg:p-12 text-center">
                <div className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <FiSearch className="text-gray-400 text-lg lg:text-2xl" />
                </div>
                <h3 className="text-base lg:text-xl font-semibold text-gray-800 mb-2">No items available</h3>
                <p className="text-gray-600 mb-4 text-xs lg:text-base">Check back later for new items.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ultra-compact card for horizontal scrolling (Main Page)
function CompactItemCard({ item }) {
  const discountPercentage =
    item.original_price && item.price < item.original_price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : 0;

  return (
    <Link href={`/items/${item.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition duration-200">
        {/* Image */}
        <div className="relative h-20 lg:h-40 bg-gray-200">
          {item.image_urls && item.image_urls.length > 0 ? (
            <img
              src={item.image_urls[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-100 to-amber-100 flex items-center justify-center">
              <FiTag className="text-teal-400 text-sm" />
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-1 left-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2">
          {/* Title - Single line */}
          <h3 className="font-medium text-gray-800 text-xs leading-tight line-clamp-1 mb-1 group-hover:text-teal-600 transition duration-200">
            {item.title}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
            {item.original_price && item.original_price > item.price && (
              <p className="text-xs text-gray-500 line-through">₹{item.original_price.toLocaleString()}</p>
            )}
          </div>

          {/* Location - Tiny */}
          <div className="flex items-center mt-1">
            <FiMapPin className="text-amber-500 text-xs mr-1" />
            <span className="text-xs text-gray-500 truncate">{item.location.split(",")[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/// Updated Item Card Component for Mobile Optimization
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
