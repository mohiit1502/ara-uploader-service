import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import * as imageRepo from '../repos/image.repo';
dotenv.config();

import EnvVars from '../constants/EnvVars';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const S3_BUCKET = String(EnvVars.S3_BUCKET || 'aragon-test');
const S3_REGION = String(EnvVars.S3_REGION || 'us-east-1');
const S3_ACCESS_KEY = String(EnvVars.S3_ACCESS_KEY || '');
const S3_SECRET_KEY = String(EnvVars.S3_SECRET_KEY || '');

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
});

export const S3Service = {
  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await s3.send(command);
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
  },

  async getImageThumbnailUrl(id: string) {
    try {
      const image = await imageRepo.getImageById(id);
      if (!image || !image.s3ThumbKey) {
        logger.warn(`[ImageController][getImageThumbnailUrl] Thumbnail not found: ${id}`);
        return {[id]: { error: 'Thumbnail not found' }};
      }
      const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: image.s3ThumbKey });
      const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min
      return {[id]: url};
    } catch (error) {
      logger.error('[ImageController][getImageThumbnailUrl] Error generating presigned url', error);
      return {[id]: { error: 'Error generating thumbnail url' }};
    }
  },

  async getFileStream(key: string): Promise<Readable | null> {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    const response = await s3.send(command);
    return response.Body as Readable;
  },
};
