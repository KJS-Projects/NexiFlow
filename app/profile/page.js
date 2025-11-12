// src/app/profile/page.js
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebaseBrowser";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [userItems, setUserItems] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [stats, setStats] = useState({
    itemsCount: 0,
    favoritesCount: 0,
    activeChats: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          metadata: user.metadata,
        });

        // Load user data via API
        await loadUserData(user.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    try {
      const response = await fetch(`/api/profile/stats?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setUserItems(data.items || []);
        setFavoritesCount(data.favoritesCount || 0);
        setStats(
          data.stats || {
            itemsCount: 0,
            favoritesCount: 0,
            activeChats: 0,
          }
        );
      } else {
        console.error("Error loading user data:", data.error);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-800 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p className="text-gray-600 mb-4">Please sign in to view your profile.</p>
          <Link href="/auth/signin" className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-teal-600 mb-2">{stats.itemsCount}</div>
          <div className="text-gray-600">Items Listed</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-teal-600 mb-2">{stats.favoritesCount}</div>
          <div className="text-gray-600">Favorites</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">{stats.activeChats}</div>
          <div className="text-gray-600">Active Chats</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-800">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "items"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              My Items ({userItems.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && <ProfileSettings user={user} setUser={setUser} />}
          {activeTab === "items" && <UserItems items={userItems} />}
        </div>
      </div>
    </div>
  );
}

// ProfileSettings component inside profile/page.js
function ProfileSettings({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    phoneNumber: user.phoneNumber || "",
  });

  const updateUserItems = async (userId, userEmail, userName) => {
    try {
      const response = await fetch("/api/profile/update-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userEmail,
          userName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to update user items:", data.error);
        return false;
      }

      console.log(`Updated ${data.updatedCount} items for user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error updating user items:", error);
      return false;
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Update Firebase profile
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      // Update user items in database
      const itemsUpdated = await updateUserItems(
        user.uid,
        user.email, // Email remains the same in profile update
        formData.displayName
      );

      // Update local user state
      setUser({
        ...user,
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      if (itemsUpdated) {
        setMessage({ type: "success", text: "Profile and associated items updated successfully!" });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully! (Some items may not have been updated)" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: `Failed to update profile: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

      {/* Current Profile Info */}
      <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          {user.photoURL ? (
            <Image src={user.photoURL} alt="Profile" width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-lg font-semibold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold">{user.displayName || "No display name set"}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">Member since {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Update Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        {message.text && (
          <div className={`p-3 rounded ${message.type === "success" ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your display name"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL</label>
          <input
            type="url"
            value={formData.photoURL}
            onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">Enter a URL to your profile picture</p>
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
// UserItems component inside profile/page.js
function UserItems({ items }) {
  // This component now uses the items passed as props from the parent
  // No database calls needed here since data is already loaded via API

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You haven't listed any items yet.</p>
        <Link href="/items/new" className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600">
          List Your First Item
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Listed Items</h2>
        <Link href="/items/new" className="bg-gradient-to-r from-teal-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
          + Add New Item
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-500 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/items/${item.id}`}>
              <div className="relative h-48 w-full">
                {item.image_urls && item.image_urls.length > 0 ? (
                  <img
                    src={item.image_urls[0]}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/items/${item.id}`}>
                <h3 className="font-semibold text-lg mb-2 hover:text-teal-600">{item.title}</h3>
              </Link>

              <p className="text-teal-600 font-bold text-xl mb-2">${item.price}</p>

              <div className="text-sm text-gray-600 mb-3">
                <p>
                  {item.location} • {item.condition}
                </p>
                <p className="text-teal-600 mt-1">Created: {new Date(item.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/items/${item.id}/edit`}
                  className="flex-1 text-center bg-white text-gray-800 border border-gray-800 py-2 rounded hover:bg-gray-600 text-sm">
                  Edit
                </Link>
                <Link
                  href={`/chats?item=${item.id}`}
                  className="flex-1 text-center bg-teal-500 text-white py-2 rounded hover:bg-teal-600 text-sm">
                  View Chats
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
