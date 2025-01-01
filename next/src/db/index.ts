import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema/_index";

const db_url = process.env.DATABASE_URL;

const poolConnection = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'rootpass',
    database: 'jobversedb'
});

export const db = db_url
    ? drizzle(db_url, { schema: { ...schema }, mode: "default" })
    : drizzle({ client: poolConnection, schema: { ...schema }, mode: "default" });

