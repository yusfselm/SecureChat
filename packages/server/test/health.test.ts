import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.ts";

describe("server skeleton", () => {
  it("responds to the health check", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });

  it.todo("auth.test.ts: register, login, logout invalidation, rate limiting");
  it.todo("authz.test.ts: non-members cannot read or post to a conversation");
});
