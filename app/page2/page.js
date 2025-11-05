// app/page2.js
import Link from "next/link";
import { FiStar, FiMapPin, FiClock, FiTrendingUp, FiShield, FiRepeat, FiDollarSign, FiHeart } from "react-icons/fi";
import Header2 from "@/components/Header2";
import Footer2 from "@/components/Footer2";

export default function HomePage2() {
  // Mock data
  const featuredProducts = [
    {
      id: 1,
      title: "MacBook Pro 2020",
      price: 65000,
      originalPrice: 89900,
      location: "Bangalore",
      category: "Electronics",
      time: "2 hours ago",
      rating: 4.8,
      image: "/placeholder-macbook.jpg",
    },
    {
      id: 2,
      title: "Leather Sofa Set 3+1+1",
      price: 25000,
      originalPrice: 40000,
      location: "Mumbai",
      category: "Furniture",
      time: "1 day ago",
      rating: 4.5,
      image: "/placeholder-sofa.jpg",
    },
    {
      id: 3,
      title: "Nike Air Jordan Shoes",
      price: 4500,
      originalPrice: 8999,
      location: "Delhi",
      category: "Fashion",
      time: "3 hours ago",
      rating: 4.9,
      image: "/placeholder-shoes.jpg",
    },
    {
      id: 4,
      title: "Canon DSLR Camera",
      price: 32000,
      originalPrice: 45000,
      location: "Chennai",
      category: "Electronics",
      time: "5 hours ago",
      rating: 4.7,
      image: "/placeholder-camera.jpg",
    },
    {
      id: 5,
      title: "Wooden Bookshelf",
      price: 3500,
      originalPrice: 6000,
      location: "Pune",
      category: "Furniture",
      time: "1 hour ago",
      rating: 4.6,
      image: "/placeholder-bookshelf.jpg",
    },
    {
      id: 6,
      title: "Mountain Bike 21 Gear",
      price: 12000,
      originalPrice: 18000,
      location: "Hyderabad",
      category: "Sports",
      time: "2 days ago",
      rating: 4.4,
      image: "/placeholder-bike.jpg",
    },
  ];

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

  return (
    <>
      <Header2 />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-teal-900 via-teal-800 to-amber-900 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <FiTrendingUp className="text-amber-400" />
                <span className="text-sm font-medium">Trusted by 50,000+ users</span>
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Rediscover Value in <span className="text-amber-400">Pre-Loved</span> Items
              </h1>
              <p className="text-xl mb-8 text-teal-100 leading-relaxed">
                Join fastest-growing marketplace for second-hand goods. Quality products, verified sellers, and sustainable shopping.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sell"
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
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Trending Deals</h2>
                <p className="text-lg text-gray-600 max-w-2xl">Handpicked quality items with great discounts and verified sellers</p>
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
                    {/* Product Image Placeholder */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-teal-200 rounded-2xl mb-2 mx-auto flex items-center justify-center">
                          <FiTrendingUp className="text-teal-600 text-2xl" />
                        </div>
                        <span className="text-teal-700 font-medium">Product Image</span>
                      </div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-amber-50 hover:text-amber-500 transition duration-300">
                      <FiHeart className="text-lg" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-teal-600 transition duration-300">
                          {product.title}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <FiMapPin className="text-amber-500 text-sm" />
                          <span className="text-sm text-gray-600">{product.location}</span>
                        </div>
                      </div>
                      <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">{product.category}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-full">
                        <FiStar className="text-amber-500 fill-amber-500 text-sm" />
                        <span className="text-sm font-medium text-amber-700">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <FiClock className="text-sm" />
                        <span>{product.time}</span>
                      </div>
                    </div>

                    <button className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition duration-300 group-hover:bg-teal-600">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-teal-900 to-amber-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold mb-2 text-amber-400">50K+</div>
                <div className="text-teal-200 font-medium">Active Community</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold mb-2 text-amber-400">1L+</div>
                <div className="text-teal-200 font-medium">Items Listed</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold mb-2 text-amber-400">₹5Cr+</div>
                <div className="text-teal-200 font-medium">Value Saved</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold mb-2 text-amber-400">500+</div>
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
      <Footer2 />
    </>
  );
}
