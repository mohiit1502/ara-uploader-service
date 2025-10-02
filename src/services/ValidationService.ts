// Validation logic for images (format, size, resolution, etc.)

import { fileRules } from '../config/file-rules';
import {
  getImageResolution,
  calculateLaplacianVariance,
  simpleImageHash,
  detectFaces,
} from '../utils/imageValidationUtil';

import * as imageRepo from '../repos/image.repo';
import { randomUUID } from 'crypto';

export interface ValidationResponse {
	id: string
  file: Express.Multer.File;
  valid: boolean;
  reason?: string;
  shouldSave: boolean;
}

export interface FileValidationConfig {
  maxSize: number;
  allowedTypes: string[];
}

export class ValidationService {
  private config: FileValidationConfig;

  public constructor(config: FileValidationConfig = fileRules) {
    this.config = config;
  }

  public async validateFiles(files: Express.Multer.File[]): Promise<ValidationResponse[]> {
    const promises = files.map(file => this.validateFile(file));
    return await Promise.all(promises);
  }

  public async validateFile(file: Express.Multer.File): Promise<ValidationResponse> {
    // Validate size
    if (file.size > this.config.maxSize) {
      return { id: randomUUID(), file, valid: false, reason: 'File too large', shouldSave: false };
    }
    // Validate type (JPG, PNG, HEIC only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic'];
    if (!allowedTypes.includes(file.mimetype)) {
      return { id: randomUUID(), file, valid: false, 
        reason: 'Invalid file type (only JPG, PNG, HEIC allowed)', shouldSave: false };
    }
    // Validate not corrupt
    if (!file.buffer || file.buffer.length === 0) {
      return { id: randomUUID(), file, valid: false, reason: 'File is empty or corrupt', shouldSave: false };
    }
    // Validate resolution (min 300x300)
    const { width, height } = await getImageResolution(file.buffer);
    if (width < 300 || height < 300) {
      return { id: randomUUID(), file, valid: false, 
        reason: 'Image resolution too small (min 300x300)', shouldSave: true };
    }
    // Validate similarity (simple hash, check DB for duplicate hash)
    const hash = simpleImageHash(file.buffer);
    const existing = await imageRepo.findImageByHash(hash);
    if (existing) {
      return { id: randomUUID(), file, valid: false, 
        reason: 'Image is too similar to an existing one (duplicate)', shouldSave: true };
    }
    // Validate blur (Laplacian variance proxy, threshold 100)
    const variance = await calculateLaplacianVariance(file.buffer);
    if (variance < 100) {
      return { id: randomUUID(), file, valid: false, reason: 'Image is too blurry', shouldSave: true };
    }
    // Validate faces (AWS Rekognition: 1 face, face must be >20% of image)
    const { faceCount, largestFaceRatio } = await detectFaces(file.buffer);
    if (faceCount === 0) {
      return { id: randomUUID(), file, valid: false, reason: 'No face detected', shouldSave: true };
    }
    if (faceCount > 1) {
      return { id: randomUUID(), file, valid: false, reason: 'Multiple faces detected', shouldSave: true };
    }
    if (largestFaceRatio < 0.1) {
      return { id: randomUUID(), file, valid: false, reason: 'Detected face is too small', shouldSave: true };
    }
    // Virus scan
    const scanResults = await this.virusScan(file);
    if (scanResults === false) {
      return { id: randomUUID(), file, valid: false, reason: 'File failed virus scan', shouldSave: true };
    }
    // Passed all checks
    return { id: randomUUID(), file, valid: true, shouldSave: true };
  }

  public virusScan(file: Express.Multer.File): Promise<boolean> {
    // Stub: Integrate with real virus scanning service (e.g. ClamAV, VirusTotal)
    // For now, just resolve true (no virus)
    return Promise.resolve(true);
  }
}

export {};
