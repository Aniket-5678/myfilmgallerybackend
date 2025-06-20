import express from 'express';
import upload from '../config/multerConfig.js';
import { deleteImage, getAllImages, uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', upload.single('image'), uploadImage);
router.get('/', getAllImages); //  New route

router.delete('/:id', deleteImage); // DELETE route

export default router;
