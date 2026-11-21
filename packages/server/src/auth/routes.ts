/**
 * Owner: A
 * Spec: PDF §4 "Session management"
 * TODO:
 *  - POST /api/register   unique username
 *  - POST /api/login      rate limited; sets httpOnly, sameSite=strict session cookie
 *  - POST /api/logout     deletes the session row (invalidation) and clears the cookie
 *  - GET  /api/me
 */
export {};
