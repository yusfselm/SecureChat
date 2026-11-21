/**
 * Owner: B
 * Spec: PDF §6 "Handshake transcript" – field order is defined in docs/protocol.md.
 * Both clients must produce exactly the same bytes.
 *
 * TODO:
 *  - buildTranscript(fields): Bytes   (fixed order, initiator values before responder values)
 *  - transcriptHash(transcript): Bytes   (SHA-256)
 */
export {};
