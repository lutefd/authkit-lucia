// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
	timestamp,
	pgTableCreator,
	text,
	primaryKey,
	integer,
	pgEnum,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';
import cuid2 from '@paralleldrive/cuid2';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `project1_${name}`);

export const RoleEnum = pgEnum('role_enum', ['ADMIN', 'USER']);
export const UserStatusEnum = pgEnum('user_status_enum', ['ACTIVE', 'BLOCKED']);
export const TwoFactorMethodEnum = pgEnum('two_factor_method_enum', [
	'NONE',
	'EMAIL',
	'AUTHENTICATOR',
]);
export const users = pgTable('user', {
	id: text('id')
		.$default(() => cuid2.createId())
		.notNull()
		.primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	password: text('password'),
	image: text('image'),
	role: RoleEnum('role').$default(() => 'USER'),
	status: UserStatusEnum('status').$default(() => 'ACTIVE'),
	two_factor_method: TwoFactorMethodEnum('two_factor_method').$default(
		() => 'NONE'
	),
	two_factor_secret: text('two_factor_secret'),
});

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.$default(() => cuid2.createId())
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
);

export const verificationToken = pgTable('verificationToken', {
	id: text('id')
		.$default(() => cuid2.createId())
		.notNull(),
	email: text('email').notNull().unique(),
	token: text('token').notNull().unique(),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const passwordResetToken = pgTable('passwordResetToken', {
	id: text('id')
		.$default(() => cuid2.createId())
		.notNull(),
	email: text('email').notNull().unique(),
	token: text('token').notNull().unique(),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const emailTwoFactorVerificationToken = pgTable(
	'emailTwoFactorVerificationToken',
	{
		id: text('id')
			.$default(() => cuid2.createId())
			.notNull(),
		email: text('email').notNull().unique(),
		token: text('token').notNull().unique(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	}
);

export const emailTwoFactorConfirmation = pgTable(
	'emailTwoFactorConfirmation',
	{
		id: text('id')
			.$default(() => cuid2.createId())
			.notNull(),
		userId: text('userId')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
			})
			.unique(),
	}
);

// export const sessions = pgTable('session', {
// 	sessionToken: text('sessionToken').notNull().primaryKey(),
// 	userId: text('userId')
// 		.notNull()
// 		.references(() => users.id, { onDelete: 'cascade' }),
// 	expires: timestamp('expires', { mode: 'date' }).notNull(),
// });

// export const verificationTokens = pgTable(
// 	'verificationToken',
// 	{
// 		identifier: text('identifier').notNull(),
// 		token: text('token').notNull(),
// 		expires: timestamp('expires', { mode: 'date' }).notNull(),
// 	},
// 	(vt) => ({
// 		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
// 	})
// );
