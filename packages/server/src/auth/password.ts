/**
 * Owner: A
 * Spec: PDF §4 "Password protection"
 * TODO:
 *  - hashPassword(password): Argon2id with a unique random salt (argon2 package, params from config.ts)
 *  - verifyPassword(hash, password)
 *  - never log or store the plaintext password
 */
export {};
