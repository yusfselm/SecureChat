-- Owner: A
-- DRAFT schema. The server stores ONLY: accounts, password hashes, sessions, identity PUBLIC keys,
-- conversation membership and ENCRYPTED messages. Never plaintext or private keys (PDF §2).

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY,
  username      TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,           -- Argon2id encoded string (includes salt + params)
  created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT    PRIMARY KEY,           -- random token (store a hash of it, not the raw value)
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS identity_keys (
  user_id      INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  public_key   BLOB    NOT NULL,            -- Ed25519 public key, replaced on client restart
  updated_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
  id         TEXT    PRIMARY KEY,
  user_a     INTEGER NOT NULL REFERENCES users(id),
  user_b     INTEGER NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  UNIQUE (user_a, user_b)
);

CREATE TABLE IF NOT EXISTS messages (
  id              INTEGER PRIMARY KEY,
  conversation_id TEXT    NOT NULL REFERENCES conversations(id),
  sender_id       INTEGER NOT NULL REFERENCES users(id),  -- from the session, never from the client
  header          TEXT    NOT NULL,                        -- JSON header (authenticated, not secret)
  ciphertext      BLOB    NOT NULL,
  created_at      INTEGER NOT NULL
);
