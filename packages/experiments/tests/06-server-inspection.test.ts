import { describe, it } from "vitest";

// Owner: A – PDF §10
describe("Experiment 06 – Server inspection", () => {
  it.todo("after a conversation, the DB contains no known plaintext marker string");
  it.todo("the DB and logs contain no client private keys");
  it.todo("passwords are stored only as Argon2id hashes");
});
