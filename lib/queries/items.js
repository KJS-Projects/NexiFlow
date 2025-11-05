// src/lib/queries/items.js
import { sql } from "@/lib/db";

// Ensure the table exists before any queries
async function ensureTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      item TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function getAllItems() {
  await ensureTableExists(); // Create table if missing
  const result = await sql`SELECT * FROM items ORDER BY created_at DESC`;
  return result;
}

export async function addItem(item) {
  await ensureTableExists(); // Ensure table exists before insert
  await sql`INSERT INTO items (item) VALUES (${item})`;
}
