import { describe, expect, it } from "vitest";
import { utf8 } from "../src/encoding.ts";
import {
  IdentityKeyError,
  PeerKeyStore,
  fingerprint,
  generateIdentityKeyPair,
  isValidIdentityPublicKey,
  signWithIdentity,
  verifyIdentitySignature,
} from "../src/identity.ts";

describe("identity key pairs", () => {
  it("generates 32-byte keys, different every time", () => {
    const a = generateIdentityKeyPair();
    const b = generateIdentityKeyPair();
    expect(a.publicKey).toHaveLength(32);
    expect(a.privateKey).toHaveLength(32);
    expect(a.publicKey).not.toEqual(b.publicKey);
    expect(isValidIdentityPublicKey(a.publicKey)).toBe(true);
  });

  it("rejects malformed public keys", () => {
    expect(isValidIdentityPublicKey(new Uint8Array(31))).toBe(false);
    expect(isValidIdentityPublicKey(new Uint8Array(33))).toBe(false);
    // All-zero bytes decode to a small-order point and must be rejected.
    expect(isValidIdentityPublicKey(new Uint8Array(32))).toBe(false);
  });
});

describe("signatures", () => {
  const alice = generateIdentityKeyPair();
  const mallory = generateIdentityKeyPair();
  const message = utf8("transcript bytes");
  const signature = signWithIdentity(alice.privateKey, message);

  it("verifies a valid signature", () => {
    expect(signature).toHaveLength(64);
    expect(verifyIdentitySignature(alice.publicKey, message, signature)).toBe(true);
  });

  it("rejects a modified message", () => {
    expect(verifyIdentitySignature(alice.publicKey, utf8("transcript bytez"), signature)).toBe(false);
  });

  it("rejects a signature checked against another key", () => {
    expect(verifyIdentitySignature(mallory.publicKey, message, signature)).toBe(false);
  });

  it("rejects a modified or malformed signature without throwing", () => {
    const tampered = signature.slice();
    tampered[0] = (tampered[0] ?? 0) ^ 1;
    expect(verifyIdentitySignature(alice.publicKey, message, tampered)).toBe(false);
    expect(verifyIdentitySignature(alice.publicKey, message, signature.slice(0, 63))).toBe(false);
    expect(verifyIdentitySignature(new Uint8Array(32), message, signature)).toBe(false);
  });
});

describe("fingerprint", () => {
  it("is deterministic and formatted as 16 groups of 4 hex characters", () => {
    const { publicKey } = generateIdentityKeyPair();
    const fp = fingerprint(publicKey);
    expect(fp).toBe(fingerprint(publicKey));
    expect(fp).toMatch(/^([0-9a-f]{4} ){15}[0-9a-f]{4}$/);
  });

  it("differs for different keys", () => {
    expect(fingerprint(generateIdentityKeyPair().publicKey)).not.toBe(
      fingerprint(generateIdentityKeyPair().publicKey),
    );
  });
});

describe("PeerKeyStore", () => {
  it("starts unverified and has no verified key", () => {
    const store = new PeerKeyStore();
    const bob = generateIdentityKeyPair();
    expect(store.observe("bob", bob.publicKey)).toBe("unverified");
    expect(store.verifiedKey("bob")).toBeUndefined();
    expect(store.knownKey("bob")).toEqual(bob.publicKey);
  });

  it("becomes verified after markVerified", () => {
    const store = new PeerKeyStore();
    const bob = generateIdentityKeyPair();
    store.observe("bob", bob.publicKey);
    store.markVerified("bob", bob.publicKey);
    expect(store.status("bob")).toBe("verified");
    expect(store.verifiedKey("bob")).toEqual(bob.publicKey);
    // Seeing the same key again keeps it verified.
    expect(store.observe("bob", bob.publicKey)).toBe("verified");
  });

  it("reports key-changed when a verified key is replaced, until re-verified", () => {
    const store = new PeerKeyStore();
    const oldKey = generateIdentityKeyPair().publicKey;
    const newKey = generateIdentityKeyPair().publicKey;
    store.observe("bob", oldKey);
    store.markVerified("bob", oldKey);

    expect(store.observe("bob", newKey)).toBe("key-changed");
    expect(store.verifiedKey("bob")).toBeUndefined();

    store.markVerified("bob", newKey);
    expect(store.status("bob")).toBe("verified");
  });

  it("stays unverified when an unverified key changes", () => {
    const store = new PeerKeyStore();
    store.observe("bob", generateIdentityKeyPair().publicKey);
    expect(store.observe("bob", generateIdentityKeyPair().publicKey)).toBe("unverified");
  });

  it("refuses to verify a key the user did not see", () => {
    const store = new PeerKeyStore();
    const shown = generateIdentityKeyPair().publicKey;
    const swapped = generateIdentityKeyPair().publicKey;
    store.observe("bob", swapped);
    expect(() => store.markVerified("bob", shown)).toThrow(IdentityKeyError);
    expect(() => store.markVerified("nobody", shown)).toThrow(IdentityKeyError);
  });

  it("rejects invalid public keys", () => {
    const store = new PeerKeyStore();
    expect(() => store.observe("bob", new Uint8Array(10))).toThrow(IdentityKeyError);
  });

  it("does not let callers modify stored keys", () => {
    const store = new PeerKeyStore();
    const bob = generateIdentityKeyPair();
    store.observe("bob", bob.publicKey);
    const copy = store.knownKey("bob");
    if (copy) copy[0] = (copy[0] ?? 0) ^ 1;
    expect(store.knownKey("bob")).toEqual(bob.publicKey);
  });

  it("forgets everything on clear", () => {
    const store = new PeerKeyStore();
    const bob = generateIdentityKeyPair();
    store.observe("bob", bob.publicKey);
    store.markVerified("bob", bob.publicKey);
    store.clear();
    expect(store.status("bob")).toBe("unverified");
    expect(store.knownKey("bob")).toBeUndefined();
  });
});
