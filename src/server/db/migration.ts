import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import 'dotenv/config';
import postgres from 'postgres';
const sql = postgres(process.env.DB_URL!, { max: 1 });
const db = drizzle(sql);
async function migrateDb() {
	await migrate(db, { migrationsFolder: 'drizzle' });
	await sql.end();
}
migrateDb();
