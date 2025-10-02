import { Router, RequestHandler } from 'express';
import { uploadImages, getImage, getImageThumbnail } from '../controllers/image.controller';
import { uploadMiddleware } from '../middlewares/upload';

const router = Router();

// POST /images/upload - batch upload
router.post('/secure/image/upload', uploadMiddleware.array('files', 10), uploadImages as RequestHandler);

// GET /images/:id - get original image
router.get('/secure/image/:id', getImage);

// GET /images/:id/thumbnail - get thumbnail/small version
router.get('/secure/image/:id/thumbnail', getImageThumbnail);

// DELETE /images/:id - delete image by id
router.delete('/secure/image/:id', async (req, res) => {
  // Placeholder: Call service to delete image by id
  // await ImageService.deleteImage(req.params.id);
  res.status(204).send();
});

export default router;

// Image-related endpoints

export {};
