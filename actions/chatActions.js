// src/lib/actions/chat-actions.js
"use server";

import {
  createOrGetChat,
  getChatById,
  getChatsByUserId,
  addMessageToChat,
  getChatMessages,
  canUserAccessChat,
  getUnreadMessageCount,
  deleteChat,
} from "@/lib/queries/chat";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

// Start a new chat or get existing one
export async function startChat(itemId, buyerId, sellerId) {
  try {
    if (!itemId || !buyerId || !sellerId) {
      return { success: false, error: "Missing required parameters" };
    }

    if (buyerId === sellerId) {
      return { success: false, error: "Cannot start chat with yourself" };
    }

    const result = await createOrGetChat(itemId, buyerId, sellerId);

    if (result.success) {
      revalidatePath("/chats");
      revalidatePath(`/items/${itemId}`);
    }

    return result;
  } catch (error) {
    console.error("Error in startChat action:", error);
    return { success: false, error: "Failed to start chat" };
  }
}

// Send a text message
export async function sendMessage(chatId, senderId, messageText) {
  try {
    if (!chatId || !senderId || !messageText?.trim()) {
      return { success: false, error: "Missing required parameters" };
    }

    // Check if user can access this chat
    const canAccess = await canUserAccessChat(chatId, senderId);
    if (!canAccess) {
      return { success: false, error: "Access denied" };
    }

    const result = await addMessageToChat(chatId, senderId, messageText.trim(), null);

    if (result.success) {
      revalidatePath(`/chats/${chatId}`);
      revalidatePath("/chats");
    }

    return result;
  } catch (error) {
    console.error("Error in sendMessage action:", error);
    return { success: false, error: "Failed to send message" };
  }
}

// Upload image and send as message
export async function sendImageMessage(chatId, senderId, formData) {
  try {
    if (!chatId || !senderId) {
      return { success: false, error: "Missing required parameters" };
    }

    // Check if user can access this chat
    const canAccess = await canUserAccessChat(chatId, senderId);
    if (!canAccess) {
      return { success: false, error: "Access denied" };
    }

    const file = formData.get("image");
    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Image must be smaller than 5MB" };
    }

    // Upload to Vercel Blob
    const blob = await put(`chat-images/${chatId}/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    // Add message with image URL
    const result = await addMessageToChat(chatId, senderId, null, blob.url);

    if (result.success) {
      revalidatePath(`/chats/${chatId}`);
      revalidatePath("/chats");
    }

    return result;
  } catch (error) {
    console.error("Error in sendImageMessage action:", error);
    return { success: false, error: "Failed to send image" };
  }
}

// Get user's chats
export async function getUserChats(userId, page = 1) {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    return await getChatsByUserId(userId, page);
  } catch (error) {
    console.error("Error in getUserChats action:", error);
    return { success: false, error: "Failed to get chats" };
  }
}

// Get chat messages
export async function getMessages(chatId, userId, page = 1) {
  try {
    if (!chatId || !userId) {
      return { success: false, error: "Missing required parameters" };
    }

    // Check if user can access this chat
    const canAccess = await canUserAccessChat(chatId, userId);
    if (!canAccess) {
      return { success: false, error: "Access denied" };
    }

    return await getChatMessages(chatId, page);
  } catch (error) {
    console.error("Error in getMessages action:", error);
    return { success: false, error: "Failed to get messages" };
  }
}

// Get specific chat
export async function getChat(chatId, userId) {
  try {
    if (!chatId || !userId) {
      return { success: false, error: "Missing required parameters" };
    }

    // Check if user can access this chat
    const canAccess = await canUserAccessChat(chatId, userId);
    if (!canAccess) {
      return { success: false, error: "Access denied" };
    }

    return await getChatById(chatId);
  } catch (error) {
    console.error("Error in getChat action:", error);
    return { success: false, error: "Failed to get chat" };
  }
}

// Delete chat
export async function deleteUserChat(chatId, userId) {
  try {
    if (!chatId || !userId) {
      return { success: false, error: "Missing required parameters" };
    }

    // Check if user can access this chat
    const canAccess = await canUserAccessChat(chatId, userId);
    if (!canAccess) {
      return { success: false, error: "Access denied" };
    }

    const result = await deleteChat(chatId);

    if (result.success) {
      revalidatePath("/chats");
      revalidatePath(`/chats/${chatId}`);
    }

    return result;
  } catch (error) {
    console.error("Error in deleteUserChat action:", error);
    return { success: false, error: "Failed to delete chat" };
  }
}

// Mark messages as read
export async function markMessagesAsRead(chatId, userId) {
  try {
    if (!chatId || !userId) {
      return { success: false, error: "Missing required parameters" };
    }

    // This would typically update a last_read_at timestamp in the database
    // For now, we'll just return success as the unread count is calculated on the fly
    revalidatePath(`/chats/${chatId}`);
    revalidatePath("/chats");

    return { success: true };
  } catch (error) {
    console.error("Error in markMessagesAsRead action:", error);
    return { success: false, error: "Failed to mark messages as read" };
  }
}
