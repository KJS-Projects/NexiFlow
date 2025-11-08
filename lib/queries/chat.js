// src/lib/queries/chats.js
import { sql } from "@/lib/db";

// Ensure the chats and chat_messages tables exist
async function ensureTablesExist() {
  // Create chats table
  await sql`
    CREATE TABLE IF NOT EXISTS chats (
      id SERIAL PRIMARY KEY,
      item_id INTEGER NOT NULL,
      buyer_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      -- Foreign key constraints
      CONSTRAINT fk_item
        FOREIGN KEY(item_id) 
        REFERENCES items(id)
        ON DELETE CASCADE,
      
      -- Ensure only one chat per buyer-item combination
      UNIQUE(item_id, buyer_id)
    )
  `;

  // Create chat_messages table
  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      chat_id INTEGER NOT NULL,
      sender_id TEXT NOT NULL,
      message_text TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      -- Foreign key constraint
      CONSTRAINT fk_chat
        FOREIGN KEY(chat_id) 
        REFERENCES chats(id)
        ON DELETE CASCADE
    )
  `;

  // Create indexes for faster queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_chats_item_id 
    ON chats(item_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chats_buyer_id 
    ON chats(buyer_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chats_seller_id 
    ON chats(seller_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id 
    ON chat_messages(chat_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at 
    ON chat_messages(created_at)
  `;
}

// Create or get existing chat
export async function createOrGetChat(itemId, buyerId, sellerId) {
  await ensureTablesExist();

  try {
    // Try to get existing chat first
    const existingChat = await sql`
      SELECT * FROM chats 
      WHERE item_id = ${itemId} AND buyer_id = ${buyerId}
      LIMIT 1
    `;

    if (existingChat.length > 0) {
      return { success: true, chat: existingChat[0], isNew: false };
    }

    // Create new chat
    const result = await sql`
      INSERT INTO chats (item_id, buyer_id, seller_id)
      VALUES (${itemId}, ${buyerId}, ${sellerId})
      RETURNING *
    `;

    return { success: true, chat: result[0], isNew: true };
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    return { success: false, error: "Failed to create/get chat" };
  }
}

// Get chat by ID
export async function getChatById(chatId) {
  await ensureTablesExist();

  try {
    const result = await sql`
      SELECT 
        c.*,
        i.title as item_title,
        i.price as item_price,
        i.image_urls as item_images,
        i.user_id as item_owner_id
      FROM chats c
      INNER JOIN items i ON c.item_id = i.id
      WHERE c.id = ${chatId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return { success: false, error: "Chat not found" };
    }

    const chat = result[0];
    // Parse item images
    chat.item_images = parseImageUrls(chat.item_images);

    return { success: true, chat };
  } catch (error) {
    console.error("Error getting chat:", error);
    return { success: false, error: "Failed to get chat" };
  }
}

// Get all chats for a user
export async function getChatsByUserId(userId, page = 1, limit = 20) {
  await ensureTablesExist();

  const offset = (page - 1) * limit;

  try {
    const chatsResult = await sql`
      SELECT 
        c.*,
        i.title as item_title,
        i.price as item_price,
        i.image_urls as item_images,
        i.user_id as item_owner_id,
        (
          SELECT message_text 
          FROM chat_messages 
          WHERE chat_id = c.id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT created_at 
          FROM chat_messages 
          WHERE chat_id = c.id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message_at
      FROM chats c
      INNER JOIN items i ON c.item_id = i.id
      WHERE c.buyer_id = ${userId} OR c.seller_id = ${userId}
      ORDER BY c.updated_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as total_count
      FROM chats
      WHERE buyer_id = ${userId} OR seller_id = ${userId}
    `;

    const totalCount = parseInt(countResult[0].total_count);
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Parse item images for each chat
    const chats = chatsResult.map((chat) => ({
      ...chat,
      item_images: parseImageUrls(chat.item_images),
    }));

    return {
      chats,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    };
  } catch (error) {
    console.error("Error getting user chats:", error);
    return { chats: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false, limit } };
  }
}

// Add message to chat
export async function addMessageToChat(chatId, senderId, messageText = null, imageUrl = null) {
  await ensureTablesExist();

  try {
    // Validate that either message text or image URL is provided
    if (!messageText && !imageUrl) {
      return { success: false, error: "Either message text or image URL is required" };
    }

    const result = await sql`
      INSERT INTO chat_messages (chat_id, sender_id, message_text, image_url)
      VALUES (${chatId}, ${senderId}, ${messageText}, ${imageUrl})
      RETURNING *
    `;

    // Update chat's updated_at timestamp
    await sql`
      UPDATE chats 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${chatId}
    `;

    return { success: true, message: result[0] };
  } catch (error) {
    console.error("Error adding message to chat:", error);
    return { success: false, error: "Failed to send message" };
  }
}

// Get messages for a chat
export async function getChatMessages(chatId, page = 1, limit = 50) {
  await ensureTablesExist();

  const offset = (page - 1) * limit;

  try {
    const messagesResult = await sql`
      SELECT * FROM chat_messages 
      WHERE chat_id = ${chatId}
      ORDER BY created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as total_count
      FROM chat_messages
      WHERE chat_id = ${chatId}
    `;

    const totalCount = parseInt(countResult[0].total_count);
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      messages: messagesResult,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    };
  } catch (error) {
    console.error("Error getting chat messages:", error);
    return { messages: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNextPage: false, hasPrevPage: false, limit } };
  }
}

// Check if user can access a chat
export async function canUserAccessChat(chatId, userId) {
  await ensureTablesExist();

  try {
    const result = await sql`
      SELECT id FROM chats 
      WHERE id = ${chatId} AND (buyer_id = ${userId} OR seller_id = ${userId})
      LIMIT 1
    `;

    return result.length > 0;
  } catch (error) {
    console.error("Error checking chat access:", error);
    return false;
  }
}

// Get unread message count for a user in a chat
export async function getUnreadMessageCount(chatId, userId, lastReadAt) {
  await ensureTablesExist();

  try {
    const result = await sql`
      SELECT COUNT(*) as unread_count
      FROM chat_messages
      WHERE chat_id = ${chatId} 
        AND sender_id != ${userId}
        AND created_at > ${lastReadAt}
    `;

    return parseInt(result[0].unread_count);
  } catch (error) {
    console.error("Error getting unread message count:", error);
    return 0;
  }
}

// Delete chat and all messages
export async function deleteChat(chatId) {
  await ensureTablesExist();

  try {
    // This will cascade delete all messages due to foreign key constraint
    const result = await sql`
      DELETE FROM chats 
      WHERE id = ${chatId}
      RETURNING *
    `;

    if (result.length === 0) {
      return { success: false, error: "Chat not found" };
    }

    return { success: true, deletedChat: result[0] };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { success: false, error: "Failed to delete chat" };
  }
}

// Helper function to parse image URLs
function parseImageUrls(imageUrls) {
  if (!imageUrls) return [];
  if (Array.isArray(imageUrls)) return imageUrls;

  if (typeof imageUrls === "string") {
    try {
      return imageUrls
        .replace(/[{}]/g, "")
        .split(",")
        .filter((url) => url.trim());
    } catch (error) {
      console.error("Error parsing image URLs:", error);
      return [];
    }
  }

  return [];
}
