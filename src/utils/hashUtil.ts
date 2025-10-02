// Utility for image similarity (hashing)

import { createHash } from 'crypto';

/**
 * Generates a SHA-256 hash for a given buffer or string.
 * @param data Buffer or string to hash
 * @returns Hex string hash
 */
export function generateSHA256Hash(data: Buffer | string): string {
  // Ensure data is a string or Uint8Array for compatibility
  const input: string | Uint8Array = Buffer.isBuffer(data) ? new Uint8Array(data) : data;
  return createHash('sha256').update(input).digest('hex');
}

// Future: Add perceptual hash/image similarity functions here as needed.
