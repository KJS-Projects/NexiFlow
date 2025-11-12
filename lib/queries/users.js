// lib/queries/users.js
import { sql } from "@/lib/db";

// Ensure the users table exists
async function ensureUsersTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firebase_uid TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

// Get all users
export async function getAllUsers() {
  await ensureUsersTableExists();

  try {
    const result = await sql`
      SELECT 
        id,
        firebase_uid,
        email,
        display_name,
        role,
        status,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `;

    return result;
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
}

// Create or update user (call this when a user signs up)
export async function createOrUpdateUser(userData) {
  await ensureUsersTableExists();

  const { firebase_uid, email, display_name } = userData;

  try {
    const result = await sql`
      INSERT INTO users (firebase_uid, email, display_name)
      VALUES (${firebase_uid}, ${email}, ${display_name})
      ON CONFLICT (firebase_uid) 
      DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

// Update user role
export async function updateUserRole(userId, role) {
  await ensureUsersTableExists();

  const validRoles = ["user", "moderator", "admin"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  try {
    await sql`
      UPDATE users 
      SET role = ${role}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

// Delete user from database (soft delete)
export async function deleteUser(userId) {
  await ensureUsersTableExists();

  try {
    await sql`
      UPDATE users 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Get user by Firebase UID
export async function getUserByFirebaseUid(firebaseUid) {
  await ensureUsersTableExists();

  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE firebase_uid = ${firebaseUid} AND status != 'deleted'
    `;

    return result[0] || null;
  } catch (error) {
    console.error("Error getting user by Firebase UID:", error);
    return null;
  }
}

// Get user by ID
export async function getUserById(userId) {
  await ensureUsersTableExists();

  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE id = ${userId} AND status != 'deleted'
    `;

    return result[0] || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}
