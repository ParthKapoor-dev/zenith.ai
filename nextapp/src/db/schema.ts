import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const Users = mysqlTable('users', {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role : mysqlEnum(['recruiter' , 'candidate']).notNull()
});

const schema =  {
    Users
}
export default schema;