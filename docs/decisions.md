# Design decisions

Agreed at project start (21 Nov 2026). Reasons are kept short so they can go straight into the report.

| #   | Decision                | Choice                                                | Reason                                                                                         |
| --- | ----------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Language                | TypeScript everywhere                                 | Crypto must run in the browser; same code runs in Node tests.                                  |
| 2   | Database                | SQLite (better-sqlite3)                               | Zero setup; easy to open and inspect for the server-inspection experiment.                     |
| 3   | Transport               | WebSocket                                             | Interactive 3-message handshake while both users are online.                                   |
| 4   | Login sessions          | Server-side sessions + httpOnly cookie                | Logout invalidation is a row delete; JS cannot read the cookie.                                |
| 5   | Server framework        | Fastify                                               | Good TS support, schema validation, official cookie/rate-limit/websocket plugins.              |
| 6   | UI                      | React + Vite                                          | Small amount of UI state (verified/unverified, warnings, chat).                                |
| 7   | Crypto primitives       | @noble/curves, @noble/hashes, @noble/ciphers          | Audited, pure TS, identical synchronous API in browser and Node.                               |
| 8   | AEAD                    | AES-256-GCM                                           | Allowed by the spec, matches the Signal reference, widely analysed.                            |
| 9   | Nonce policy            | Key + nonce derived from the one-time message key via HKDF | Each key encrypts exactly one message, so (key, nonce) pairs never repeat.                |
| 10  | Byte encoding           | Length-prefixed binary (uint32 BE length + bytes)     | Unambiguous field boundaries; identical bytes on both clients.                                 |
| 11  | Repository              | Monorepo with npm workspaces                          | One repo, shared types, no extra tooling.                                                      |
| 12  | Repo language           | English                                               | Report and presentation are in English; readable by all members and the instructor.           |

## Team roles

| Role | Area                                   | Member (fill in) |
| ---- | -------------------------------------- | ---------------- |
| A    | Server, account security, end-to-end integration | |
| B    | Identity keys, fingerprints, handshake |                  |
| C    | Double Ratchet, message protection     |                  |

Detailed responsibilities: see the README.
