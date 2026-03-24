import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Types for interview data (frontend only, no DB needed)

export type Difficulty = "Easy" | "Medium" | "Hard";

export type TopicCategory =
  | "Collections"
  | "JVM"
  | "Concurrency"
  | "Spring Boot"
  | "Microservices"
  | "Database Design"
  | "System Design"
  | "AI/ML Systems";

export interface TopicQuestion {
  id: string;
  topic: TopicCategory;
  difficulty: Difficulty;
  question: string;
  keyPoints: string[];
  sampleAnswer: string;
}

export interface CodingPrompt {
  id: string;
  topic: TopicCategory;
  difficulty: Difficulty;
  title: string;
  description: string;
  constraints: string[];
  starterCode: string;
  hints: string[];
}

export interface FollowUp {
  id: string;
  topic: TopicCategory;
  scenario: string;
  initialQuestion: string;
  followUps: {
    question: string;
    expectation: string;
  }[];
}
