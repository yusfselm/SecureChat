# Security experiments (PDF §10)

Run all experiments:

```bash
npm run experiments
```

Run one experiment:

```bash
npx vitest run packages/experiments/tests/02-packet-tampering.test.ts
```

Fill in the "Observed" column from real test output before submission. The report's Security
Evaluation section (§6) is built from this table.

| #   | Experiment          | Owner | Test file                          | Expected                                                                   | Observed | Control responsible for rejection                       |
| --- | ------------------- | ----- | ---------------------------------- | -------------------------------------------------------------------------- | -------- | ------------------------------------------------------- |
| 01  | Normal operation    | A     | `01-normal-operation.test.ts`      | Verified session, bidirectional messages, at least one DH ratchet step     | TODO     | –                                                       |
| 02  | Packet tampering    | C     | `02-packet-tampering.test.ts`      | Modified ciphertext / nonce / header field is rejected                     | TODO     | AES-GCM tag over ciphertext + associated data           |
| 03  | Replay              | C     | `03-replay.test.ts`                | Previously accepted packet is rejected when resent                         | TODO     | Message counter check in ratchet state                  |
| 04  | Key substitution    | B     | `04-key-substitution.test.ts`      | Modified handshake keys or substituted identity key stop the exchange      | TODO     | Transcript signatures + verified identity key           |
| 05  | Unauthorized access | A     | `05-unauthorized-access.test.ts`   | Third user cannot read or inject, even by changing identifiers             | TODO     | Session-based sender + conversation membership check    |
| 06  | Server inspection   | A     | `06-server-inspection.test.ts`     | No plaintext or private keys in the DB or logs                             | TODO     | Client-side encryption, keys kept in client memory      |
| 07  | State integrity     | C     | `07-state-integrity.test.ts`       | Forged packet rejected, next valid packet still succeeds                   | TODO     | Commit state only after successful authentication       |
| 08  | Forward secrecy     | C     | `08-forward-secrecy.test.ts`       | Current state cannot decrypt earlier messages whose keys were discarded    | TODO     | Key deletion + one-way chain KDF + DH ratchet           |
