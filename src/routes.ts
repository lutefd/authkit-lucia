/**
 * Array de rotas que serão acessíveis sem autenticação
 * @type {string[]}
 */
export const publicRoutes = ['/', '/auth/verify-email', '/auth/reset-password'];

/**
 * Esse array de rotas será acessível apenas se o usuário estiver autenticado
 * @type {string[]}
 */

export const authenticationRoutes = [
	'/auth/login',
	'/auth/register',
	'/auth/reset',
	'/auth/password-reset',
];

/**
 * Prefixo das rotas de autenticação
 * As rotas de autenticação são geradas automaticamente pelo next-auth
 * @type {string}
 */

export const apiAuthPrefix = '/api/auth';

/**
 * Rota de redirecionamento ao concluir o login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
