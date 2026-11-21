/**
 * SHARED CONSTANTS – DRAFT. Every label must be distinct (PDF §6, §7).
 * Changing a value here breaks compatibility between clients: update docs/protocol.md too.
 */

export const PROTOCOL_VERSION = "SecureChat-v1";

/** Algorithm identifiers included in the handshake transcript. */
export const ALGORITHMS = {
  identity: "Ed25519",
  keyAgreement: "X25519",
  kdf: "HKDF-SHA256",
  mac: "HMAC-SHA256",
  aead: "AES-256-GCM",
  hash: "SHA-256",
} as const;

/** Signature role labels (signed together with the transcript). */
export const SIG_LABEL_INITIATOR = "SecureChat-v1-Initiator";
export const SIG_LABEL_RESPONDER = "SecureChat-v1-Responder";

/** Key-confirmation role labels (HMAC input together with the transcript hash). */
export const CONFIRM_LABEL_INITIATOR = "SecureChat-v1-Confirm-Initiator";
export const CONFIRM_LABEL_RESPONDER = "SecureChat-v1-Confirm-Responder";

/** HKDF info labels. */
export const HKDF_INFO_ROOT = "SecureChat-v1-RootKey";
export const HKDF_INFO_CONFIRM = "SecureChat-v1-ConfirmKey";
export const HKDF_INFO_RATCHET = "SecureChat-v1-Ratchet";
export const HKDF_INFO_MESSAGE = "SecureChat-v1-MessageKey";

/** Sizes in bytes. */
export const SESSION_ID_BYTES = 16; // >= 128 bits (PDF §6)
export const HANDSHAKE_NONCE_BYTES = 32;
export const AES_KEY_BYTES = 32;
export const GCM_NONCE_BYTES = 12;
