// src/lib/queries/items.js
import { sql } from "@/lib/db";

// Ensure the table exists before any queries
async function ensureTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2),
      location TEXT NOT NULL,
      condition TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      image_urls TEXT[],
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

// Add this helper function to convert database array to JavaScript array
function parseImageUrls(imageUrls) {
  if (!imageUrls) return [];
  if (Array.isArray(imageUrls)) return imageUrls;

  // Handle PostgreSQL array format
  if (typeof imageUrls === "string") {
    try {
      // Remove curly braces and split by comma
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

// Update getAllItems and other functions similarly
export async function getAllItems() {
  await ensureTableExists();
  const result = await sql`
    SELECT 
      id,
      title,
      description,
      category,
      price,
      original_price,
      location,
      condition,
      contact_name,
      contact_phone,
      image_urls,
      status,
      created_at,
      updated_at
    FROM items 
    WHERE status = 'active'
    ORDER BY created_at DESC
  `;

  // Parse image URLs for all items
  return result.map((item) => ({
    ...item,
    image_urls: parseImageUrls(item.image_urls),
  }));
}

// Get paginated items with filters
export async function getPaginatedItems({
  page = 1,
  limit = 12,
  category = "",
  location = "",
  minPrice = "",
  maxPrice = "",
  search = "",
} = {}) {
  await ensureTableExists();

  const offset = (page - 1) * limit;

  // Build WHERE clause dynamically
  let whereClause = sql`WHERE status = 'active'`;
  const params = [];

  if (search) {
    whereClause = sql`${whereClause} AND (
      title ILIKE ${`%${search}%`} OR 
      description ILIKE ${`%${search}%`} OR 
      category ILIKE ${`%${search}%`}
    )`;
  }

  if (category) {
    whereClause = sql`${whereClause} AND category = ${category}`;
  }

  if (location) {
    whereClause = sql`${whereClause} AND location = ${location}`;
  }

  if (minPrice) {
    whereClause = sql`${whereClause} AND price >= ${parseFloat(minPrice)}`;
  }

  if (maxPrice) {
    whereClause = sql`${whereClause} AND price <= ${parseFloat(maxPrice)}`;
  }

  // Get items for current page
  const itemsResult = await sql`
    SELECT 
      id,
      title,
      description,
      category,
      price,
      original_price,
      location,
      condition,
      contact_name,
      contact_phone,
      image_urls,
      created_at
    FROM items 
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  // Get total count for pagination
  const countResult = await sql`
    SELECT COUNT(*) as total_count 
    FROM items 
    ${whereClause}
  `;

  const totalCount = parseInt(countResult[0].total_count);
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Parse image URLs
  const items = itemsResult.map((item) => ({
    ...item,
    image_urls: parseImageUrls(item.image_urls),
  }));

  return {
    items,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage,
      hasPrevPage,
      limit,
    },
  };
}

export async function addItem(itemData) {
  await ensureTableExists();

  const { title, description, category, price, originalPrice, location, condition, contactName, contactPhone, imageUrls } = itemData;

  const result = await sql`
    INSERT INTO items (
      title,
      description,
      category,
      price,
      original_price,
      location,
      condition,
      contact_name,
      contact_phone,
      image_urls
    ) VALUES (
      ${title},
      ${description},
      ${category},
      ${price},
      ${originalPrice || null},
      ${location},
      ${condition},
      ${contactName},
      ${contactPhone},
      ${imageUrls}
    )
    RETURNING *
  `;

  return result[0];
}

export async function getItemById(id) {
  await ensureTableExists();
  const result = await sql`
    SELECT * FROM items WHERE id = ${id} AND status = 'active'
  `;

  if (result[0]) {
    // Parse image URLs from database format
    result[0].image_urls = parseImageUrls(result[0].image_urls);
  }

  return result[0] || null;
}

export async function updateItemStatus(id, status) {
  await ensureTableExists();
  await sql`
    UPDATE items 
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;
}

export async function getItemsByCategory(category) {
  await ensureTableExists();
  const result = await sql`
    SELECT * FROM items 
    WHERE category = ${category} AND status = 'active'
    ORDER BY created_at DESC
  `;
  return result;
}

export async function searchItems(query) {
  await ensureTableExists();
  const result = await sql`
    SELECT * FROM items 
    WHERE (
      title ILIKE ${`%${query}%`} OR 
      description ILIKE ${`%${query}%`} OR
      category ILIKE ${`%${query}%`}
    ) AND status = 'active'
    ORDER BY created_at DESC
  `;
  return result;
}
