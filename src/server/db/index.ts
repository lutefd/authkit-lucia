/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
	drizzle as drizzlePg,
	type NodePgDatabase,
} from 'drizzle-orm/node-postgres';

import postgres from 'postgres';
import { env } from '@/env';

import * as myschema from './schema';
import { Pool } from 'pg';

export interface Global {
	cachedDbPromise: PostgresJsDatabase<typeof myschema> | null;
}

async function connectToDatabase() {
	if ((globalThis as any).cachedDbPromise) {
		return (globalThis as any).cachedDbPromise as PostgresJsDatabase<
			typeof myschema
		>;
	}
	const client = postgres({
		host: env.DB_HOST,
		username: env.DB_USER,
		port: 5432,
		password: env.DB_PASSWORD,
		database: env.DB_DATABASE,
	});
	(globalThis as any).cachedDbPromise = drizzle(client, {
		schema: myschema,
		logger: true,
	});
	return (globalThis as any).cachedDbPromise as PostgresJsDatabase<
		typeof myschema
	>;
}

const authQueryClient = new Pool({
	host: env.DB_HOST,
	user: env.DB_USER,
	port: 5432,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE,
});

export const authDb = drizzlePg(authQueryClient, {
	schema: myschema,
	logger: true,
});

export const dbPromise = connectToDatabase();
