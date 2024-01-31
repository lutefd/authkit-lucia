/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
	drizzle as drizzlePg,
	type NodePgDatabase,
} from 'drizzle-orm/node-postgres';

import postgres from 'postgres';

// import { Client } from 'pg';
import { env } from '@/env';

import * as myschema from './schema';
import { Pool } from 'pg';

export interface Global {
	cachedDbPromise: PostgresJsDatabase<typeof myschema> | null;
}

async function connectToDatabase() {
	if ((globalThis as any).cachedDbPromise) {
		console.log('using cached db');
		return (globalThis as any).cachedDbPromise as PostgresJsDatabase<
			typeof myschema
		>;
	}
	console.log('connecting to db');
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

// NODE POSTGRES

// import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
// import { Client } from 'pg';
// import { env } from '@/env';

// import * as myschema from './schema';

// export interface Global {
// 	cachedDbPromise: NodePgDatabase<typeof myschema> | null;
// }

// console.log('globalThis db conn', (globalThis as any).cachedDbPromise);
// async function connectToDatabase() {
// 	if ((globalThis as any).cachedDbPromise) {
// 		console.log('using cached db');
// 		return (globalThis as any).cachedDbPromise as NodePgDatabase<
// 			typeof myschema
// 		>;
// 	}
// 	console.log('connecting to db');
// 	const client = new Client({
// 		host: env.DB_HOST,
// 		user: env.DB_USER,
// 		port: 5432,
// 		password: env.DB_PASSWORD,
// 		database: env.DB_DATABASE,
// 	});
// 	await client.connect();
// 	(globalThis as any).cachedDbPromise = drizzle(client, {
// 		schema: myschema,
// 	});
// 	return (globalThis as any).cachedDbPromise as NodePgDatabase<
// 		typeof myschema
// 	>;
// }

// export const dbPromise = connectToDatabase();

// RDS DATA API

// import {
//   type AwsDataApiPgDatabase,
//   drizzle,
// } from "drizzle-orm/aws-data-api/pg";
// import { RDSDataClient } from "@aws-sdk/client-rds-data";
// import * as myschema from "./schema";
// import { env } from "@/env";

// export interface Global {
//   cachedDbPromise: AwsDataApiPgDatabase<typeof myschema> | null;
// }

// console.log("globalThis db conn", (globalThis as any).cachedDbPromise);
// async function connectToDatabase() {
//   if ((globalThis as any).cachedDbPromise) {
//     console.log("using cached db");
//     return (globalThis as any).cachedDbPromise as AwsDataApiPgDatabase<
//       typeof myschema
//     >;
//   }
//   console.log("connecting to db");
//   const rdsClient = new RDSDataClient({
//     credentials: {
//       accessKeyId: env.ACCESS_KEY_ID,
//       secretAccessKey: env.SECRET_ACCESS_KEY,
//     },
//     region: "us-east-1",
//   });
//   (globalThis as any).cachedDbPromise = drizzle(rdsClient, {
//     schema: myschema,
//     database: env.DB_DATABASE,
//     secretArn: env.RDS_SECRET_ARN,
//     resourceArn: env.RDS_ARN,
//   });

//   return (globalThis as any).cachedDbPromise as AwsDataApiPgDatabase<
//     typeof myschema
//   >;
// }

// export const dbPromise = connectToDatabase();
