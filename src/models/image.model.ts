// Prisma model for images (for reference, also add to schema.prisma)

import { IMAGESTATUS } from '@src/types/enums';


export interface ImageMeta {
  width?: number;
  height?: number;
  format?: string;
  size?: number; // bytes
  hash?: string; // for similarity
  faces?: number;
  blurScore?: number;
  exif?: Record<string, unknown>;
  thumbnailUrl?: string;
  [key: string]: unknown;
}

export interface Image {
  id: string;
  filename: string;
  s3Key?: string;
  s3Url?: string;
  url?: string;
  status: IMAGESTATUS;
  reason?: string;
  // meta: ImageMeta;
  mime?: string;
  type?: string;
  metaUrl?: string;
  createdBy?: string;
  updatedBy?: string;
  secure?: boolean;
  createdAt: Date;
  updatedAt: Date;
  hash?: string;
  userId?: string;
}
