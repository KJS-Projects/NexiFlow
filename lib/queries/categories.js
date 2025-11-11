// lib/queries/categories.js
import { sql } from "@/lib/db";

// Get all categories with item counts
export async function getAllCategoriesWithCounts() {
  try {
    const result = await sql`
      SELECT 
        category as name,
        COUNT(*) as item_count,
        MIN(image_urls[1]) as image_url
      FROM items 
      WHERE status = 'active'
      GROUP BY category 
      ORDER BY item_count DESC
    `;

    // Enhance with emojis and descriptions
    const categoriesWithMetadata = result.map((category) => {
      const metadata = getCategoryMetadata(category.name);
      return {
        ...category,
        ...metadata,
        itemCount: parseInt(category.item_count),
        slug: getCategorySlug(category.name),
      };
    });

    return categoriesWithMetadata;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return getDefaultCategories();
  }
}

// Get items by category
export async function getItemsByCategory(categoryName) {
  try {
    const result = await sql`
      SELECT 
        id,
        title,
        description,
        price,
        original_price,
        location,
        condition,
        image_urls,
        user_id,
        user_name,
        created_at,
        updated_at
      FROM items 
      WHERE category = ${categoryName} 
        AND status = 'active'
      ORDER BY created_at DESC
    `;

    // Parse image URLs
    return result.map((item) => ({
      ...item,
      image_urls: parseImageUrls(item.image_urls),
    }));
  } catch (error) {
    console.error("Error fetching items by category:", error);
    return [];
  }
}

// Get popular categories (for sidebar or navigation)
export async function getPopularCategories(limit = 6) {
  try {
    const result = await sql`
      SELECT 
        category as name,
        COUNT(*) as item_count
      FROM items 
      WHERE status = 'active'
      GROUP BY category 
      ORDER BY item_count DESC
      LIMIT ${limit}
    `;

    return result.map((category) => ({
      name: category.name,
      itemCount: parseInt(category.item_count),
      ...getCategoryMetadata(category.name),
      slug: getCategorySlug(category.name),
    }));
  } catch (error) {
    console.error("Error fetching popular categories:", error);
    return getDefaultCategories().slice(0, limit);
  }
}

// Helper function to get category metadata
function getCategoryMetadata(categoryName) {
  const metadata = {
    Electronics: {
      emoji: "📱",
      description: "Smartphones, laptops, tablets, cameras, and all electronic gadgets",
    },
    Furniture: {
      emoji: "🛋️",
      description: "Home and office furniture including sofas, tables, chairs, and beds",
    },
    Fashion: {
      emoji: "👗",
      description: "Clothing, shoes, accessories, and fashion items for all seasons",
    },
    "Sports & Fitness": {
      emoji: "⚽",
      description: "Sports equipment, fitness gear, outdoor activities, and exercise machines",
    },
    "Books & Media": {
      emoji: "📚",
      description: "Books, magazines, movies, music, and educational materials",
    },
    Vehicles: {
      emoji: "🚗",
      description: "Cars, motorcycles, bicycles, and other personal transportation",
    },
    "Real Estate": {
      emoji: "🏠",
      description: "Properties, apartments, houses, and commercial spaces",
    },
    "Toys & Games": {
      emoji: "🎮",
      description: "Toys, video games, board games, and entertainment items",
    },
    "Home Appliances": {
      emoji: "🏠",
      description: "Kitchen appliances, home electronics, and household gadgets",
    },
    "Mobile Phones": {
      emoji: "📱",
      description: "Smartphones, feature phones, and mobile accessories",
    },
    "Laptops & Computers": {
      emoji: "💻",
      description: "Laptops, desktops, computer components, and IT equipment",
    },
    Other: {
      emoji: "📦",
      description: "Miscellaneous items and unique finds",
    },
  };

  return (
    metadata[categoryName] || {
      emoji: "📦",
      description: "Various items and products",
    }
  );
}

// Helper function to create slug
function getCategorySlug(category) {
  return category;
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

// Fallback categories if database fails
function getDefaultCategories() {
  return [
    {
      name: "Electronics",
      emoji: "📱",
      description: "Smartphones, laptops, tablets, cameras, and all electronic gadgets",
      itemCount: 0,
      slug: "electronics",
    },
    {
      name: "Furniture",
      emoji: "🛋️",
      description: "Home and office furniture including sofas, tables, chairs, and beds",
      itemCount: 0,
      slug: "furniture",
    },
    {
      name: "Fashion",
      emoji: "👗",
      description: "Clothing, shoes, accessories, and fashion items for all seasons",
      itemCount: 0,
      slug: "fashion",
    },
    {
      name: "Sports & Fitness",
      emoji: "⚽",
      description: "Sports equipment, fitness gear, outdoor activities, and exercise machines",
      itemCount: 0,
      slug: "sports-fitness",
    },
    {
      name: "Books & Media",
      emoji: "📚",
      description: "Books, magazines, movies, music, and educational materials",
      itemCount: 0,
      slug: "books-media",
    },
    {
      name: "Vehicles",
      emoji: "🚗",
      description: "Cars, motorcycles, bicycles, and other personal transportation",
      itemCount: 0,
      slug: "vehicles",
    },
  ];
}
