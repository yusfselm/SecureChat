/**
 * Owner: C
 * Spec: PDF §7 "Double Ratchet and message protection", §8 "Forward secrecy"
 *       Signal Double Ratchet spec §3 (classical, no header encryption, no out-of-order support)
 *
 * TODO:
 *  - RatchetState: DHs, DHr, RK, CKs, CKr, Ns, Nr, PN (+ session metadata)
 *  - initInitiator(result: HandshakeResult) / initResponder(result: HandshakeResult)
 *  - encrypt(state, plaintext) -> EncryptedPacket       (uses packet.ts)
 *  - decrypt(state, packet) -> plaintext
 *      * work on a COPY of the state; commit only after successful authentication
 *      * DH ratchet step when a new ratchet public key arrives
 *      * reject replays, other sessions, unsupported out-of-order messages
 *  - Delete used message keys, obsolete chain keys and replaced DH private keys
 *  - exportStateSnapshot(state): for the forward-secrecy experiment ONLY (never logged/sent)
 */
export {};
