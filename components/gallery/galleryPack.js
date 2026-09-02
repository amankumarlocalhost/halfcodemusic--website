"use client";

import { GALLERY_KEY } from "@/lib/galleryKey";

/** Fixed part of the container header: image count (u32). */
const HEADER_BYTES = 4;

let keyBytes = null;

/** The XOR key, decoded from base64 once and reused. */
function maskKey() {
  if (!keyBytes) {
    const binary = atob(GALLERY_KEY);
    keyBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) keyBytes[i] = binary.charCodeAt(i);
  }
  return keyBytes;
}

/**
 * One entry per variant URL. A pack is downloaded at most once per page load —
 * the grid and the lightbox both go through here, and navigating away from
 * /gallery and back replays the cache instead of refetching.
 *
 * The cache holds ENCODED bytes, not decoded images. A photo is a few tens of
 * KB encoded and several MB decoded, so keeping the compressed form is what
 * makes a session-long cache affordable; each component decodes the one photo
 * it needs and releases it on unmount.
 *
 * @type {Map<string, {chunks: (Uint8Array|null)[], listeners: Set<Function>, started: boolean}>}
 */
const packs = new Map();

function entryFor(variant) {
  let entry = packs.get(variant.url);
  if (!entry) {
    entry = { chunks: new Array(variant.count).fill(null), listeners: new Set(), started: false };
    packs.set(variant.url, entry);
  }
  return entry;
}

/**
 * Streams one packed variant, unmasking and decoding as bytes land.
 *
 * Deliberately a near-twin of components/hero/framePack.js rather than a shared
 * abstraction: the two containers differ (the hero's frames are all one size and
 * arrive in a coarse-to-fine ladder; gallery photos each carry their own
 * dimensions and stay in order), and folding both into one parameterised reader
 * would make the hero's hot path harder to follow for no real saving.
 *
 * As in the hero, this reader hands back raw bytes and decodes nothing. Feeding
 * payloads to <img> through URL.createObjectURL would give every photo its own
 * blob: URL, and each of those appears in the DevTools Network panel as an
 * inspectable image request — which would hand back exactly what packing them
 * into one opaque binary was meant to prevent.
 */
async function streamPack(variant, entry) {
  const key = maskKey();
  const response = await fetch(variant.url);
  if (!response.ok) throw new Error(`gallery pack ${response.status}`);

  const declared = Number(response.headers.get("content-length")) || 0;
  const total = declared || variant.bytes || 0;

  let buffer = new Uint8Array(total || 0);
  let filled = 0;
  const grown = total === 0;

  const reader = response.body.getReader();

  // Header state, parsed once the fixed header and all three tables have landed.
  let count = 0;
  let headerBytes = 0;
  let offsets = null;
  let lengths = null;
  let emitted = 0;

  const view = () => new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  const tryParseHeader = () => {
    if (offsets || filled < HEADER_BYTES) return;

    const dv = view();
    count = dv.getUint32(0, true);
    headerBytes = HEADER_BYTES + count * 8;
    if (filled < headerBytes) return;

    lengths = new Uint32Array(count);
    offsets = new Uint32Array(count);

    let at = headerBytes;
    for (let i = 0; i < count; i++) {
      lengths[i] = dv.getUint32(HEADER_BYTES + i * 4, true);
      offsets[i] = at;
      at += lengths[i];
    }
    // Widths and heights also live in the header, but the manifest already
    // carries them for layout, so there is nothing to read them for here.
  };

  /**
   * Publish every payload that has fully arrived, in order.
   *
   * `buffer.slice` copies, so a photo's bytes do not pin the whole pack buffer.
   */
  const drain = () => {
    if (!offsets) return;

    while (emitted < count && offsets[emitted] + lengths[emitted] <= filled) {
      const index = emitted++;
      const bytes = buffer.slice(offsets[index], offsets[index] + lengths[index]);
      entry.chunks[index] = bytes;
      for (const listener of entry.listeners) listener(index, bytes);
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

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

/**
 * Subscribes to a variant, starting its download on first use.
 *
 * `onBytes(index, bytes)` fires once per photo, with the encoded WebP for that
 * photo. Payloads that arrived before this call are replayed synchronously, so
 * a late subscriber — the lightbox, opened after the grid has filled in — never
 * misses anything.
 *
 * Returns an unsubscribe function. Note that unsubscribing does NOT abort the
 * download or drop the cache: the pack is session-level, and tearing it down on
 * unmount would mean re-downloading every photo on the way back to the page.
 * Only encoded bytes are held, so this stays cheap.
 *
 * @param {{url: string, count: number, bytes: number}} variant
 * @param {(index: number, bytes: Uint8Array) => void} onBytes
 */
export function subscribeToPack(variant, onBytes) {
  const entry = entryFor(variant);
  entry.listeners.add(onBytes);

  for (let i = 0; i < entry.chunks.length; i++) {
    if (entry.chunks[i]) onBytes(i, entry.chunks[i]);
  }

  if (!entry.started) {
    entry.started = true;
    streamPack(variant, entry).catch(() => {
      // A failed pack leaves every cell on its poster rather than blanking the
      // gallery. Allow a later mount to retry.
      entry.started = false;
    });
  }

  return () => entry.listeners.delete(onBytes);
}
