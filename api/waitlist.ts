import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase (Admin Mode)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // IMPORTANT: Use Service Role Key here!
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS Headers (Allows your frontend to talk to this)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ---------------------------------------------------------
  // GET Request: Return the Count (For the progress bar)
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

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // A. Save to Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      // Handle "Duplicate Email" error gracefully
      if (error.code === '23505') {
        return res.status(400).json({ message: "You are already on the waitlist!" });
      }
      console.error("Supabase Error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    // B. Get updated count for the email
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const position = count || 1;

    // C. Send Email (Fire and forget - don't wait for it)
    sendWelcomeEmail(email, position);

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
      subject: "Welcome to Vendra!",
      html: `
        <h1>Welcome to Vendra!</h1>
        <p>You are #${position} on the list.</p>
        <p><strong>${earlyBirdPerks}</strong></p>
        <p>We will update you when we launch in Q1 2026.</p>
      `
    });
  } catch (err) {
    console.error("Email failed:", err);
  }
}