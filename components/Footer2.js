// app/components/Footer2.js
import Link from "next/link";
import { FiHome, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer2() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-teal-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-amber-500 rounded-xl flex items-center justify-center">
                <FiHome className="text-white text-lg" />
              </div>
              <div>
                <span className="text-2xl font-bold">MyStore</span>
                <span className="block text-xs text-teal-300 font-medium -mt-1">Second Hand</span>
              </div>
            </Link>
            <p className="text-teal-100 leading-relaxed mb-6 max-w-md">
              MyStore is trusted marketplace for pre-loved items. We're committed to sustainable shopping by giving quality products a
              second life while helping our community save money and reduce waste.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-teal-700/50 rounded-lg flex items-center justify-center hover:bg-teal-600 transition duration-300">
                <FiFacebook className="text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-teal-700/50 rounded-lg flex items-center justify-center hover:bg-teal-600 transition duration-300">
                <FiTwitter className="text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-teal-700/50 rounded-lg flex items-center justify-center hover:bg-teal-600 transition duration-300">
                <FiInstagram className="text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-teal-700/50 rounded-lg flex items-center justify-center hover:bg-teal-600 transition duration-300">
                <FiLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-amber-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-teal-100 hover:text-amber-400 transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-teal-100 hover:text-amber-400 transition duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-teal-100 hover:text-amber-400 transition duration-300">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-amber-400">Top Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/category/electronics" className="text-teal-100 hover:text-amber-400 transition duration-300">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/furniture" className="text-teal-100 hover:text-amber-400 transition duration-300">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/category/fashion" className="text-teal-100 hover:text-amber-400 transition duration-300">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-teal-100 hover:text-amber-400 transition duration-300">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/category/vehicles" className="text-teal-100 hover:text-amber-400 transition duration-300">
                  Vehicles
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-teal-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-700/50 rounded-lg flex items-center justify-center">
                <FiMail className="text-amber-400" />
              </div>
              <div>
                <span className="text-sm text-teal-300">Email</span>
                <div className="text-teal-100 font-medium">support@MyStore.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-700/50 rounded-lg flex items-center justify-center">
                <FiPhone className="text-amber-400" />
              </div>
              <div>
                <span className="text-sm text-teal-300">Phone</span>
                <div className="text-teal-100 font-medium">+91 1800-123-4567</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-700/50 rounded-lg flex items-center justify-center">
                <FiMapPin className="text-amber-400" />
              </div>
              <div>
                <span className="text-sm text-teal-300">Address</span>
                <div className="text-teal-100 font-medium">Bangalore, India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-teal-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-teal-300 text-sm mb-4 md:mb-0">&copy; 2024 MyStore. All rights reserved.</div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-teal-300 hover:text-amber-400 transition duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-teal-300 hover:text-amber-400 transition duration-300">
              Terms of Service
            </Link>
            <Link href="/safety" className="text-teal-300 hover:text-amber-400 transition duration-300">
              Safety Tips
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
