import { type Config } from 'drizzle-kit';

import { env } from '@/env';

export default {
	schema: './src/server/db/schema.ts',
	driver: 'pg',
	dbCredentials: {
		// connectionString: env.DATABASE_URL,

		host: env.DB_HOST,
		port: 5432,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_DATABASE,
		//#ts-ignore - ssl is not in the types
	},
	tablesFilter: ['dz_*'],
	out: './drizzle',
} satisfies Config;
