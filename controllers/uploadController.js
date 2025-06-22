import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Image from '../models/Image.js';

dotenv.config();

// Upload image (now from Cloudinary)
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const newImage = new Image({
      filename: req.file.originalname,
      size: req.file.size,
      url: req.file.path, // Cloudinary gives secure URL in `path`
      public_id: req.file.filename, // Actually stores `public_id` here
    });

    const savedImage = await newImage.save();

    res.json({ success: true, image: savedImage });
  } catch (err) {
    console.error('❌ Error saving image metadata:', err);
    res.status(500).json({
      error: 'Failed to save image metadata',
      message: err.message,
    });
  }
};

// Get all images
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.json({ success: true, images });
  } catch (err) {
    console.error('❌ Error fetching images:', err.message);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// Delete from Cloudinary + DB
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Delete from DB
    await image.deleteOne();

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting image:', err.message);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
