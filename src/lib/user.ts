import { readSession } from '@/actions/session';
import { dbPromise } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
/**
 * Asynchronously retrieves a user object by its email address from the database.
 * If no matching record is found, it will return `null`.
 * @param {string} email - The user's email address.
 */
export const getUserByEmail = async (email: string) => {
	const db = await dbPromise;
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		return user;
	} catch (error) {
		return null;
	}
};
/**
 * Asynchronously retrieves a user object by its ID from the database.
 * If no matching record is found, it will return `null`.
 * @param {string} id - The user's ID.
 */
export const getUserById = async (id: string) => {
	const db = await dbPromise;

	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, id),
		});

		return user;
	} catch (error) {
		return null;
	}
};

/**
 * Updates the default attribute values of a given user identified by ID.
 * Sets the role to "USER", status to "ACTIVE", email verification timestamp to current date, and two factor authentication method to "NONE".
 * Returns the updated user object if successful, otherwise returns `null`.
 * @param {string} id - The unique identifier of the user whose defaults should be updated.
 */
export const setDefaultValues = async (id: string) => {
	const db = await dbPromise;

	try {
		const user = await db
			.update(users)
			.set({
				role: 'USER',
				status: 'ACTIVE',
				emailVerified: new Date(),
				two_factor_method: 'NONE',
			})
			.where(eq(users.id, id))
			.returning({
				role: users.role,
				id: users.id,
				name: users.name,
				email: users.email,
				image: users.image,
				status: users.status,
				emailVerified: users.emailVerified,
				two_factor_method: users.two_factor_method,
			});

		return user;
	} catch (error) {
		return null;
	}
};

/**
 * Updates the specified user's role to either "ADMIN" or "USER".
 * Returns the updated user object if successful, otherwise returns `null`.
 * @param {string} id - The unique identifier of the user whose role should be updated.
 * @param {'ADMIN'|'USER'} role - The new role value for the user. Must be either "ADMIN" or "USER".
 */
export const setUserRole = async (id: string, role: 'ADMIN' | 'USER') => {
	const db = await dbPromise;

	try {
		const user = await db
			.update(users)
			.set({
				role,
			})
			.where(eq(users.id, id));

		return user;
	} catch (error) {
		return null;
	}
};

/**
 * Updates the specified user's account status to either "ACTIVE" or "BLOCKED".
 * Returns the updated user object if successful, otherwise returns `null`.
 * @param {string} id - The unique identifier of the user whose account status should be updated.
 * @param {'ACTIVE'|'BLOCKED'} status - The new account status value for the user. Must be either "ACTIVE" or "BLOCKED".
 */
export const setUserStatus = async (
	id: string,
	status: 'ACTIVE' | 'BLOCKED'
) => {
	const db = await dbPromise;

	try {
		const user = await db
			.update(users)
			.set({
				status,
			})
			.where(eq(users.id, id));

		return user;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves the authenticated user associated with the current request context.
 * Returns the User object representing the currently logged in user, or undefined if no user is signed in.
 */
export const currentUserServer = async () => {
	const session = await readSession();
	return session.user;
};

/**
 * Retrieves the authenticated users role associated with the current request context.
 * Returns the User role string of the currently logged in user, or undefined if no user is signed in.
 */
export const currentRole = async () => {
	const session = await readSession();
	return session?.user?.role;
};
