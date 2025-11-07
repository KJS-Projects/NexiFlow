// app/browse/page.js
import { getAllItems } from "@/lib/queries/items";
import { FiSearch, FiFilter, FiMapPin, FiTag, FiDollarSign, FiGrid, FiList, FiSliders } from "react-icons/fi";
import Link from "next/link";

// Client component for the filter form
import FilterForm from "./FilterForm";

export default async function BrowsePage({ searchParams }) {
  // Get all items from the database
  const items = await getAllItems();

  // Extract unique categories and locations from items
  const categories = [...new Set(items.map((item) => item.category))].sort();
  const locations = [...new Set(items.map((item) => item.location))].sort();

  // Get filter parameters from URL
  const { category, location, minPrice, maxPrice, search, view = "grid" } = await searchParams;

  // Filter items based on search parameters
  const filteredItems = items.filter((item) => {
    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (category && item.category !== category) return false;

    // Location filter
    if (location && item.location !== location) return false;

    // Price range filter
    if (minPrice && item.price < parseFloat(minPrice)) return false;
    if (maxPrice && item.price > parseFloat(maxPrice)) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Browse All Items</h1>
          <p className="text-lg text-gray-600">Discover amazing second-hand deals from sellers near you</p>
        </div>

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
                    Showing <span className="font-semibold text-gray-800">{filteredItems.length}</span> items
                    {search && ` for "${search}"`}
                    {category && ` in ${category}`}
                    {location && ` from ${location}`}
                  </p>
                </div>

                {/* View Toggle */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <Link
                      href={`/browse?${new URLSearchParams(
                        Object.entries({
                          ...(search && { search }),
                          ...(category && { category }),
                          ...(location && { location }),
                          ...(minPrice && { minPrice }),
                          ...(maxPrice && { maxPrice }),
                          view: "grid",
                        }).filter(([_, value]) => value)
                      )}`}
                      className={`p-2 rounded-lg transition duration-300 ${
                        view === "grid" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}>
                      <FiGrid className="text-lg" />
                    </Link>
                    <Link
                      href={`/browse?${new URLSearchParams(
                        Object.entries({
                          ...(search && { search }),
                          ...(category && { category }),
                          ...(location && { location }),
                          ...(minPrice && { minPrice }),
                          ...(maxPrice && { maxPrice }),
                          view: "list",
                        }).filter(([_, value]) => value)
                      )}`}
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
            {filteredItems.length > 0 ? (
              <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} view={view} />
                ))}
              </div>
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

// Item Card Component (keep the same as before)
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
