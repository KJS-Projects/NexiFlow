// app/page.js
import Link from "next/link";
import { FiStar, FiMapPin, FiClock, FiTrendingUp, FiShield, FiRepeat, FiDollarSign, FiHeart, FiTag } from "react-icons/fi";
import { getAllItems } from "@/lib/queries/items";

export default async function HomePage() {
  // Fetch real data from the database
  const allItems = await getAllItems();

  // Get featured products (latest 6 items)
  const featuredProducts = allItems.slice(0, 6).map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    originalPrice: item.original_price || null,
    location: item.location,
    category: item.category,
    time: formatTimeAgo(item.created_at),
    rating: 4.5, // You can add ratings to your database later
    imageUrls: item.image_urls || [],
  }));

  // Extract unique categories and locations for filters
  const categories = [...new Set(allItems.map((item) => item.category))].slice(0, 8);
  const locations = [...new Set(allItems.map((item) => item.location))].slice(0, 6);

  const features = [
    {
      icon: <FiShield className="text-2xl text-teal-600" />,
      title: "Secure Transactions",
      description: "Safe and protected payments with buyer protection",
    },
    {
      icon: <FiRepeat className="text-2xl text-amber-600" />,
      title: "Easy Returns",
      description: "7-day return policy for unsatisfied purchases",
    },
    {
      icon: <FiTrendingUp className="text-2xl text-teal-600" />,
      title: "Best Prices",
      description: "Great deals and negotiations for smart buyers",
    },
  ];

  // Helper function to build browse URL with filters
  function buildBrowseUrl(filters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    return `/browse?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-900 via-teal-800 to-amber-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <FiTrendingUp className="text-amber-400" />
              <span className="text-sm font-medium">Trusted by {allItems.length * 50}+ users</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Rediscover Value in <span className="text-amber-400">Pre-Loved</span> Items
            </h1>
            <p className="text-xl mb-8 text-teal-100 leading-relaxed">
              Join India's fastest-growing marketplace for second-hand goods. Quality products, verified sellers, and sustainable shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/items/new"
                className="inline-flex items-center justify-center space-x-2 bg-amber-500 text-teal-900 px-8 py-4 rounded-xl font-bold hover:bg-amber-400 transition duration-300 shadow-lg shadow-amber-500/25">
                <FiDollarSign className="text-lg" />
                <span>Start Selling</span>
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center justify-center space-x-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition duration-300 backdrop-blur-sm">
                <span>Explore Marketplace</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters Section */}
      <section className="py-12 bg-white -mt-8 relative z-10 mx-4 rounded-2xl shadow-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Find What You Need</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Browse by category or location to discover amazing deals near you</p>
          </div>

          {/* Categories Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
              <FiTag className="text-teal-600 mr-2" />
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={buildBrowseUrl({ category })}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-teal-50 hover:shadow-md transition duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-amber-100 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition duration-300">
                    <FiTag className="text-teal-600 text-lg" />
                  </div>
                  <span className="font-semibold text-gray-800 text-center text-sm">{category}</span>
                  <span className="text-xs text-gray-500 mt-1">{allItems.filter((item) => item.category === category).length} items</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Locations Grid */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
              <FiMapPin className="text-amber-600 mr-2" />
              Popular Locations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {locations.map((location, index) => (
                <Link
                  key={index}
                  href={buildBrowseUrl({ location })}
                  className="flex items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-amber-50 hover:shadow-md transition duration-300 group">
                  <div className="text-center">
                    <FiMapPin className="text-amber-500 text-lg mx-auto mb-1 group-hover:scale-110 transition duration-300" />
                    <span className="font-semibold text-gray-800 text-sm">{location}</span>
                    <span className="text-xs text-gray-500 block mt-1">
                      {allItems.filter((item) => item.location === location).length} items
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Price Filters */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
              <FiDollarSign className="text-gray-600 mr-2" />
              Budget Shopping
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Under ₹1,000", minPrice: 0, maxPrice: 1000 },
                { label: "₹1,000 - ₹5,000", minPrice: 1000, maxPrice: 5000 },
                { label: "₹5,000 - ₹10,000", minPrice: 5000, maxPrice: 10000 },
                { label: "Above ₹10,000", minPrice: 10000, maxPrice: "" },
              ].map((range, index) => (
                <Link
                  key={index}
                  href={buildBrowseUrl({
                    minPrice: range.minPrice,
                    maxPrice: range.maxPrice,
                  })}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition duration-300 text-sm font-medium text-gray-700">
                  {range.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose ReStore?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make buying and selling second-hand items safe, easy, and rewarding
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-2xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Recently Added</h2>
              <p className="text-lg text-gray-600 max-w-2xl">Fresh listings with great discounts from verified sellers</p>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-semibold mt-4 lg:mt-0">
              <span>View All Items</span>
              <FiTrendingUp className="text-lg" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-br from-teal-100 to-amber-100 overflow-hidden">
                  {/* Product Image */}
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-teal-200 rounded-2xl mb-2 mx-auto flex items-center justify-center">
                          <FiTag className="text-teal-600 text-2xl" />
                        </div>
                        <span className="text-teal-700 font-medium">No Image</span>
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.originalPrice && product.price < product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-amber-50 hover:text-amber-500 transition duration-300">
                    <FiHeart className="text-lg" />
                  </button>

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-teal-600 transition duration-300 mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <FiMapPin className="text-amber-500" />
                      <span>{product.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-full">
                      <FiStar className="text-amber-500 text-sm" />
                      <span className="text-sm font-medium text-amber-700">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <FiClock className="text-sm" />
                      <span>{product.time}</span>
                    </div>
                  </div>

                  <Link
                    href={`/items/${product.id}`}
                    className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition duration-300 group-hover:bg-teal-600 block text-center">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Show message if no products */}
          {featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTag className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Items Listed Yet</h3>
              <p className="text-gray-600 mb-6">Be the first to list an item and start selling!</p>
              <Link
                href="/sell"
                className="inline-flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition duration-300 font-semibold">
                <FiDollarSign className="text-lg" />
                <span>Sell Your First Item</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-teal-900 to-amber-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 text-amber-400">{Math.round(allItems.length * 50).toLocaleString()}+</div>
              <div className="text-teal-200 font-medium">Active Community</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 text-amber-400">{allItems.length}+</div>
              <div className="text-teal-200 font-medium">Items Listed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 text-amber-400">₹{calculateTotalValue(allItems).toLocaleString()}+</div>
              <div className="text-teal-200 font-medium">Value Saved</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 text-amber-400">{locations.length}+</div>
              <div className="text-teal-200 font-medium">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Join the Circular Economy?</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Be part of the movement that reduces waste and gives quality items a second life. Start your sustainable shopping journey
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-teal-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold hover:from-teal-600 hover:to-amber-600 transition duration-300 shadow-lg shadow-teal-500/25">
                Create Free Account
              </Link>
              <Link
                href="/about"
                className="border-2 border-teal-500 text-teal-600 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
}

// Helper function to calculate total value saved
function calculateTotalValue(items) {
  return items.reduce((total, item) => {
    const original = item.original_price || item.price * 1.5; // Estimate if not available
    const savings = original - item.price;
    return total + Math.max(savings, 0);
  }, 0);
}
