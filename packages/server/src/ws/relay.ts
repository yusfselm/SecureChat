/**
 * Owner: A
 * TODO:
 *  - WebSocket endpoint /ws, authenticated by the session cookie
 *  - relay handshake_init / handshake_response / handshake_finish / chat_message
 *    (types in @securechat/protocol) only between the two conversation members
 *  - set `from` from the session, ignore any client-supplied sender
 *  - store chat_message ciphertext + header in the messages table
 */
export {};
