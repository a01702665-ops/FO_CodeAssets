import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const designers = pgTable("designers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  isCurrentWinner: boolean("is_current_winner").default(false).notNull(),
  winReason: text("win_reason"),
  winDate: timestamp("win_date"),
});

export const insertDesignerSchema = createInsertSchema(designers).omit({ 
  id: true, 
  winDate: true 
});

export type Designer = typeof designers.$inferSelect;
export type InsertDesigner = z.infer<typeof insertDesignerSchema>;
export type UpdateDesignerRequest = Partial<InsertDesigner>;

export type DesignerResponse = Designer;
export type DesignersListResponse = Designer[];