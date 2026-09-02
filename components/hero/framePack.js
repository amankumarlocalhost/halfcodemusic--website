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
 * This reader does NOT decode. It hands out the raw WebP bytes for each frame
 * and lets the caller decide when to turn them into pixels.
 *
 * That split matters for more than tidiness. The previous version decoded here,
 * into <img> elements via URL.createObjectURL. Every one of those blob URLs
 * shows up in the DevTools Network panel as its own entry, with a working
 * Preview tab — so a ~600 frame sequence produced ~600 inspectable image
 * requests and undid the whole point of shipping one opaque binary. Bytes in,
 * bytes out: the caller decodes with createImageBitmap, which never mints a URL
 * and never appears in the Network panel.
 *
 * @param {{url: string, frameCount: number}} manifest
 * @param {{onFrame: (index: number, bytes: Uint8Array) => void, signal?: AbortSignal}} options
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

  /**
   * Hand over every payload that has fully arrived, in stream order.
   *
   * `buffer.slice` copies, so each frame owns its bytes and the whole pack
   * buffer is not kept alive by them. At roughly 20 KB a frame this is a few
   * MB for the entire sequence — cheap enough to hold encoded indefinitely,
   * which is what lets the decoded-pixel cache stay small.
   */
  const drain = () => {
    if (!offsets) return;

    while (emitted < frameCount && offsets[emitted] + lengths[emitted] <= filled) {
      const slot = emitted++;
      if (signal?.aborted) return;
      onFrame(indices[slot], buffer.slice(offsets[slot], offsets[slot] + lengths[slot]));
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
}
