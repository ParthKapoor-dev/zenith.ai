import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema/_index.ts',
    dialect: 'mysql',
    dbCredentials: {
        host: '127.0.0.1',
        port: 3306,        
        user: 'root',
        password: 'rootpass',
        database: 'db',
        // url: process.env.DATABASE_URL!,
    },
});
