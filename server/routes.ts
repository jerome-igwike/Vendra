import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { sendWelcomeEmail } from "./resend";

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

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/waitlist", async (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        message: "Too many requests. Please try again in a minute." 
      });
    }
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      
      const exists = await storage.isEmailInWaitlist(validatedData.email);
      if (exists) {
        return res.status(400).json({ 
          message: "This email is already on the waitlist" 
        });
      }

      const entry = await storage.addToWaitlist(validatedData);
      const count = await storage.getWaitlistCount();
      
      try {
        await sendWelcomeEmail(validatedData.email, count);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      res.json({ 
        success: true, 
        entry,
        position: count 
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ 
          message: error.errors[0]?.message || "Invalid email address" 
        });
      }
      res.status(500).json({ 
        message: "Failed to join waitlist. Please try again." 
      });
    }
  });

  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve count" });
    }
  });

  // Admin endpoint - removed for security. Use database admin panel to view waitlist.

  const httpServer = createServer(app);
  return httpServer;
}
