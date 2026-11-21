/**
 * Owner: A (handshake payloads defined with B, message payloads with C).
 * Keep in sync with docs/protocol.md §2–§4. Binary values are base64 strings on the wire.
 * The server fills in `from` from the authenticated session; clients never set it.
 */

export interface HandshakeInitPayload {
  version: string;
  algorithms: Record<string, string>;
  sessionId: string;
  initiatorId: string;
  responderId: string;
  initiatorEphemeralPublicKey: string;
  initiatorNonce: string;
}

export interface HandshakeResponsePayload {
  sessionId: string;
  responderEphemeralPublicKey: string;
  responderNonce: string;
  responderSignature: string;
  responderConfirmation: string;
}

export interface HandshakeFinishPayload {
  sessionId: string;
  initiatorSignature: string;
  initiatorConfirmation: string;
}

export interface ChatMessagePayload {
  header: {
    version: string;
    conversationId: string;
    sessionId: string;
    senderId: string;
    receiverId: string;
    ratchetPublicKey: string;
    previousChainLength: number;
    messageNumber: number;
  };
  ciphertext: string;
}

/** Client -> server */
export type ClientToServer =
  | { type: "handshake_init"; conversationId: string; payload: HandshakeInitPayload }
  | { type: "handshake_response"; conversationId: string; payload: HandshakeResponsePayload }
  | { type: "handshake_finish"; conversationId: string; payload: HandshakeFinishPayload }
  | { type: "chat_message"; conversationId: string; payload: ChatMessagePayload };

/** Server -> client (server adds the authenticated sender in `from`) */
export type ServerToClient =
  | (ClientToServer & { from: string })
  | { type: "identity_key_changed"; username: string }
  | { type: "presence"; username: string; online: boolean }
  | { type: "error"; code: string; message: string };
