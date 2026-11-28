/**
 * Owner: C
 * Spec: PDF §7 "Key management", Signal Double Ratchet spec §3 (KDF_RK, KDF_CK)
 */
import {hkdf} from "@noble/hashes/hkdf.js";
import {hmac} from "@noble/hashes/hmac.js";
import {sha256} from "@noble/hashes/sha2.js";

const INFO_ROOT_RATCHET = new TextEncoder().encode("SecureChat-v1-RootRatchet");
const INFO_MSG_MATERIAL = new TextEncoder().encode("SecureChat-v1-MessageKey");
const CHAIN_INPUT_MSG_KEY = new Uint8Array([0x01]);
const CHAIN_INPUT_NEXT_CK = new Uint8Array([0x02]);
 /* TODO:
 *  - kdfRootKey(rootKey, dhOutput): { rootKey, chainKey }          (HKDF-SHA256)*/

export function kdfRootKey(
  rootKey: Uint8Array,
  dhOutput: Uint8Array
): { rootKey: Uint8Array; chainKey: Uint8Array } {
  const okm = hkdf(sha256, dhOutput, rootKey, INFO_ROOT_RATCHET, 64);
  return {
    rootKey: okm.slice(0, 32),
    chainKey: okm.slice(32, 64),
  };
}

/*  - kdfChainKey(chainKey): { chainKey, messageKey }               (HMAC-SHA256, distinct constant inputs)*/

export function kdfChainKey(
  chainKey: Uint8Array
): { chainKey: Uint8Array; messageKey: Uint8Array } {
  const messageKey = hmac(sha256, chainKey, CHAIN_INPUT_MSG_KEY);
  const nextChainKey = hmac(sha256, chainKey, CHAIN_INPUT_NEXT_CK);
  return {
    chainKey: nextChainKey,
    messageKey,
  };
}

/*  - messageKeyMaterial(messageKey): { aesKey, nonce }             (HKDF -> 32B key + 12B nonce)
 */

export function messageKeyMaterial(
  messageKey: Uint8Array
): { aesKey: Uint8Array; nonce: Uint8Array } {
  const zeroSalt = new Uint8Array(32);
  const okm = hkdf(sha256, messageKey, zeroSalt, INFO_MSG_MATERIAL, 44);
  return {
    aesKey: okm.slice(0, 32),
    nonce: okm.slice(32, 44),
  };
}
