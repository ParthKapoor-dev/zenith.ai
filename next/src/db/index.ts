import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema/_index";

const db_url = process.env.DATABASE_URL;

const poolConnection = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "jobverse_ai",
    password: 'Password@1234'
});

export const db = db_url
    ? drizzle(db_url, { schema: { ...schema }, mode: "default" })
    : drizzle({ client: poolConnection, schema: { ...schema }, mode: "default" });

