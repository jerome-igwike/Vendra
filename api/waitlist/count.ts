import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { count, sql } from 'drizzle-orm';
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

neonConfig.webSocketConstructor = require('ws');

// --- INLINED SCHEMA ---
const waitlist = pgTable("waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
// ----------------------

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { waitlist } });

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const result = await db.select({ count: count() }).from(waitlist);
      const waitlistCount = result[0]?.count || 0;
      return res.json({ count: waitlistCount });
    } catch (error) {
      console.error('Count error:', error);
      return res.status(500).json({ message: "Failed to retrieve count" });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}