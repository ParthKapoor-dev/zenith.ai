import {
  int,
  json,
  mysqlTable,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { timestamps } from "./timestamp";
import { Users } from "./user";
import { Candidates } from "./candidate";

//Recruiter Chat Session Table
export const ChatSessions = mysqlTable("chat_sessions", {
  id: int().primaryKey().autoincrement(),
  userId: int()
    .references(() => Users.id)
    .notNull(),
  title: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const StructuredQuery = mysqlTable("structured_query", {
  sessionId: int()
    .primaryKey()
    .references(() => ChatSessions.id),
  preferred_skills: json().$type<string[]>(),
  experience_level: varchar({ length: 255 }),
  salary_expectations: varchar({ length: 255 }),
  employment_type: varchar({ length: 255 }),
  current_job_status: varchar({ length: 255 }),
  job_responsibilities: varchar({ length: 255 }),
  query: text(),
});

//Recruiter User Inputs Table
export const ChatInputs = mysqlTable("chat_inputs", {
  id: int().primaryKey().autoincrement(),
  sessionId: int()
    .references(() => ChatSessions.id)
    .notNull(),
  input: text().notNull(),
  ...timestamps,
});

// Recruiter ChatBot Responses Table
export const ChatResponses = mysqlTable("chat_responses", {
  id: int().primaryKey().autoincrement(),
  sessionId: int()
    .references(() => ChatSessions.id)
    .notNull(),
  response: text().notNull(),
  ...timestamps,
});

// Recruiter Chatbot RankedList Table
export const RankedLists = mysqlTable("ranked_lists", {
  id: int().primaryKey().autoincrement(),
  sessionId: int()
    .notNull()
    .references(() => ChatSessions.id),
  ...timestamps,
});

// Recruiter ChatBot RankedCandidates Table
export const RankedCandidates = mysqlTable(
  "ranked_candidates",
  {
    candidateId: int()
      .notNull()
      .references(() => Candidates.userId),
    listId: int()
      .notNull()
      .references(() => RankedLists.id),
    score: int().notNull(),
  },
  (table) => [primaryKey({ columns: [table.listId, table.candidateId] })],
);
