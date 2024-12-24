import { relations } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

const timestamps = {
    updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
};

// Users Table
export const Users = mysqlTable('users', {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: mysqlEnum(['recruiter', 'candidate']).notNull(),
    image: varchar({ length: 1000 }),
    ...timestamps,
});
export const UsersRelations = relations(Users, ({ one, many }) => ({
    candidate: one(Candidates),
    sessions: many(ChatSessions)
}));


// Candidate Table
export const Candidates = mysqlTable('candidates', {
    userId: int().primaryKey().references(() => Users.id),
    resume: varchar({ length: 1000 }).notNull(),
    ...timestamps,
});
export const CandidateRelations = relations(Candidates, ({ one }) => ({
    user: one(Users, { fields: [Candidates.userId], references: [Users.id] }),
}));


//Recruiter Chat Session Table
export const ChatSessions = mysqlTable('chatSessions', {
    id : int().primaryKey().autoincrement(),
    userId: int().references(() => Users.id).notNull(),
    title: varchar({ length: 255 }).notNull(),
    ...timestamps
})
export const ChatSessionRelations = relations(ChatSessions, ({ one, many }) => ({
    user: one(Users, { fields: [ChatSessions.userId], references: [Users.id] }),
    chatInputs: many(ChatInputs),
    chatResponses: many(ChatResponses)
}))

//Recruiter User Inputs Table
export const ChatInputs = mysqlTable('chatInputs', {
    id: int().primaryKey().autoincrement(),
    sessionId: int().references(() => ChatSessions.id).notNull(),
    input: varchar({ length: 1000 }).notNull(),
    ...timestamps
})
export const ChatInputsRelations = relations(ChatInputs, ({ one }) => ({
    session: one(ChatSessions,
        { fields: [ChatInputs.sessionId], references: [ChatSessions.id] })
}))

// Recruiter ChatBot Responses Table
export const ChatResponses = mysqlTable('chatResponses', {
    id: int().primaryKey().autoincrement(),
    sessionId: int().references(() => ChatSessions.id).notNull(),
    response: varchar({ length: 1000 }).notNull(),
    ...timestamps
})
export const ChatResponsesRelations = relations(ChatResponses, ({ one }) => ({
    session: one(ChatSessions,
        { fields: [ChatResponses.sessionId], references: [ChatSessions.id] })
}))

const schema = {
    Users,
    Candidates,
    ChatSessions,
    ChatInputs,
    ChatResponses
};
export default schema;
