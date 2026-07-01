import { neon } from "@neondatabase/serverless";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.warn("[Database] Warning: DATABASE_URL is not set.");
}

export const sql = neon(dbUrl || "");

let tablesEnsured = false;

// Simple table initialization to ensure tables exist in Neon PostgreSQL
export async function ensureTables() {
  if (tablesEnsured) return;

  try {
    // 1. Registrations table
    await sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        contact VARCHAR(60),
        selected_competitions TEXT[] NOT NULL,
        offer_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
        offer_amount INTEGER NOT NULL DEFAULT 1499,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Event Ideas table
    await sql`
      CREATE TABLE IF NOT EXISTS event_ideas (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        idea TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. User Roles table
    await sql`
      CREATE TABLE IF NOT EXISTS user_roles (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    tablesEnsured = true;
    console.log("[Database] Neon database tables verified/created successfully.");
  } catch (error) {
    console.error("[Database] Error ensuring database tables exist:", error);
    // Don't swallow the error so server functions know connection failed
    throw error;
  }
}
