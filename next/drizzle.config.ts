import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema/_index.ts',
    dialect: 'mysql',
    dbCredentials: {
        host: "localhost",
        user: "root",
        database: "jobverse_ai",
        password: 'Password@1234',
        // url: process.env.DATABASE_URL!,
    },
});
