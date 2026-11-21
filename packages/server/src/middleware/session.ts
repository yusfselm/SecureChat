/**
 * Owner: A
 * Spec: PDF §4 "Authorization"
 * TODO:
 *  - requireSession: read the cookie, look up the session, reject expired/unknown sessions
 *  - attach the authenticated user to the request; this is the ONLY source of "sender"
 *  - requireConversationMember(conversationId): reject non-participants (experiment 05)
 */
export {};
