/**
 * Owner: B
 * Spec: PDF §6 "Handshake transcript" – the encoding must identify field boundaries unambiguously.
 * Protocol: docs/protocol.md §0.
 *
 * Format: every field is written as  uint32_be(length) || bytes  and fields are concatenated.
 *   enc["ab", "c"] = 00000002 6162 00000001 63
 *   enc["a", "bc"] = 00000001 61   00000002 6263   -> different bytes, so no ambiguity.
 *
 * Used for the handshake transcript (B) and for AEAD associated data (C).
 */
import type { Bytes } from "./types.ts";

export const LENGTH_PREFIX_BYTES = 4;
const MAX_UINT32 = 0xffffffff;

export class EncodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EncodingError";
  }
}

/** Encode a list of fields as length-prefixed bytes in the given order. */
export function encodeFields(fields: readonly Bytes[]): Bytes {
  let total = 0;
  for (const field of fields) {
    if (field.length > MAX_UINT32) throw new EncodingError("field too long");
    total += LENGTH_PREFIX_BYTES + field.length;
  }

  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  let offset = 0;
  for (const field of fields) {
    view.setUint32(offset, field.length, false); // big-endian
    offset += LENGTH_PREFIX_BYTES;
    out.set(field, offset);
    offset += field.length;
  }
  return out;
}

/**
 * Decode length-prefixed bytes back into fields.
 * Throws on a truncated length prefix or field. If expectedCount is given,
 * also throws when the number of fields differs (e.g. extra trailing fields).
 */
export function decodeFields(data: Bytes, expectedCount?: number): Bytes[] {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const fields: Bytes[] = [];
  let offset = 0;

  while (offset < data.length) {
    if (offset + LENGTH_PREFIX_BYTES > data.length) {
      throw new EncodingError("truncated length prefix");
    }
    const length = view.getUint32(offset, false);
    offset += LENGTH_PREFIX_BYTES;
    if (offset + length > data.length) {
      throw new EncodingError("truncated field");
    }
    fields.push(data.slice(offset, offset + length));
    offset += length;
  }

  if (expectedCount !== undefined && fields.length !== expectedCount) {
    throw new EncodingError(`expected ${expectedCount} fields, got ${fields.length}`);
  }
  return fields;
}

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });

/** String -> UTF-8 bytes (for user ids, labels, version strings). */
export function utf8(text: string): Bytes {
  return utf8Encoder.encode(text);
}

/** UTF-8 bytes -> string. Throws on invalid UTF-8. */
export function fromUtf8(bytes: Bytes): string {
  try {
    return utf8Decoder.decode(bytes);
  } catch {
    throw new EncodingError("invalid UTF-8");
  }
}

/** Unsigned 32-bit integer -> 4 bytes big-endian (for message counters PN and N). */
export function encodeUint32(value: number): Bytes {
  if (!Number.isInteger(value) || value < 0 || value > MAX_UINT32) {
    throw new EncodingError("value is not a uint32");
  }
  const out = new Uint8Array(4);
  new DataView(out.buffer).setUint32(0, value, false);
  return out;
}

/** 4 bytes big-endian -> unsigned 32-bit integer. */
export function decodeUint32(bytes: Bytes): number {
  if (bytes.length !== 4) throw new EncodingError("uint32 must be exactly 4 bytes");
  return new DataView(bytes.buffer, bytes.byteOffset, 4).getUint32(0, false);
}

/** Concatenate byte arrays. */
export function concatBytes(...parts: readonly Bytes[]): Bytes {
  const out = new Uint8Array(parts.reduce((sum, p) => sum + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

/**
 * Constant-time equality for secret-dependent values (MACs, key-confirmation values).
 * The running time depends only on the length, not on where the first difference is.
 */
export function constantTimeEqual(a: Bytes, b: Bytes): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}
