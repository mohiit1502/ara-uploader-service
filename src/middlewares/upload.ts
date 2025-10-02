import multer from 'multer';

// Use memory storage for direct buffer access (for S3 upload)
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({ storage });
