import { describe, it } from "vitest";

// Owner: C – PDF §8, §10
describe("Experiment 08 – Forward secrecy", () => {
  it.todo("record ciphertexts, exchange messages across a DH ratchet step, snapshot current state");
  it.todo("an attacker with the snapshot cannot decrypt the recorded earlier messages");
  it.todo("the snapshot contains no used message keys or replaced DH private keys");
});
