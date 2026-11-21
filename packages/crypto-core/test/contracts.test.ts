import { describe, expect, it } from "vitest";
import { SIG_LABEL_INITIATOR, SIG_LABEL_RESPONDER, SESSION_ID_BYTES } from "../src/index.ts";
import * as constants from "../src/constants.ts";

// Sanity checks on the shared contracts. Real unit tests go in one file per module:
// encoding.test.ts, identity.test.ts, transcript.test.ts, handshake.test.ts (B)
// kdf.test.ts, packet.test.ts, ratchet.test.ts (C)
describe("shared constants", () => {
  it("session id is at least 128 bits", () => {
    expect(SESSION_ID_BYTES * 8).toBeGreaterThanOrEqual(128);
  });

  it("role labels are distinct", () => {
    expect(SIG_LABEL_INITIATOR).not.toBe(SIG_LABEL_RESPONDER);
  });

  it("all string labels are unique", () => {
    const labels = Object.values(constants).filter((v): v is string => typeof v === "string");
    expect(new Set(labels).size).toBe(labels.length);
  });
});
