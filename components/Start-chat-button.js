// src/components/chat/start-chat-button.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { startChat } from "@/actions/chatActions";
import { auth } from "@/utils/firebaseBrowser";
import { onAuthStateChanged } from "firebase/auth";

export default function StartChatButton({ item, className = "" }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleStartChat = async () => {
    if (!user) {
      alert("Please sign in to start a chat");
      return;
    }

    if (user.uid === item.user_id) {
      alert("You cannot start a chat with yourself");
      return;
    }

    setLoading(true);
    try {
      const result = await startChat(item.id, user.uid, item.user_id);

      if (result.success) {
        router.push(`/chats/${result.chat.id}`);
      } else {
        alert(result.error || "Failed to start chat");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Error starting chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading && item.status === "sold"}
      className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      {loading ? "Starting Chat..." : item.status === "sold" ? "Item Sold" : "Contact Seller"}
    </button>
  );
}
