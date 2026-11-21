/**
 * Owner: A (everyone reviews). Keep in sync with docs/protocol.md §1.
 * REST request/response shapes. Binary values are base64 strings on the wire.
 * The sender is ALWAYS taken from the session cookie on the server, never from these bodies.
 */

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserSummary {
  username: string;
  online: boolean;
}

export interface PublishIdentityKeyRequest {
  identityPublicKey: string; // base64, Ed25519
}

export interface IdentityKeyResponse {
  username: string;
  identityPublicKey: string; // base64 – NOT trusted until the user verifies the fingerprint
}

export interface ConversationResponse {
  conversationId: string;
  participants: [string, string];
}
