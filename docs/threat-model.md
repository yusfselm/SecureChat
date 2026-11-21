# Threat model (PDF §3) – owner: A (everyone reviews)

## Attacker capabilities

- Observe, modify, replay and inject protocol messages (network and server relay).
- Inspect or tamper with server-stored ciphertext and public keys.
- Attempt unauthorized access with an ordinary account.
- Obtain a snapshot of a client's current cryptographic state (forward-secrecy experiment).

## Trust assumptions

- Client code and cryptographic libraries are trusted.
- Users compare fingerprints over an independent, authentic channel.
- TODO: anything else we assume (e.g. browser not compromised at the time of use).

## Out of scope / limitations

- Plaintext kept on screen or in client memory at compromise time.
- Messages protected by keys that are current at compromise time.
- Multiple devices, offline session establishment, out-of-order delivery, group chats.
- Quantum attacker (see report §7, harvest now / decrypt later).
- Metadata (who talks to whom, when, message sizes) is visible to the server.

## Mapping: threat → control → experiment

| Threat                         | Control                                         | Experiment |
| ------------------------------ | ----------------------------------------------- | ---------- |
| Modify packets                 | AES-GCM over ciphertext + associated data       | 02         |
| Replay packets                 | Ratchet message counters, session binding        | 03         |
| Substitute keys (MITM)         | Fingerprint verification + transcript signatures | 04         |
| Read/inject other conversations | Session-based sender + membership checks        | 05         |
| Malicious/curious server       | End-to-end encryption, keys only in client memory | 06       |
| Forged packet breaking state   | Commit state only after authentication          | 07         |
| Later state compromise         | Key deletion, one-way KDF chains, DH ratchet     | 08         |
