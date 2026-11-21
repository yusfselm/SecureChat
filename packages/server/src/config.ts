/**
 * Owner: A
 * Central configuration. Document the chosen Argon2id parameters in the report (PDF §4).
 */
export const config = {
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? "127.0.0.1",
  databasePath: process.env.DB_PATH ?? "data/securechat.db",

  // TODO: agree on and document final values (RFC 9106 / OWASP recommendations).
  argon2: {
    memoryCost: 19456, // KiB
    timeCost: 2,
    parallelism: 1,
  },

  // TODO: session lifetime, cookie flags (httpOnly, sameSite=strict, secure when HTTPS).
  sessionTtlSeconds: 60 * 60 * 8,

  // TODO: login rate limit values.
  loginRateLimit: { max: 5, timeWindow: "1 minute" },
} as const;
