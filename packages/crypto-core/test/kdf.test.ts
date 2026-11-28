/**
 * Owner: C
 * Tests for KDF_RK, KDF_CK, and message key material derivation.
 */
import { describe, it, expect } from "vitest";
import { kdfRootKey, kdfChainKey, messageKeyMaterial } from "../src/kdf.js";

function randomBytes32(fill: number): Uint8Array {
  const buf = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    buf[i] = (fill + i * 17) & 0xff;
  }
  return buf;
}

describe("kdfRootKey (KDF_RK)", () => {
  it("returns distinct 32-byte rootKey and chainKey", () => {
    const rk = randomBytes32(0x11);
    const dhOut = randomBytes32(0x22);

    const res = kdfRootKey(rk, dhOut);

    expect(res.rootKey).toBeInstanceOf(Uint8Array);
    expect(res.chainKey).toBeInstanceOf(Uint8Array);
    expect(res.rootKey.length).toBe(32);
    expect(res.chainKey.length).toBe(32);

    // Must update rootKey (not return input unchanged) and separate rootKey from chainKey
    expect(res.rootKey).not.toEqual(rk);
    expect(res.chainKey).not.toEqual(dhOut);
    expect(res.rootKey).not.toEqual(res.chainKey);
  });

  it("is deterministic for identical inputs and sensitive to changes in either input", () => {
    const rk = randomBytes32(0x33);
    const dhOut = randomBytes32(0x44);

    const first = kdfRootKey(rk, dhOut);
    const second = kdfRootKey(rk, dhOut);
    expect(first.rootKey).toEqual(second.rootKey);
    expect(first.chainKey).toEqual(second.chainKey);

    // Flipping 1 bit in dhOutput changes both outputs
    const dhModified = new Uint8Array(dhOut);
    dhModified[0] ^= 0x01;
    const diffDh = kdfRootKey(rk, dhModified);
    expect(diffDh.rootKey).not.toEqual(first.rootKey);
    expect(diffDh.chainKey).not.toEqual(first.chainKey);

    // Flipping 1 bit in rootKey changes both outputs
    const rkModified = new Uint8Array(rk);
    rkModified[0] ^= 0x01;
    const diffRk = kdfRootKey(rkModified, dhOut);
    expect(diffRk.rootKey).not.toEqual(first.rootKey);
    expect(diffRk.chainKey).not.toEqual(first.chainKey);
  });
});

describe("kdfChainKey (KDF_CK)", () => {
  it("advances chainKey and derives a distinct 32-byte messageKey", () => {
    const ck0 = randomBytes32(0x55);
    const { chainKey: ck1, messageKey: mk1 } = kdfChainKey(ck0);

    expect(ck1.length).toBe(32);
    expect(mk1.length).toBe(32);
    expect(ck1).not.toEqual(ck0);
    expect(mk1).not.toEqual(ck0);
    expect(ck1).not.toEqual(mk1);
  });

  it("produces unique keys across sequential ratchet steps (forward secrecy)", () => {
    let ck = randomBytes32(0x66);
    const seenChainKeys = new Set<string>();
    const seenMessageKeys = new Set<string>();

    for (let i = 0; i < 10; i++) {
      const step = kdfChainKey(ck);
      const ckHex = Buffer.from(step.chainKey).toString("hex");
      const mkHex = Buffer.from(step.messageKey).toString("hex");

      expect(seenChainKeys.has(ckHex)).toBe(false);
      expect(seenMessageKeys.has(mkHex)).toBe(false);

      seenChainKeys.add(ckHex);
      seenMessageKeys.add(mkHex);
      ck = step.chainKey;
    }
  });
});

describe("messageKeyMaterial", () => {
  it("derives a 32-byte aesKey and a 12-byte GCM nonce that are distinct", () => {
    const mk = randomBytes32(0x77);
    const { aesKey, nonce } = messageKeyMaterial(mk);

    expect(aesKey).toBeInstanceOf(Uint8Array);
    expect(nonce).toBeInstanceOf(Uint8Array);
    expect(aesKey.length).toBe(32);
    expect(nonce.length).toBe(12);
    expect(aesKey).not.toEqual(mk);
    expect(aesKey.slice(0, 12)).not.toEqual(nonce);
  });

  it("is deterministic and produces unique (aesKey, nonce) pairs for distinct messageKeys", () => {
    const mk1 = randomBytes32(0x88);
    const mk2 = randomBytes32(0x99);

    const mat1a = messageKeyMaterial(mk1);
    const mat1b = messageKeyMaterial(mk1);
    const mat2 = messageKeyMaterial(mk2);

    expect(mat1a.aesKey).toEqual(mat1b.aesKey);
    expect(mat1a.nonce).toEqual(mat1b.nonce);

    expect(mat1a.aesKey).not.toEqual(mat2.aesKey);
    expect(mat1a.nonce).not.toEqual(mat2.nonce);
  });
});