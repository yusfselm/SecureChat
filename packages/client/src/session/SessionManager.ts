/**
 * Owners: B (handshake part) + C (ratchet part)
 * Glue between crypto-core and the WebSocket:
 *  - holds identity key pair, verified peer keys, active handshake and ratchet state IN MEMORY ONLY
 *    (never localStorage / sessionStorage / IndexedDB)
 *  - routes incoming handshake_* messages to handshake.ts and chat_message to ratchet.ts
 *  - stops the conversation and raises a warning on identity key change
 */
export {};
