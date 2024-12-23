import { relations } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

const timestamps = {
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
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
export const UsersRelations = relations(Users, ({ one }) => ({
    candidate: one(Candidate),
}));


// Candidate Table
export const Candidate = mysqlTable('candidates', {
    userId: int().primaryKey().references(() => Users.id),
    resume: varchar({ length: 1000 }).notNull(),
    ...timestamps,
});
export const CandidateRelations = relations(Candidate, ({ one }) => ({
    user: one(Users, { fields: [Candidate.userId], references: [Users.id] }),
}));

const schema = {
    Users,
    Candidate,
};
export default schema;
