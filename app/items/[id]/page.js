// app/item/[id]/page.js
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/queries/items";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPhone,
  FiTag,
  FiDollarSign,
  FiShare2,
  FiHeart,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import Link from "next/link";

export default async function ItemPage({ params }) {
  const { id } = await params;

  // Fetch item data
  let item;
  try {
    item = await getItemById(parseInt(id));
  } catch (error) {
    console.error("Error fetching item:", error);
    notFound();
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium transition duration-300">
            <FiArrowLeft className="text-lg" />
            <span>Back to Browse</span>
          </Link>
        </div>

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
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">{item.category}</span>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">{item.condition}</span>
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
                  <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-300">
                    <FiHeart className="text-gray-600 text-xl" />
                  </button>
                  <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-300">
                    <FiShare2 className="text-gray-600 text-xl" />
                  </button>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-end space-x-4 mb-4">
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

              {/* Contact Seller Button */}
              <button className="w-full bg-gradient-to-r from-teal-500 to-amber-500 text-white py-4 rounded-xl font-bold hover:from-teal-600 hover:to-amber-600 transition duration-300 shadow-lg shadow-teal-500/25">
                Contact Seller
              </button>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiTag className="text-teal-600 mr-2" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FiUser className="text-teal-600 mr-2" />
                Seller Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-800">{item.contact_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold text-gray-800">{item.contact_phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold text-gray-800 flex items-center">
                    <FiMapPin className="text-amber-500 mr-1" />
                    {item.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <FiAlertTriangle className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Safety Tips</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Meet in a safe, public location</li>
                    <li>• Inspect the item thoroughly before purchasing</li>
                    <li>• Never wire money in advance</li>
                    <li>• Trust your instincts</li>
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

          {/* This would typically fetch related items from the same category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related items - you can implement this later */}
            <div className="text-center py-8 text-gray-500">
              <FiTag className="text-3xl text-gray-400 mx-auto mb-2" />
              <p>More items from this category</p>
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
      title: "Item Not Found - ReStore",
    };
  }

  return {
    title: `${item.title} - ₹${item.price} - ReStore`,
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
