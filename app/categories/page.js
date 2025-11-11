// app/categories/page.js
import { getAllCategoriesWithCounts } from "@/lib/queries/categories";
import { getAllItems } from "@/lib/queries/items";
import Image from "next/image";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithCounts();
  const featuredItems = await getFeaturedItemsByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Browse Categories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover items by category. Find exactly what you're looking for or explore new interests.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {categories.map((category) => (
            <Link key={category.name} href={`/browse?category=${category.slug}`} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-105 transform">
                {/* Category Image */}
                <div className="">
                  {category.imageUrl && (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      // className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {/* <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition duration-300" /> */}

                  {/* Item Count Badge */}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-gray-700">{category.itemCount} items</span>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{category.emoji}</span>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition duration-300">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>

                  {/* View Category Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-teal-600 text-sm font-semibold group-hover:text-teal-700 transition duration-300">
                      Browse Category →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Items by Category */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Items</h2>

          <div className="space-y-12">
            {featuredItems.map((section) => (
              <div key={section.category}>
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryEmoji(section.category)}</span>
                    <h3 className="text-2xl font-bold text-gray-800">{section.category}</h3>
                  </div>
                  <Link
                    href={`/browse?category=${getCategorySlug(section.category)}`}
                    className="text-teal-600 hover:text-teal-700 font-semibold transition duration-300">
                    View All →
                  </Link>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.items.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      href={`/items/${item.id}`}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      {/* Item Image */}
                      <div className="relative bg-gray-200 overflow-hidden">
                        {item.image_urls && (
                          <img
                            src={item.image_urls[0]}
                            alt={item.title}
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                      </div>

                      {/* Item Info */}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-teal-600 transition duration-300">
                          {item.title}
                        </h4>
                        <p className="text-green-600 font-bold text-lg mb-2">${item.price}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{item.location}</span>
                          <span>{item.condition}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Be the first to list an item in a new category or create a wanted listing for items you're searching for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/items/new"
              className="bg-white text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition duration-300">
              Sell Your Item
            </Link>
            <Link
              href="/search"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-teal-600 transition duration-300">
              Advanced Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get featured items by category
async function getFeaturedItemsByCategory() {
  try {
    const items = await getAllItems();

    // Group items by category and take 4 from each
    const categories = {};
    items.forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      if (categories[item.category].length < 4) {
        categories[item.category].push(item);
      }
    });

    return Object.entries(categories).map(([category, items]) => ({
      category,
      items,
    }));
  } catch (error) {
    console.error("Error getting featured items:", error);
    return [];
  }
}

// Helper function to get emoji for category
function getCategoryEmoji(category) {
  const emojiMap = {
    Electronics: "📱",
    Furniture: "🛋️",
    Fashion: "👗",
    "Sports & Fitness": "⚽",
    "Books & Media": "📚",
    Vehicles: "🚗",
    "Real Estate": "🏠",
    "Toys & Games": "🎮",
    "Home Appliances": "🏠",
    "Mobile Phones": "📱",
    "Laptops & Computers": "💻",
    Other: "📦",
  };
  return emojiMap[category] || "📦";
}

// Helper function to create slug from category name
function getCategorySlug(category) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function generateMetadata() {
  return {
    title: "Browse Categories - Marketplace",
    description: "Explore items by category. Find electronics, furniture, fashion, sports equipment, and more.",
    keywords: "categories, browse, electronics, furniture, fashion, sports, books, vehicles",
  };
}
