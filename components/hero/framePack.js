"use client";

import { MASK_KEY } from "@/lib/seqKey";

/** Fixed part of the container header: count (u32) + width (u16) + height (u16). */
const HEADER_BYTES = 8;

let keyBytes = null;

/** The XOR key, decoded from base64 once and reused. */
function maskKey() {
  if (!keyBytes) {
    const binary = atob(MASK_KEY);
    keyBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) keyBytes[i] = binary.charCodeAt(i);
  }
  return keyBytes;
}

/**
 * Streams one packed frame sequence and hands back frames as they arrive.
 *
 * The pack is a single masked binary — see scripts/pack-frames.mjs for the
 * layout. Bytes are unmasked as they land rather than after the whole download,
 * so frames can be decoded and shown while the rest is still in flight.
 *
 * Frames arrive in the pack's own order, which is coarse-to-fine across the
 * timeline rather than play order: the first seconds of the stream already
 * cover the whole animation roughly, and later passes fill in between. Each
 * payload carries its real frame index in the header's index table, so
 * `onFrame` always reports the true position.
 *
 * Frames are decoded into <img> elements via blob URLs rather than
 * ImageBitmaps. That is deliberate: an ImageBitmap is retained until it is
 * explicitly closed, and 600 of them at 1600x900 would pin roughly 3 GB of
 * decoded pixels. Browsers evict <img> bitmaps under pressure and re-decode on
 * demand, which is what keeps this affordable on a phone.
 *
 * @param {{url: string, frameCount: number}} manifest
 * @param {{onFrame: (index: number, img: HTMLImageElement) => void, signal?: AbortSignal}} options
 */
export async function loadFramePack(manifest, { onFrame, signal }) {
  const key = maskKey();
  const response = await fetch(manifest.url, { signal });
  if (!response.ok) throw new Error(`frame pack ${response.status}`);

  const declared = Number(response.headers.get("content-length")) || 0;
  const total = declared || manifest.bytes || 0;

  // One buffer for the whole pack. When the length is unknown we still know the
  // expected size from the manifest, so a preallocated buffer is safe either way.
  let buffer = new Uint8Array(total || 0);
  let filled = 0;
  let grown = total === 0;

  const reader = response.body.getReader();

  // Header state, parsed once the fixed header and both tables have landed.
  let frameCount = 0;
  let headerBytes = 0;
  let offsets = null; // byte offset of each payload, in stream order
  let lengths = null;
  let indices = null;
  let emitted = 0;

  // Decodes are awaited one at a time; a fast connection would otherwise queue
  // hundreds of concurrent decodes and stall the main thread.
  let decodeChain = Promise.resolve();

  const view = () => new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  const tryParseHeader = () => {
    if (offsets || filled < HEADER_BYTES) return;

    const dv = view();
    frameCount = dv.getUint32(0, true);
    headerBytes = HEADER_BYTES + frameCount * 4 + frameCount * 2;
    if (filled < headerBytes) return;

    lengths = new Uint32Array(frameCount);
    indices = new Uint16Array(frameCount);
    offsets = new Uint32Array(frameCount);

    let at = headerBytes;
    for (let i = 0; i < frameCount; i++) {
      lengths[i] = dv.getUint32(HEADER_BYTES + i * 4, true);
      indices[i] = dv.getUint16(HEADER_BYTES + frameCount * 4 + i * 2, true);
      offsets[i] = at;
      at += lengths[i];
    }
  };

  /** Decode every payload that has fully arrived, in stream order. */
  const drain = () => {
    if (!offsets) return;

    while (emitted < frameCount && offsets[emitted] + lengths[emitted] <= filled) {
      const slot = emitted++;
      const bytes = buffer.slice(offsets[slot], offsets[slot] + lengths[slot]);
      const frameIndex = indices[slot];

      decodeChain = decodeChain.then(async () => {
        if (signal?.aborted) return;
        const url = URL.createObjectURL(new Blob([bytes], { type: "image/webp" }));
        const img = new Image();
        img.decoding = "async";
        img.src = url;
        try {
          await img.decode();
          if (signal?.aborted) {
            URL.revokeObjectURL(url);
            return;
          }
          onFrame(frameIndex, img);
        } catch {
          // A payload that will not decode just leaves a gap in the sequence.
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (signal?.aborted) break;

    // Grow only if the length was unknown up front.
    if (grown && filled + value.length > buffer.length) {
      const next = new Uint8Array(Math.max(buffer.length * 2 || 1024, filled + value.length));
      next.set(buffer.subarray(0, filled));
      buffer = next;
    }

    buffer.set(value, filled);

    // Unmask only the bytes that just landed. The key stays in phase because it
    // is indexed by absolute offset, not by position within the chunk.
    for (let i = 0; i < value.length; i++) {
      buffer[filled + i] ^= key[(filled + i) % key.length];
    }
    filled += value.length;

    tryParseHeader();
    drain();
  }

  await decodeChain;
}
