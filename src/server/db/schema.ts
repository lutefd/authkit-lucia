// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
	timestamp,
	pgTableCreator,
	text,
	primaryKey,
	integer,
	pgEnum,
	boolean,
} from 'drizzle-orm/pg-core';
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
export type DatabaseUser = typeof users._.inferSelect;
export type DatabaseSession = typeof sessionTable._.inferSelect;
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

export const oauthAccounts = pgTable('oauth_account', {
	id: text('id')
		.$default(() => cuid2.createId())
		.notNull()
		.primaryKey(),
	provider_id: text('provider_id').notNull(),
	provider_user_id: text('provider_user_id').notNull().unique(),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	is_oauth: boolean('is_oauth').$default(() => false),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});

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
