import { Request, Response } from 'express';
import { ImageService } from '../services/ImageService';
import { ValidationService, ValidationResponse } from '../services/ValidationService';
import {fileRules} from '../config/file-rules';
import logger from '../utils/logger';
import * as imageRepo from '../repos/image.repo';
import { IMAGESTATUS } from '@src/types/enums';
import { randomUUID } from 'crypto';

// POST /images/upload - Batch upload endpoint
export const uploadImages = async (req: Request & { files: Express.Multer.File[]}, res: Response) => {
  try {
    // Multer adds files property to Request, but TS doesn't know by default
    const files = req.files || [];
    if (!Array.isArray(files) || files.length === 0) {
      logger.warn('[ImageController][uploadImages] No files uploaded');
      return res.status(400).json({ message: 'No files uploaded.' });
    }
		
    // Validation hook: validate files before processing (now async, includes virus scan)
    const validator = new ValidationService(fileRules);
    const validationResults: ValidationResponse[] = await validator.validateFiles(files);
    // Only save files that shouldSave is true (valid or soft-failed)
    const resultsToSave = validationResults.filter(r => r.shouldSave);
    // For processing, only use files that are valid
    const validFiles = validationResults.filter(r => r.valid);

    logger.info('[ImageController][uploadImages] Saving files metadata to DB');
    // Prepare metadata for DB (status: 'pending')
    const user = ('user' in req ? req.user : {username: ''}) as 
			{ username: string, id: string }; // adjust if you have user info in req
    // Assign a uuid to each image and pass it through
    // Save metadata for all files that should be saved (valid or soft-failed)
    const imagesMeta = resultsToSave.map(resultToSave => {
      const file = resultToSave.file as unknown as Express.Multer.File & { id: string };
      // Attach id to file for later reference
      const id = resultToSave.id;
      file.id = id;
      return {
        id: resultToSave.id,
        filename: file.originalname,
        s3Key: `pl-${id}`, // to be filled after upload
        s3Url: '', // to be filled after upload
        s3ThumbKey: `thpl-${id}`, // to be filled after upload
        s3ThumbUrl: '', // to be filled after upload
        status: IMAGESTATUS.PENDING,
        mime: file.mimetype,
        type: 'image',
        metaUrl: '', // to be filled after upload
        createdBy: user.username || 'system',
        updatedBy: user.username || 'system',
        secure: false, // set as needed
        hash: '',
        userId: user.id || '',
        // createdAt, updatedAt handled by DB
        // Add more fields as needed
      };
    });

    // Save metadata to DB
    let dbResult;
    try {
      dbResult = await imageRepo.createImages(imagesMeta);
      logger.info('[ImageController][uploadImages] Metadata saved to DB', dbResult);
    } catch (dbErr) {
      logger.error('[ImageController][uploadImages] Error saving metadata to DB', dbErr);
      return res.status(500).json({ message: 'Error saving image metadata' });
    }

    logger.info('[ImageController][uploadImages] Moving files to batch for processing');
    // Process valid files only after DB save
    // Pass the id through to processBatch and expect it in the result
    const processedResults = await ImageService.processBatch(resultsToSave);

    // Update status in DB for each processed file
    for (const result of processedResults) {
      if (result && result.id && result.status) {
        try {
          logger.info(`[ImageController][uploadImages] Updating status for image ${result.id} to ${result.status}`);
          await imageRepo.updateImageStatus(result.id, result.status);
        } catch (err) {
          logger.error(`[ImageController][uploadImages] Failed to update status for image ${result.id}:`, err);
        }
        // Enqueue further async processing for successful images (stub)
        if (result.status === 'COMPLETED') {
          await ImageService.enqueueImageProcessingJob(result.id);
        }
      }
    }

    const promises = processedResults.map(r => ImageService.getImageThumbnailUrl(r.id));
    const responses = await Promise.all(promises);
    const flatResponseObj: {[key: string]: string | { message: string }} = {};
    responses.forEach(r => {
      Object.assign(flatResponseObj, r);
    });
    processedResults.forEach(r => {
      const resp = flatResponseObj[r.id];
      if (resp && typeof resp === 'string') {
        r.thumbUrl = resp; // add thumbnailUrl to result
      }
    });
    
    // Build a response that includes all validation results for UI display
    const results = validationResults.map(r => {
      if (r.shouldSave) {
        // Find processed result for this file (may be undefined for soft-failed)
        const processed = processedResults.find(p => p.id === r.id);
        return {
          filename: r.file.originalname,
          status: r.valid ? 'COMPLETED' : 'FAILED',
          reason: r.valid ? undefined : r.reason,
          shouldSave: true,
          ...processed, // includes s3Url, s3Key, thumbUrl, etc. if available
        };
      } else {
        // Hard-failed, not saved
        return {
          filename: r.file.originalname,
          status: 'REJECTED',
          reason: r.reason,
          shouldSave: false,
        };
      }
    });
    logger.info('[ImageController][uploadImages] Upload results', results);
    return res.status(200).json({ results });
  } catch (error) {
    logger.error('[ImageController][uploadImages] Error uploading images', error);
    return res.status(500).json({ message: 'Error uploading images' });
  }
};

// GET /images/:id - Get original image
export const getImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const imageData = await ImageService.getImageById(id);
    if (!imageData) {
      logger.warn(`[ImageController][getImage] Image not found: ${id}`);
      return res.status(404).json({ message: 'Image not found' });
    }
    res.setHeader('Content-Type', imageData.mimeType || 'image/jpeg');
    logger.info(`[ImageController][getImage] Served image: ${id}`);
    return res.send(imageData.buffer);
  } catch (error) {
    logger.error('[ImageController][getImage] Error retrieving image', error);
    return res.status(500).json({ message: 'Error retrieving image' });
  }
};

// GET /images/:id/thumbnail - Get thumbnail/small version
export const getImageThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const thumbData = await ImageService.getImageThumbnailById(id);
    if (!thumbData) {
      logger.warn(`[ImageController][getImageThumbnail] Thumbnail not found: ${id}`);
      return res.status(404).json({ message: 'Thumbnail not found' });
    }
    res.setHeader('Content-Type', thumbData.mimeType || 'image/jpeg');
    logger.info(`[ImageController][getImageThumbnail] Served thumbnail: ${id}`);
    return res.send(thumbData.buffer);
  } catch (error) {
    logger.error('[ImageController][getImageThumbnail] Error retrieving thumbnail', error);
    return res.status(500).json({ message: 'Error retrieving thumbnail' });
  }
};