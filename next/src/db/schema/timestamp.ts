import { timestamp } from 'drizzle-orm/mysql-core';

export const timestamps = {
    updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
};