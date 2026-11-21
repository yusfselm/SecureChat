import { describe, it } from "vitest";

// Owner: A (end-to-end test using B's handshake and C's ratchet) – PDF §10
describe("Experiment 01 – Normal operation", () => {
  it.todo("both peers verify fingerprints and complete the 3-message handshake");
  it.todo("initiator -> responder and responder -> initiator messages decrypt correctly");
  it.todo("a DH ratchet transition happens and messaging continues");
});
