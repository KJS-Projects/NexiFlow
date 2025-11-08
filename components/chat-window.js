// src/components/chat/chat-window.js
"use client";

import { useState, useEffect, useRef } from "react";
import { getChat, getMessages, sendMessage, sendImageMessage } from "@/actions/chatActions";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

export default function ChatWindow({ chatId }) {
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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
    if (user && chatId) {
      loadChatData();
    }
  }, [user, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = async () => {
    try {
      setLoading(true);
      const [chatResult, messagesResult] = await Promise.all([getChat(chatId, user.uid), getMessages(chatId, user.uid)]);

      if (chatResult.success) {
        setChat(chatResult.chat);
      } else {
        console.error("Failed to load chat:", chatResult.error);
      }

      if (messagesResult) {
        setMessages(messagesResult.messages || []);
      } else {
        console.error("Failed to load messages:", messagesResult.error);
      }
    } catch (error) {
      console.error("Error loading chat data:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const result = await sendMessage(chatId, user.uid, newMessage);
      if (result.success) {
        setNewMessage("");
        setMessages((prev) => [...prev, result.message]);
      } else {
        console.error("Failed to send message:", result.error);
        alert("Failed to send message: " + result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await sendImageMessage(chatId, user.uid, formData);
      if (result.success) {
        setMessages((prev) => [...prev, result.message]);
      } else {
        console.error("Failed to send image:", result.error);
        alert("Failed to send image: " + result.error);
      }
    } catch (error) {
      console.error("Error sending image:", error);
      alert("Error sending image");
    } finally {
      setImageUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Please sign in to access chats.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Chat not found or access denied.</p>
          </div>
        </div>
      </div>
    );
  }

  const otherUserId = chat.buyer_id === user.uid ? chat.seller_id : chat.buyer_id;

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          {chat.item_images && chat.item_images.length > 0 ? (
            // <Image src={chat.item_images[0]} alt={chat.item_title} width={48} height={48} className="w-12 h-12 object-cover rounded" />
            <img
              src="https://czstpktgqcfq1gox.public.blob.vercel-storage.com/items/1762536824135-meet.jpg"
              alt={chat.item_title}
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{chat.item_title}</h2>
            <p className="text-sm text-gray-600">
              {chat.buyer_id === user.uid ? "Seller" : "Buyer"}: {otherUserId}
            </p>
            <p className="text-sm font-medium text-green-600">${chat.item_price}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender_id === user.uid ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === user.uid ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-200"
                }`}>
                {message.image_url ? (
                  <div>
                    <img src={message.image_url} alt="Shared image" width={300} height={200} className="rounded max-w-full h-auto" />
                    {message.message_text && <p className="mt-2">{message.message_text}</p>}
                  </div>
                ) : (
                  <p>{message.message_text}</p>
                )}
                <div className={`text-xs mt-1 ${message.sender_id === user.uid ? "text-teal-100" : "text-gray-500"}`}>
                  {formatMessageTime(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading || sending}
            className="flex-shrink-0 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {imageUploading ? "📤" : "📷"}
          </button>

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          {/* Message Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={sending || imageUploading}
          />

          <button
            type="submit"
            disabled={!newMessage.trim() || sending || imageUploading}
            className="flex-shrink-0 px-6 py-2 bg-gradient-to-r from-teal-500 to-amber-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
