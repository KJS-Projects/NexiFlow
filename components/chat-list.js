// src/components/chat/chat-list.js
"use client";

import { useState, useEffect } from "react";
import { getUserChats } from "@/actions/chatActions";
import { auth } from "@/utils/firebaseBrowser";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";

export default function ChatList() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user, currentPage]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const result = await getUserChats(user.uid, currentPage);

      if (result) {
        setChats(result.chats || []);
        setPagination(result.pagination || {});
      } else {
        console.error("Failed to load chats:", result.error);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "No messages yet";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Chats</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Please sign in to view your chats.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Chats</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Chats</h1>

      {chats.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No chats yet</div>
          <p className="text-gray-400">Start a conversation by contacting a seller about their item.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chats/${chat.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
              <div className="flex items-center space-x-4">
                {/* Item Image */}
                <div className="flex-shrink-0">
                  {chat.item_images && chat.item_images.length > 0 ? (
                    <img
                      src={chat.item_images[0]}
                      alt={chat.item_title}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.item_title}</h3>
                    <span className="text-sm text-gray-500 flex-shrink-0 ml-2">{formatTime(chat.last_message_at || chat.updated_at)}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-1">
                    {chat.buyer_id === user.uid ? (
                      <>
                        Seller: <span className="font-medium">{chat.seller_id}</span>
                      </>
                    ) : (
                      <>
                        Buyer: <span className="font-medium">{chat.buyer_id}</span>
                      </>
                    )}
                  </p>

                  <p className="text-gray-500 text-sm truncate">
                    {chat.last_message ? truncateText(chat.last_message) : "Start a conversation..."}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
