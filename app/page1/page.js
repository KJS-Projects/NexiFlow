import Header from "@/components/Header";
import Footer from "@/components/Footer";

// app/page.js
import Link from "next/link";
import Image from "next/image";

import { Suspense } from "react";

export default function Home() {
  // Mock data - replace with actual data from your API
  const featuredProducts = [
    {
      id: 1,
      title: "iPhone 13 Pro",
      price: 45000,
      location: "Mumbai",
      image: "/placeholder-iphone.jpg",
      category: "Electronics",
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "Sofa Set - Almost New",
      price: 12000,
      location: "Delhi",
      image: "/placeholder-sofa.jpg",
      category: "Furniture",
      date: "1 day ago",
    },
    {
      id: 3,
      title: "Mountain Bike",
      price: 8000,
      location: "Bangalore",
      image: "/placeholder-bike.jpg",
      category: "Sports",
      date: "3 hours ago",
    },
    {
      id: 4,
      title: "Designer Handbag",
      price: 3500,
      location: "Chennai",
      image: "/placeholder-bag.jpg",
      category: "Fashion",
      date: "5 hours ago",
    },
    {
      id: 5,
      title: "Gaming Laptop",
      price: 55000,
      location: "Hyderabad",
      image: "/placeholder-laptop.jpg",
      category: "Electronics",
      date: "1 hour ago",
    },
    {
      id: 6,
      title: "Bookshelf",
      price: 2500,
      location: "Pune",
      image: "/placeholder-bookshelf.jpg",
      category: "Furniture",
      date: "2 days ago",
    },
  ];

  const categories = [
    { name: "Electronics", icon: "📱", count: 1245 },
    { name: "Furniture", icon: "🛋️", count: 876 },
    { name: "Fashion", icon: "👕", count: 1567 },
    { name: "Sports", icon: "⚽", count: 543 },
    { name: "Books", icon: "📚", count: 432 },
    { name: "Vehicles", icon: "🚗", count: 287 },
    { name: "Real Estate", icon: "🏠", count: 156 },
    { name: "Others", icon: "📦", count: 765 },
  ];

  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white shadow-sm"></div>}>
        <Header />
      </Suspense>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">Find Amazing Deals on Second Hand Items</h1>
              <p className="text-xl mb-8 text-blue-100">
                Buy and sell pre-loved items in your neighborhood. Quality products at affordable prices.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/sell"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300">
                  Sell Now
                </Link>
                <Link
                  href="/browse"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-white shadow-lg -mt-8 relative z-10 mx-4 rounded-lg">
          <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search for items, brands, or categories..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="fashion">Fashion</option>
                <option value="sports">Sports</option>
                <option value="books">Books</option>
              </select>

              {/* Location Filter */}
              <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Locations</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
              </select>
            </div>

            {/* Advanced Filters */}
            <div className="mt-4 flex flex-wrap gap-4">
              <select className="p-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Price Range</option>
                <option value="0-1000">Under ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000+">Above ₹10,000</option>
              </select>

              <select className="p-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Condition</option>
                <option value="new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>

              <button className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Apply Filters
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/category/${category.name.toLowerCase()}`}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition duration-300 group">
                  <span className="text-3xl mb-2 group-hover:scale-110 transition duration-300">{category.icon}</span>
                  <span className="font-semibold text-gray-800 text-center">{category.name}</span>
                  <span className="text-sm text-gray-500 mt-1">{category.count} items</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Recently Added</h2>
              <Link href="/browse" className="text-blue-600 hover:text-blue-800 font-semibold">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                    {/* Replace with actual Image component */}
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Product Image</span>
                    </div>
                    <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50">♡</button>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{product.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{product.category}</span>
                    </div>

                    <p className="text-2xl font-bold text-gray-900 mb-2">₹{product.price.toLocaleString()}</p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{product.location}</span>
                      <span>{product.date}</span>
                    </div>

                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-blue-100">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1,00,000+</div>
                <div className="text-blue-100">Items Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Cities Covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Items?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users who are buying and selling second-hand items in a safe and convenient way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                Sign Up Free
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
