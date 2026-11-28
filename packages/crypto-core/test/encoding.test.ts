import { describe, expect, it } from "vitest";
import {
  EncodingError,
  concatBytes,
  constantTimeEqual,
  decodeFields,
  decodeUint32,
  encodeFields,
  encodeUint32,
  fromUtf8,
  utf8,
} from "../src/encoding.ts";

const bytes = (...values: number[]) => new Uint8Array(values);

describe("encodeFields / decodeFields", () => {
  it("produces the documented byte layout", () => {
    expect(encodeFields([utf8("ab"), utf8("c")])).toEqual(
      bytes(0, 0, 0, 2, 0x61, 0x62, 0, 0, 0, 1, 0x63),
    );
  });

  it("round-trips a list of fields", () => {
    const fields = [utf8("SecureChat-v1"), bytes(1, 2, 3), new Uint8Array(32).fill(7)];
    expect(decodeFields(encodeFields(fields))).toEqual(fields);
  });

  it("supports empty fields and an empty list", () => {
    expect(decodeFields(encodeFields([new Uint8Array(0)]))).toEqual([new Uint8Array(0)]);
    expect(encodeFields([])).toEqual(new Uint8Array(0));
    expect(decodeFields(new Uint8Array(0))).toEqual([]);
  });

  it("keeps field boundaries unambiguous", () => {
    const a = encodeFields([utf8("ab"), utf8("c")]);
    const b = encodeFields([utf8("a"), utf8("bc")]);
    expect(a).not.toEqual(b);
  });

  it("rejects a truncated length prefix", () => {
    expect(() => decodeFields(bytes(0, 0, 0))).toThrow(EncodingError);
  });

  it("rejects a truncated field", () => {
    expect(() => decodeFields(bytes(0, 0, 0, 5, 1, 2))).toThrow(EncodingError);
  });

  it("rejects an unexpected number of fields", () => {
    const encoded = encodeFields([utf8("a"), utf8("b"), utf8("extra")]);
    expect(() => decodeFields(encoded, 2)).toThrow(EncodingError);
    expect(decodeFields(encoded, 3)).toHaveLength(3);
  });

  it("decodes correctly from a subarray with a non-zero offset", () => {
    const encoded = encodeFields([utf8("x"), utf8("yz")]);
    const padded = concatBytes(bytes(9, 9, 9), encoded);
    expect(decodeFields(padded.subarray(3))).toEqual([utf8("x"), utf8("yz")]);
  });
});

describe("uint32", () => {
  it("encodes big-endian and round-trips", () => {
    expect(encodeUint32(1)).toEqual(bytes(0, 0, 0, 1));
    expect(encodeUint32(0x01020304)).toEqual(bytes(1, 2, 3, 4));
    expect(decodeUint32(encodeUint32(4294967295))).toBe(4294967295);
  });

  it("rejects values that are not uint32", () => {
    for (const value of [-1, 1.5, 2 ** 32, Number.NaN]) {
      expect(() => encodeUint32(value)).toThrow(EncodingError);
    }
    expect(() => decodeUint32(bytes(1, 2, 3))).toThrow(EncodingError);
  });
});

describe("utf8", () => {
  it("round-trips non-ASCII text", () => {
    expect(fromUtf8(utf8("çğışöü"))).toBe("çğışöü");
  });

  it("rejects invalid UTF-8", () => {
    expect(() => fromUtf8(bytes(0xff, 0xfe))).toThrow(EncodingError);
  });
});

describe("constantTimeEqual", () => {
  it("compares contents", () => {
    expect(constantTimeEqual(bytes(1, 2, 3), bytes(1, 2, 3))).toBe(true);
    expect(constantTimeEqual(bytes(1, 2, 3), bytes(1, 2, 4))).toBe(false);
    expect(constantTimeEqual(bytes(1, 2), bytes(1, 2, 3))).toBe(false);
  });
});
