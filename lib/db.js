// src/lib/db.js
import { neon } from "@neondatabase/serverless";

// Initialize the Neon client only once per module
// The DATABASE_URL should be defined in your environment variables (.env.local)
export const sql = neon(process.env.DATABASE_URL);
