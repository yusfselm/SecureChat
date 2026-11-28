/**
 * Owner: B
 * crypto-core deliberately has no DOM or Node type definitions (it must stay pure).
 * TextEncoder / TextDecoder exist in every browser and in Node, so we declare
 * only the small part of their API that we use.
 */
declare class TextEncoder {
  encode(input?: string): Uint8Array;
}

declare class TextDecoder {
  constructor(label?: string, options?: { fatal?: boolean });
  decode(input?: Uint8Array): string;
}
