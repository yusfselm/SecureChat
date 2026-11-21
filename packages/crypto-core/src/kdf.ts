/**
 * Owner: C
 * Spec: PDF §7 "Key management", Signal Double Ratchet spec §3 (KDF_RK, KDF_CK)
 *
 * TODO:
 *  - kdfRootKey(rootKey, dhOutput): { rootKey, chainKey }          (HKDF-SHA256)
 *  - kdfChainKey(chainKey): { chainKey, messageKey }               (HMAC-SHA256, distinct constant inputs)
 *  - messageKeyMaterial(messageKey): { aesKey, nonce }             (HKDF -> 32B key + 12B nonce)
 */
export {};
