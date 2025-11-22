import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase (Admin Mode)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ---------------------------------------------------------
  // GET Request: Return the Count
  // ---------------------------------------------------------
  if (req.method === 'GET') {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ count: count || 0 });
  }

  // ---------------------------------------------------------
  // POST Request: Join the Waitlist
  // ---------------------------------------------------------
  if (req.method === 'POST') {
    const { email } = req.body;

    // --- NEW: STRICTER VALIDATION ---
    // This regex requires: text + @ + text + . + text (at least 2 chars)
    // e.g. "bob" -> Fail. "bob@" -> Fail. "bob@gmail" -> Fail. "bob@gmail.com" -> Pass.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address (e.g. you@company.com)" });
    }
    // --------------------------------

    // A. Save to Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: "You are already on the waitlist!" });
      }
      console.error("Supabase Error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    // B. Get updated count
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });
    
    const position = count || 1;

    // C. Send Welcome Email
    await sendWelcomeEmail(email, position);

    return res.status(200).json({ 
      success: true, 
      entry: data,
      position: position
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

// --- Helper Function: Send Email ---
async function sendWelcomeEmail(email: string, position: number) {
  try {
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
            <style>
              body { font-family: sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .btn { display: inline-block; padding: 12px 24px; background-color: #00A651; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to the Vendra Waitlist!</h1>
              <p>You have successfully secured your spot.</p>
              
              <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px;"><strong>Your Position: #${position}</strong></p>
              </div>

              <p>${earlyBirdPerks}</p>
              
              <p>We are building the trust layer for African social commerce. We'll keep you posted on our progress towards the Q1 2026 launch.</p>
              
              <p>Cheers,<br>The Vendra Team</p>
            </div>
          </body>
        </html>
      `
    });
  } catch (err) {
    console.error("Email failed:", err);
  }
}