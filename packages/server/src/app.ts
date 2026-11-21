/**
 * Owner: A
 * Builds the Fastify app without starting it, so tests and experiments can use app.inject().
 */
import Fastify from "fastify";

export function buildApp() {
  // Logger stays off by default: request bodies may contain passwords. If you enable it,
  // never log bodies, cookies or message payloads (PDF §4, experiment 06).
  const app = Fastify({ logger: false });

  app.get("/api/health", async () => ({ ok: true }));

  // TODO: register plugins and routes
  //  - @fastify/cookie, @fastify/rate-limit, @fastify/websocket
  //  - auth/routes.ts, routes/users.ts, routes/conversations.ts, ws/relay.ts

  return app;
}
