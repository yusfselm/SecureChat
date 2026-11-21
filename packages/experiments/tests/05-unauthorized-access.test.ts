import { describe, it } from "vitest";

// Owner: A – PDF §10 (use buildApp() from @securechat/server with app.inject())
describe("Experiment 05 – Unauthorized access", () => {
  it.todo("a third user cannot fetch messages of another pair's conversation");
  it.todo("a third user cannot post into another pair's conversation");
  it.todo("changing conversationId / sender fields in the request does not help");
  it.todo("requests without a valid session are rejected; logout invalidates the session");
});
