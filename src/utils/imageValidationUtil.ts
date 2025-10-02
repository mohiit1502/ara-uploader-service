// Utility for image validation: resolution, blur, face detection, similarity


import sharp from 'sharp';
import { createHash } from 'crypto';
import { detectFacesRekognition } from './rekognitionUtil';

export async function getImageResolution(buffer: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return { width: metadata.width || 0, height: metadata.height || 0 };
}

export async function calculateLaplacianVariance(buffer: Buffer): Promise<number> {
  // Simple blur detection using sharp (not true Laplacian, but a proxy)
  // For real Laplacian, use opencv4nodejs or an API
  const image = sharp(buffer).greyscale();
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });
  // Calculate variance of pixel values as a proxy for sharpness
  const mean = data.reduce((sum, v) => sum + v, 0) / data.length;
  const variance = data.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / data.length;
  return variance;
}



// Placeholder for perceptual hash (for similarity)
export function simpleImageHash(buffer: Buffer): string {
  // Very basic: hash the buffer (not perceptual, but fast)
  // For real pHash, use a library or API
  // Use buffer as string for compatibility
  const hash = createHash('md5').update(buffer.toString('binary')).digest('hex');
  return hash;
}

// Face detection using AWS Rekognition
export async function detectFaces(buffer: Buffer): Promise<{ faceCount: number; largestFaceRatio: number }> {
  return await detectFacesRekognition(buffer);
}
