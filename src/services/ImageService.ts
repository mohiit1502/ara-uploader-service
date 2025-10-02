// Business logic for image processing, validation, S3, etc.
import { S3Service } from './s3.service';
import * as imageRepo from '../repos/image.repo';
import sharp from 'sharp';
import logger from '../utils/logger';
import { generateSHA256Hash } from '@src/utils/hashUtil';
import { ValidationResponse } from './ValidationService';

export type ImageUploadResult =
  | {
      filename: string;
      status: 'COMPLETED' | 'ACCEPTED' | 'REJECTED' | 'FAILED';
      id: string;
			file: Express.Multer.File & { id: string }
      s3Url?: string;
      s3Key?: string;
      thumbUrl?: string;
      thumbKey?: string;
      error?: string;
    }

export class ImageService {


  /**
   * Stub: Enqueue image processing job (replace with real queue integration)
   */
  public static async enqueueImageProcessingJob(imageId: string): Promise<void> {
    // TODO: Integrate with Bull, RabbitMQ, or another queue
    // For now, just log
    logger.info(`[QUEUE] Would enqueue image processing for imageId: ${imageId}`);
    return await Promise.resolve();
  }

  public static async getImageThumbnailUrl(id: string) {
    return await S3Service.getImageThumbnailUrl(id);
  }


  public static async processBatch(results: ValidationResponse[]): Promise<ImageUploadResult[]> {
    // Upload each file to S3 and return result
    return await Promise.all(results.map(async (result: ValidationResponse) => {
      const file = result.file as unknown as Express.Multer.File & { id: string };
      try {
        // Detect HEIC and convert to JPEG for S3 upload
        let ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
        let bufferToUpload = file.buffer;
        let mimeTypeToUpload = file.mimetype;
        if (ext === 'heic' || mimeTypeToUpload === 'image/heic') {
          bufferToUpload = await sharp(file.buffer).jpeg().toBuffer();
          ext = 'jpg';
          mimeTypeToUpload = 'image/jpeg';
        }
        const fileHash = generateSHA256Hash(bufferToUpload);
        const s3Key = `${result.id}.${ext}`;
        const s3Url = await S3Service.uploadFile(s3Key, bufferToUpload, mimeTypeToUpload);

        // Generate thumbnail (150px width, maintain aspect ratio, always JPEG)
        const thumbBuffer = await sharp(bufferToUpload)
          .resize({ width: 150 })
          .jpeg()
          .toBuffer();
        const thumbKey = `${result.id}_thumb.jpg`;
        const thumbMime = 'image/jpeg';
        const thumbUrl = await S3Service.uploadFile(thumbKey, thumbBuffer, thumbMime);

        // Update DB with S3 info and status (optionally add thumb info)
        await imageRepo.updateImageS3Info(result.id, s3Key, s3Url, thumbKey, thumbUrl);
        await imageRepo.updateImageStatus(result.id, 'COMPLETED', fileHash);
        return {
          filename: file.originalname,
          status: result.shouldSave ? (result.valid ? 'ACCEPTED' : 'REJECTED') : 'FAILED',
          s3Url,
          s3Key,
          thumbUrl,
          thumbKey,
          id: result.id,
          file,
        } as ImageUploadResult;
      } catch (err) {
        await imageRepo.updateImageStatus(result.id, 'FAILED');
        return {
          filename: file.originalname,
          status: 'FAILED',
          error: (err as Error).message,
          id: result.id,
          file,
        } as ImageUploadResult;
      }
    }));
  }

  public static async getImageById(id: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    // TODO: Fetch image from storage (DB/S3/local)
    // Return { buffer, mimeType }
    return await Promise.resolve(null);
  }

  public static async getImageThumbnailById(id: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    // TODO: Fetch and generate thumbnail (resize with sharp)
    return await Promise.resolve(null);
  }
}
