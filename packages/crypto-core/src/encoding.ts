/**
 * Owner: B
 * Spec: PDF §6 "Handshake transcript" – encoding must identify field boundaries unambiguously.
 * Decision: length-prefixed binary, each field = uint32 big-endian length || bytes.
 *
 * TODO:
 *  - encodeFields(fields: Bytes[]): Bytes
 *  - decodeFields(data: Bytes): Bytes[]   (reject truncated / trailing data)
 *  - utf8 helpers for strings (user ids, labels)
 * Also used by C for associated data (packet.ts).
 */
export {};
