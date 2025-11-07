// app/item/[id]/page.js
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/queries/items";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiTag,
  FiDollarSign,
  FiShare2,
  FiHeart,
  FiAlertTriangle,
  FiCheckCircle,
  FiStar,
  FiShoppingBag,
  FiClock,
} from "react-icons/fi";
import Link from "next/link";
import { getSellerStats } from "@/lib/queries/items";
import { getFavoriteCount } from "@/lib/queries/favorite";
import FavoriteButton from "@/components/FavoriteButton";
import ItemOwnerActions from "@/components/ItemOwnerActions";

export default async function ItemPage({ params }) {
  const { id } = await params;

  // Fetch item data
  let item;
  try {
    item = await getItemById(parseInt(id));
    console.log(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    notFound();
  }

  // Don't show deleted items
  if (!item) {
    notFound();
  }

  const statItems = await getSellerStats(item.user_id);
  const favoriteCount = await getFavoriteCount(parseInt(id));

  // Calculate discount percentage if original price exists
  const discountPercentage =
    item.original_price && item.price < item.original_price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : 0;

  // Format date
  const formattedDate = new Date(item.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate how long ago the item was posted
  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInMs = now - posted;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/browse"
            className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium transition duration-300">
            <FiArrowLeft className="text-lg" />
            <span>Back to Browse</span>
          </Link>
        </div>

        {/* Sold Item Banner */}
        {item.status === "sold" && (
          <div className="bg-amber-100 border border-amber-300 text-amber-800 rounded-2xl p-4 mb-6 flex items-center space-x-3">
            <FiAlertTriangle className="text-amber-600 text-xl flex-shrink-0" />
            <div>
              <p className="font-semibold">This item has been sold</p>
              <p className="text-sm">This listing is no longer available for purchase.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              {item.image_urls && item.image_urls.length > 0 ? (
                <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-100 to-amber-100 flex items-center justify-center">
                  <div className="text-center">
                    <FiTag className="text-teal-400 text-4xl mx-auto mb-2" />
                    <p className="text-teal-600 font-medium">No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {item.image_urls && item.image_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.image_urls.slice(1).map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition duration-300">
                    <img src={url} alt={`${item.title} - ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Seller Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiUser className="text-teal-600 mr-2" />
                Seller Information
              </h2>
              <div className="flex items-start space-x-4 mb-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {item.user_name?.charAt(0)?.toUpperCase() || item.user_email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </div>

                {/* User Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.user_name || "Seller"}</h3>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1">
                      <FiCheckCircle className="text-xs" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiMail className="text-gray-400 text-base" />
                      <span>{item.user_email}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiCalendar className="text-gray-400 text-base" />
                      <span>Member since {new Date(item.created_at).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <FiUser className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Name</p>
                      <p className="font-semibold text-gray-800">{item.contact_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FiPhone className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-800">{item.contact_phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Stats */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{statItems.itemsSold}</p>
                    <p className="text-xs text-gray-500">Items Sold</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{statItems.totalItems}</p>
                    <p className="text-xs text-gray-500">Actively Selling</p>
                  </div>
                </div>
              </div>

              {/* View Seller's Other Items Button */}
              <button className="w-full mt-4 border-2 border-teal-500 text-teal-600 py-3 rounded-xl font-semibold hover:bg-teal-50 transition duration-300 flex items-center justify-center space-x-2">
                <FiShoppingBag className="text-lg" />
                <span>View Seller's Other Items</span>
              </button>
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Owner Actions - Only visible to item owner */}
            <ItemOwnerActions item={item} />

            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">{item.category}</span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">{item.condition}</span>
                    <span className="flex items-center space-x-1 text-xs text-gray-500">
                      <FiClock className="text-gray-400" />
                      <span>{getTimeAgo(item.created_at)}</span>
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FiMapPin className="text-amber-500" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="text-gray-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <FavoriteButton itemId={parseInt(id)} initialFavoriteCount={favoriteCount} />
                  <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-300">
                    <FiShare2 className="text-gray-600 text-xl" />
                  </button>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-end space-x-4 mb-6">
                <div>
                  <p className="text-4xl font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                  {item.original_price && item.original_price > item.price && (
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-lg text-gray-500 line-through">₹{item.original_price.toLocaleString()}</p>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-bold">{discountPercentage}% OFF</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Seller Button - Disabled if sold */}
              <button
                disabled={item.status === "sold"}
                className={`w-full py-4 rounded-xl font-bold transition duration-300 shadow-lg mb-4 ${
                  item.status === "sold"
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-amber-500 text-white hover:from-teal-600 hover:to-amber-600 shadow-teal-500/25"
                }`}>
                {item.status === "sold" ? "Item Sold" : "Contact Seller"}
              </button>
            </div>

            {/* Rest of your existing sections remain the same */}
            {/* Item Specifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Item Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-800">{item.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-semibold text-gray-800">{item.condition}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-gray-800 flex items-center">
                    <FiMapPin className="text-amber-500 mr-1" />
                    {item.location}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-semibold text-gray-800">{formattedDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-semibold ${
                      item.status === "active" ? "text-green-600" : item.status === "sold" ? "text-amber-600" : "text-gray-600"
                    }`}>
                    {item.status?.toUpperCase() || "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiTag className="text-teal-600 mr-2" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-6">
              <div className="flex items-start space-x-3">
                <FiAlertTriangle className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Safety Tips</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Meet in a safe, public location</li>
                    <li>• Inspect the item thoroughly before purchasing</li>
                    <li>• Never wire money in advance</li>
                    <li>• Trust your instincts</li>
                    <li>• Check the seller's profile and reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Similar Items</h2>
            <Link href="/browse" className="text-teal-600 hover:text-teal-700 font-semibold">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center py-8 text-gray-500 col-span-full">
              <FiShoppingBag className="text-3xl text-gray-400 mx-auto mb-2" />
              <p>More items from {item.category} category</p>
              <Link
                href={`/browse?category=${encodeURIComponent(item.category)}`}
                className="inline-block mt-2 text-teal-600 hover:text-teal-700 font-semibold">
                Browse similar items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getItemById(parseInt(id));

  if (!item) {
    return {
      title: "Item Not Found - MyStore",
    };
  }

  return {
    title: `${item.title} - ₹${item.price} - MyStore`,
    description: item.description.substring(0, 160),
    openGraph: {
      title: item.title,
      description: item.description.substring(0, 160),
      images: item.image_urls && item.image_urls.length > 0 ? [item.image_urls[0]] : [],
      price: {
        amount: item.price,
        currency: "INR",
      },
    },
  };
}

// Generate static params for SSG (optional)
export async function generateStaticParams() {
  // This would typically fetch all item IDs for static generation
  // For now, return empty array and rely on dynamic rendering
  return [];
}
