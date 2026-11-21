# SecureChat

Authenticated, end-to-end encrypted one-to-one messaging – Applied Cryptography term project, **Group 2**.

Messages are encrypted in the sender's browser and decrypted in the recipient's browser.
The server stores accounts, public keys and ciphertext only; it never sees plaintext or private keys.

> 🚧 Draft skeleton – nothing is implemented yet.

## Team and responsibilities

Each person only edits their own files. Shared files are changed only after telling the others.

### A – Server, account security, end-to-end integration · Member: TODO

- **Code:** `packages/server/**`, `packages/protocol/src/api.ts`, `client/src/api/`, `client/src/ws/`,
  `client/src/pages/Login.tsx`, `Register.tsx`, `Users.tsx`, `client/src/App.tsx`
- **Security:** Argon2id password hashing, login sessions + logout invalidation, login rate limiting,
  conversation membership checks, sender taken from the session, no plaintext/keys on the server
- **Experiments:** 01 normal operation (end-to-end), 05 unauthorized access, 06 server inspection
- **Report:** §1 Overview & threat model, §2 Architecture, §7 Harvest now, decrypt later

### B – Identity keys and handshake · Member: TODO

- **Code:** `crypto-core/src/encoding.ts` (first!), `identity.ts`, `transcript.ts`, `handshake.ts` + their tests,
  `client/src/components/*`, handshake part of `client/src/session/SessionManager.ts`
- **Security:** Ed25519 identity keys, SHA-256 fingerprints and verification, key-change warnings,
  transcript encoding and signatures, X25519 + HKDF key derivation, key confirmation, rejecting bad/stale handshakes
- **Experiments:** 04 key substitution
- **Report:** §3 Cryptographic methods, §4 Protocol & key management (identity → handshake → key derivation)

### C – Double Ratchet and message protection · Member: TODO

- **Code:** `crypto-core/src/kdf.ts`, `ratchet.ts`, `packet.ts` + their tests,
  `client/src/pages/Chat.tsx`, messaging part of `client/src/session/SessionManager.ts`
- **Security:** Double Ratchet (root/chain/message keys, DH ratchet), AES-256-GCM with associated data,
  nonce policy, replay rejection, commit-after-authentication, key deletion (forward secrecy)
- **Experiments:** 02 packet tampering, 03 replay, 07 state integrity, 08 forward secrecy
- **Report:** §4 Protocol & key management (ratchet part), §5 Message handling

### Shared (agree together before changing)

`crypto-core/src/types.ts`, `crypto-core/src/constants.ts`, `packages/protocol/src/ws.ts`, `docs/protocol.md`.
Report §6 (each writes their own experiments), §8 Team contributions, §9 References – everyone.

## Structure

```
packages/
  crypto-core/   protocol logic: identity keys, handshake (B) · ratchet, packets (C)
  protocol/      shared server <-> client message types (A)
  server/        Fastify + SQLite + WebSocket (A)
  client/        React web app – all encryption happens here
  experiments/   the 8 required security experiments
docs/
  protocol.md    protocol specification (draft)
  decisions.md   design decisions
  threat-model.md
  report/        report outline
```

Each file starts with a comment saying who owns it and what needs to be done.

## Run (once implemented)

Requires Node.js 22+.

```bash
npm install
npm run dev:server     # terminal 1
npm run dev:client     # terminal 2 → http://localhost:5173
npm test               # tests + security experiments
```
