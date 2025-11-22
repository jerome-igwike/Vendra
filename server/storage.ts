import { waitlist, type Waitlist, type InsertWaitlist } from "@shared/schema";
import { db } from "./db";
import { eq, count } from "drizzle-orm";

export interface IStorage {
  addToWaitlist(email: InsertWaitlist): Promise<Waitlist>;
  getWaitlistCount(): Promise<number>;
  getAllWaitlistEmails(): Promise<Waitlist[]>;
  isEmailInWaitlist(email: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async addToWaitlist(insertWaitlist: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await db
      .insert(waitlist)
      .values(insertWaitlist)
      .returning();
    return entry;
  }

  async getWaitlistCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(waitlist);
    return result[0]?.count || 0;
  }

  async getAllWaitlistEmails(): Promise<Waitlist[]> {
    return db.select().from(waitlist).orderBy(waitlist.createdAt);
  }

  async isEmailInWaitlist(email: string): Promise<boolean> {
    const [entry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email));
    return !!entry;
  }
}

export const storage = new DatabaseStorage();
