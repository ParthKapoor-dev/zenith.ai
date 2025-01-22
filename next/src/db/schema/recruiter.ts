import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './timestamp';
import { Users } from './user';

//Recruiter Chat Session Table
export const ChatSessions = mysqlTable('chat_sessions', {
    id: int().primaryKey().autoincrement(),
    userId: int().references(() => Users.id).notNull(),
    title: varchar({ length: 255 }).notNull(),
    ...timestamps
})

//Recruiter User Inputs Table
export const ChatInputs = mysqlTable('chat_inputs', {
    id: int().primaryKey().autoincrement(),
    sessionId: int().references(() => ChatSessions.id).notNull(),
    input: text().notNull(),
    ...timestamps
})

// Recruiter ChatBot Responses Table
export const ChatResponses = mysqlTable('chat_responses', {
    id: int().primaryKey().autoincrement(),
    sessionId: int().references(() => ChatSessions.id).notNull(),
    response: text().notNull(),
    ...timestamps
})
