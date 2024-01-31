import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DB_URL: z
			.string()
			.url()
			.refine(
				(str) => !str.includes('YOUR_DB_URL_HERE'),
				'You forgot to change the default URL'
			),

		BUILD_STATUS: z.enum(['building', 'live']).default('live'),
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		DB_HOST: z.string().default('localhost'),
		DB_PORT: z.string().default('5432'),
		DB_USER: z.string().default('root'),
		DB_PASSWORD: z.string().default('password'),
		DB_DATABASE: z.string().default('database'),
		RDS_ARN: z.string().default(''),
		RDS_SECRET_ARN: z.string().default(''),
		ACCESS_KEY_ID: z.string().default(''),
		SECRET_ACCESS_KEY: z.string().default(''),
		GITHUB_CLIENT_ID: z.string().default(''),
		GITHUB_CLIENT_SECRET: z.string().default(''),
		GOOGLE_CLIENT_ID: z.string().default(''),
		GOOGLE_CLIENT_SECRET: z.string().default(''),
		SES_SECRET_ACCESS_KEY: z.string().default(''),
		SES_ACCESS_KEY_ID: z.string().default(''),
		SES_EMAIL: z.string().default(''),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		BUILD_STATUS: process.env.BUILD_STATUS,
		DB_URL: process.env.DB_URL,
		NODE_ENV: process.env.NODE_ENV,
		DB_HOST: process.env.DB_HOST,
		DB_PORT: process.env.DB_PORT,
		DB_USER: process.env.DB_USER,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_DATABASE: process.env.DB_DATABASE,
		RDS_ARN: process.env.RDS_ARN,
		RDS_SECRET_ARN: process.env.RDS_SECRET_ARN,
		ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
		SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY,
		SES_ACCESS_KEY_ID: process.env.SES_ACCESS_KEY_ID,
		SES_EMAIL: process.env.SES_EMAIL,

		// NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
