/**
 * Owner: B
 * Spec: PDF §5 "Identity keys and peer verification"
 *
 * - Each client generates a fresh Ed25519 identity key pair per session (after login).
 *   Only the public key is uploaded; the private key stays in memory.
 * - Fingerprint = SHA-256 of the 32-byte encoded public key, shown as hex in groups of 4.
 * - PeerKeyStore keeps the peers' keys in memory and tracks whether the user has verified
 *   them out of band. A key change for a verified peer is reported as "key-changed".
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { constantTimeEqual } from "./encoding.ts";
import type { Bytes, KeyPair, UserId } from "./types.ts";

export const ED25519_PUBLIC_KEY_BYTES = 32;
export const ED25519_SIGNATURE_BYTES = 64;

// ---------------------------------------------------------------------------
// Key pairs and signatures
// ---------------------------------------------------------------------------

/** New Ed25519 identity key pair. Keep the private key in memory only. */
export function generateIdentityKeyPair(): KeyPair {
  const privateKey = ed25519.utils.randomSecretKey();
  const publicKey = ed25519.getPublicKey(privateKey);
  return { publicKey, privateKey };
}

/**
 * True if the bytes are a well-formed Ed25519 public key:
 * correct length, a valid curve point, and not a small-order (weak) point.
 */
export function isValidIdentityPublicKey(publicKey: Bytes): boolean {
  if (publicKey.length !== ED25519_PUBLIC_KEY_BYTES) return false;
  try {
    const point = ed25519.Point.fromBytes(publicKey);
    return !point.isSmallOrder();
  } catch {
    return false;
  }
}

/** Sign a message with an identity private key. */
export function signWithIdentity(privateKey: Bytes, message: Bytes): Bytes {
  return ed25519.sign(message, privateKey);
}

/**
 * Verify an identity signature. Never throws: malformed keys or signatures return false.
 * zip215: false = strict RFC 8032 verification (rejects non-canonical encodings).
 */
export function verifyIdentitySignature(publicKey: Bytes, message: Bytes, signature: Bytes): boolean {
  if (signature.length !== ED25519_SIGNATURE_BYTES) return false;
  if (!isValidIdentityPublicKey(publicKey)) return false;
  try {
    return ed25519.verify(signature, message, publicKey, { zip215: false });
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Fingerprints
// ---------------------------------------------------------------------------

/** SHA-256 fingerprint of a public key, e.g. "1a2b 3c4d ... " (16 groups of 4 hex chars). */
export function fingerprint(publicKey: Bytes): string {
  const hex = bytesToHex(sha256(publicKey));
  return (hex.match(/.{4}/g) ?? []).join(" ");
}

// ---------------------------------------------------------------------------
// Peer verification state (in memory)
// ---------------------------------------------------------------------------

/**
 * unverified  – key known, user has not compared fingerprints yet
 * verified    – user compared fingerprints out of band and pressed "Verify"
 * key-changed – the key differs from one the user had verified: stop the
 *               conversation and require verification again
 */
export type PeerStatus = "unverified" | "verified" | "key-changed";

interface PeerEntry {
  publicKey: Bytes;
  verified: boolean;
  changed: boolean;
}

export class IdentityKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IdentityKeyError";
  }
}

export class PeerKeyStore {
  private readonly peers = new Map<UserId, PeerEntry>();

  /**
   * Record the public key the server returned for a peer and return the resulting status.
   * Call this every time a key is fetched or a key-change notification arrives.
   */
  observe(peerId: UserId, publicKey: Bytes): PeerStatus {
    if (!isValidIdentityPublicKey(publicKey)) {
      throw new IdentityKeyError(`invalid identity public key for ${peerId}`);
    }
    const entry = this.peers.get(peerId);
    const key = publicKey.slice();

    if (!entry) {
      this.peers.set(peerId, { publicKey: key, verified: false, changed: false });
    } else if (!constantTimeEqual(entry.publicKey, publicKey)) {
      // A different key: never keep "verified". Remember that a verified key was replaced.
      this.peers.set(peerId, {
        publicKey: key,
        verified: false,
        changed: entry.verified || entry.changed,
      });
    }
    return this.status(peerId);
  }

  /**
   * Mark the peer as verified after the user compared fingerprints.
   * publicKey must be the key whose fingerprint the user actually saw,
   * so a key that changed in the meantime cannot be verified by accident.
   */
  markVerified(peerId: UserId, publicKey: Bytes): void {
    const entry = this.peers.get(peerId);
    if (!entry) throw new IdentityKeyError(`unknown peer ${peerId}`);
    if (!constantTimeEqual(entry.publicKey, publicKey)) {
      throw new IdentityKeyError(`key for ${peerId} changed before verification`);
    }
    entry.verified = true;
    entry.changed = false;
  }

  status(peerId: UserId): PeerStatus {
    const entry = this.peers.get(peerId);
    if (!entry) return "unverified";
    if (entry.verified) return "verified";
    return entry.changed ? "key-changed" : "unverified";
  }

  /** Current key of a peer (verified or not), e.g. to show its fingerprint. */
  knownKey(peerId: UserId): Bytes | undefined {
    return this.peers.get(peerId)?.publicKey.slice();
  }

  /** Key to use for the handshake: only returned if the peer is verified. */
  verifiedKey(peerId: UserId): Bytes | undefined {
    const entry = this.peers.get(peerId);
    return entry?.verified ? entry.publicKey.slice() : undefined;
  }

  /** Forget everything (logout / client restart). */
  clear(): void {
    this.peers.clear();
  }
}
