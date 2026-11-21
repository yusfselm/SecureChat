/**
 * Owner: C
 * Spec: PDF §7 "Message protection"
 *
 * TODO:
 *  - encodeAssociatedData(header: PacketHeader): Bytes
 *      (conversationId, sessionId, sender, receiver, ratchet public key, PN, N – length-prefixed, see encoding.ts)
 *  - sealPacket(messageKey, header, plaintext): EncryptedPacket   (AES-256-GCM)
 *  - openPacket(messageKey, packet): plaintext | throws           (never returns unauthenticated data)
 *  - Nonce policy: derived together with the AES key from the one-time message key (kdf.ts)
 */
export {};
