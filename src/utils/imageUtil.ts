import sharp from 'sharp';

// Convert HEIC to JPEG or PNG
export function convertHeicToJpeg(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).jpeg().toBuffer();
}

export function convertHeicToPng(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).png().toBuffer();
}

// Resize image for thumbnail
export function createThumbnail(buffer: Buffer, width = 200): Promise<Buffer> {
  return sharp(buffer).resize({ width }).toBuffer();
}

// Get image metadata (format, size, dimensions)
export function getImageMetadata(buffer: Buffer): Promise<sharp.Metadata> {
  return sharp(buffer).metadata();
}

// Calculate blurriness using Laplacian variance (stub, real impl needs opencv)
export function calculateBlurriness(buffer: Buffer): Promise<number> {
  // TODO: Use OpenCV for real Laplacian variance
  // For now, return a stub value
  return Promise.resolve(100);
}

// ...add more helpers as needed
