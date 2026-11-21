import { describe, it } from "vitest";

// Owner: C – PDF §10
describe("Experiment 02 – Packet tampering", () => {
  it.todo("rejects a packet with a modified ciphertext byte");
  it.todo("rejects a packet with a modified GCM tag");
  it.todo("rejects a packet with a modified header field (sessionId, sender, receiver, ratchet key, PN, N)");
});
