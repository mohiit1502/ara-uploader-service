// DB access for images (CRUD, queries)
import { PrismaClient, Image } from '@prisma/client';

/**
 * Update S3 key and URL for an image by id
 */
export async function updateImageS3Info(
  id: string,
  s3Key: string,
  s3Url: string,
  s3ThumbKey: string,
  s3ThumbUrl: string,
) {
  return await prisma.image.update({
    where: { id },
    data: { s3Key, s3Url, s3ThumbKey, s3ThumbUrl },
  });
}

const prisma = new PrismaClient();

/**
 * Batch create image metadata records
 */
export async function createImages(images: Omit<Image, 'id' | 'createdAt' | 'updatedAt'>[]) {
  return await prisma.image.createMany({ data: images });
}

/**
 * Update image status by id
 */
export async function updateImageStatus(id: string, status: string, hash?: string) {
  return await prisma.image.update({ where: { id }, data: hash ? { status, hash } : {status} });
}

/**
 * Get image by hash (for deduplication)
 */
export async function findImageByHash(hash: string) {
  return await prisma.image.findFirst({ where: { hash } });
}

/**
 * Get image by id
 */
export async function getImageById(id: string) {
  return await prisma.image.findUnique({ where: { id } });
}
