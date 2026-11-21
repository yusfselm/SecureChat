/**
 * Owner: B
 * Spec: PDF §5 "Identity keys and peer verification"
 *
 * TODO:
 *  - generateIdentityKeyPair(): KeyPair            (Ed25519, private key stays in memory only)
 *  - fingerprint(publicKey): string                (SHA-256 of the encoded public key, human-readable groups)
 *  - verified-peer store (in memory): markVerified, isVerified, detect key change
 *  - validate public keys (correct length / valid point)
 */
export {};
