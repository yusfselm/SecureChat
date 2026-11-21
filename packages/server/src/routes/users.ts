/**
 * Owner: A
 * TODO:
 *  - GET  /api/users                       list registered users (+ online status)
 *  - PUT  /api/keys/identity               publish own Ed25519 public key (replaces old one on restart)
 *  - GET  /api/keys/identity/:username     fetch a peer's public key (client must still verify it)
 *  - notify connected peers when an identity key changes
 */
export {};
