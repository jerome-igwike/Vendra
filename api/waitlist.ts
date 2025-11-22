import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, count, sql } from 'drizzle-orm';
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Resend } from 'resend';

neonConfig.webSocketConstructor = require('ws');

// --- INLINED SCHEMA (Fixes Import Error) ---
const waitlist = pgTable("waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});
// -------------------------------------------

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { waitlist } });

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= 3) {
    return false;
  }
  
  limit.count++;
  return true;
}

async function sendWelcomeEmail(email: string, position: number) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return;
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Vendra <hello@vendra.ng>';
    
    const earlyBirdPerks = position <= 100 
      ? "You're in the first 100! You've earned 3 months of Pro tier FREE when we launch."
      : "Thank you for joining! We'll keep you updated on our launch progress.";

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: position <= 100 ? "You're in the First 100! - Vendra Waitlist" : "Welcome to Vendra!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Inter, sans-serif; line-height: 1.6; color: #1a1a1a; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #00A651 0%, #33C47F 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-radius: 8px; margin-top: 20px; }
              .highlight { background: #FFF8E7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00A651; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; }
              .stats { display: flex; gap: 20px; margin: 20px 0; }
              .stat { flex: 1; text-align: center; padding: 15px; background: #f5f5f5; border-radius: 6px; }
              .stat-number { font-size: 24px; font-weight: bold; color: #00A651; }
              .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">Welcome to Vendra</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Africa's Trust Layer for Social Commerce</p>
              </div>
              
              <div class="content">
                <h2>Hey there!</h2>
                <p>Thank you for joining the Vendra waitlist. You're among the first to build trust in Nigeria's social commerce ecosystem.</p>
                
                <div class="highlight">
                  <strong>${earlyBirdPerks}</strong>
                </div>

                <h3>What You Get:</h3>
                <ul>
                  <li><strong>Escrow Protection</strong> - Payments held securely until delivery confirmed</li>
                  <li><strong>Automated Logistics</strong> - One-click Kwik delivery booking</li>
                  <li><strong>WhatsApp Updates</strong> - Automatic tracking notifications</li>
                  <li><strong>Professional Links</strong> - Share payment links on Instagram & WhatsApp</li>
                </ul>

                <div class="stats">
                  <div class="stat">
                    <div class="stat-number">${position}</div>
                    <div class="stat-label">Your Position</div>
                  </div>
                  <div class="stat">
                    <div class="stat-number">Q1 2026</div>
                    <div class="stat-label">Launch Date</div>
                  </div>
                  <div class="stat">
                    <div class="stat-number">6-9%</div>
                    <div class="stat-label">Platform Fee</div>
                  </div>
                </div>

                <h3>What Happens Next?</h3>
                <ol>
                  <li>We're building the MVP (you'll get updates)</li>
                  <li>Beta testing starts January 2026</li>
                  <li>Full launch Q1 2026</li>
                  <li>First 100 get 3 months Pro tier FREE</li>
                </ol>

                <p>Have questions? Just reply to this email. We read every message.</p>

                <p style="margin-top: 30px;">
                  <strong>— The Vendra Team</strong><br>
                  <span style="color: #666;">Built by Devlix.inc • Lagos, Nigeria</span>
                </p>
              </div>

              <div class="footer">
                <p>You're receiving this because you joined our waitlist at vendra.ng</p>
                <p style="color: #999; font-size: 12px;">Vendra © 2025 • hello@vendra.ng</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const clientIp = req.headers['x-forwarded-for']?.toString() || 
                     req.headers['x-real-ip']?.toString() || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        message: "Too many requests. Please try again in a minute." 
      });
    }

    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      
      const [existing] = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, validatedData.email));

      if (existing) {
        return res.status(400).json({ 
          message: "This email is already on the waitlist" 
        });
      }

      const [entry] = await db
        .insert(waitlist)
        .values(validatedData)
        .returning();

      const result = await db.select({ count: count() }).from(waitlist);
      const waitlistCount = result[0]?.count || 0;
      
      try {
        await sendWelcomeEmail(validatedData.email, waitlistCount);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      return res.json({ 
        success: true, 
        entry,
        position: waitlistCount 
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ 
          message: error.errors[0]?.message || "Invalid email address" 
        });
      }
      console.error('Waitlist error:', error);
      return res.status(500).json({ 
        message: "Failed to join waitlist. Please try again." 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}