import { db } from "./db";
import { 
  designers,
  type Designer,
  type InsertDesigner,
  type UpdateDesignerRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getDesigners(): Promise<Designer[]>;
  getDesigner(id: number): Promise<Designer | undefined>;
  getWinner(): Promise<Designer | undefined>;
  createDesigner(designer: InsertDesigner): Promise<Designer>;
  updateDesigner(id: number, updates: UpdateDesignerRequest): Promise<Designer>;
  awardDesigner(id: number, reason?: string): Promise<Designer>;
  removeAward(id: number): Promise<Designer>;
  deleteDesigner(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getDesigners(): Promise<Designer[]> {
    return await db.select().from(designers).orderBy(desc(designers.id));
  }

  async getDesigner(id: number): Promise<Designer | undefined> {
    const [designer] = await db.select().from(designers).where(eq(designers.id, id));
    return designer;
  }

  async getWinner(): Promise<Designer | undefined> {
    const [winner] = await db.select().from(designers).where(eq(designers.isCurrentWinner, true));
    return winner;
  }

  async createDesigner(insertDesigner: InsertDesigner): Promise<Designer> {
    const [designer] = await db.insert(designers).values(insertDesigner).returning();
    return designer;
  }

  async updateDesigner(id: number, updates: UpdateDesignerRequest): Promise<Designer> {
    const [updated] = await db.update(designers)
      .set(updates)
      .where(eq(designers.id, id))
      .returning();
    return updated;
  }

  async awardDesigner(id: number, reason?: string): Promise<Designer> {
    // Count current winners
    const winners = await db.select().from(designers).where(eq(designers.isCurrentWinner, true));
    
    if (winners.length >= 3) {
      // Remove the oldest winner if we already have 3
      const oldestWinner = winners.sort((a, b) => {
        const dateA = a.winDate ? new Date(a.winDate).getTime() : 0;
        const dateB = b.winDate ? new Date(b.winDate).getTime() : 0;
        return dateA - dateB;
      })[0];
      
      await db.update(designers)
        .set({ isCurrentWinner: false, winReason: null, winDate: null })
        .where(eq(designers.id, oldestWinner.id));
    }
    
    // Set the new winner
    const [winner] = await db.update(designers)
      .set({ 
        isCurrentWinner: true, 
        winReason: reason || null, 
        winDate: new Date() 
      })
      .where(eq(designers.id, id))
      .returning();
    return winner;
  }

  async removeAward(id: number): Promise<Designer> {
    const [updated] = await db.update(designers)
      .set({ isCurrentWinner: false, winReason: null, winDate: null })
      .where(eq(designers.id, id))
      .returning();
    return updated;
  }

  async deleteDesigner(id: number): Promise<void> {
    await db.delete(designers).where(eq(designers.id, id));
  }
}

export const storage = new DatabaseStorage();