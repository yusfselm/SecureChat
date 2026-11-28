/**
 * Owner: C
 * Spec: PDF §7 "Key management", Signal Double Ratchet spec §3 (KDF_RK, KDF_CK)
 *
 * TODO:
 *  - kdfRootKey(rootKey, dhOutput): { rootKey, chainKey }          (HKDF-SHA256)*/

export function kdfRootKey(rootKey: Uint8Array, dhOutput: Uint8Array): { rootKey: Uint8Array; chainKey: Uint8Array } {
  const info = new TextEncoder().encode("WhisperRatchet");
  const hkdf = new HKDF("SHA-256", rootKey, dhOutput, info);
  const { key: chainKey } = hkdf.derive("chainKey");
  return { rootKey, chainKey };
}

/*  - kdfChainKey(chainKey): { chainKey, messageKey }               (HMAC-SHA256, distinct constant inputs)*/

export function kdfChainKey(chainKey: Uint8Array): { chainKey: Uint8Array; messageKey: Uint8Array } {
  const info = new TextEncoder().encode("WhisperRatchet");
  const hkdf = new HKDF("SHA-256", chainKey, info);
  const { key: messageKey } = hkdf.derive("messageKey");
  return { chainKey, messageKey };
}

/*  - messageKeyMaterial(messageKey): { aesKey, nonce }             (HKDF -> 32B key + 12B nonce)
 */

export function messageKeyMaterial(messageKey: Uint8Array): { aesKey: Uint8Array; nonce: Uint8Array } {
  const info = new TextEncoder().encode("WhisperRatchet");
  const hkdf = new HKDF("SHA-256", messageKey, info);
  const { key: aesKey } = hkdf.derive("aesKey");
  const { key: nonce } = hkdf.derive("nonce");
  return { aesKey, nonce };
}
