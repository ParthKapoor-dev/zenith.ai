import { relations } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { timestamps } from './timestamp';
import { userRoles } from './enum';

// Users Table
export const Users = mysqlTable('users', {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: mysqlEnum([...userRoles]).notNull(),
    image: varchar({ length: 1000 }),
    ...timestamps,
});
