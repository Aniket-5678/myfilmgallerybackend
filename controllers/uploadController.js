
import dotenv from "dotenv"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Image from '../models/Image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config()

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const fileUrl = `${process.env.DOMAIN_URL}/uploads/${req.file.filename}`;
  console.log('✅ File URL:', fileUrl);

  try {
    const newImage = new Image({
      filename: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
    });

    const savedImage = await newImage.save();

    res.json({
      success: true,
      image: savedImage,
    });
  } catch (err) {
    console.error('❌ Error saving image metadata:', err); // FULL error object
    res.status(500).json({
      error: 'Failed to save image metadata',
      message: err.message,
    });
  }
};


// GET: Fetch all images
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 }); // latest first
    res.json({ success: true, images });
  } catch (err) {
    console.error('❌ Error fetching images:', err.message);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};





// DELETE: Delete image by ID
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete image file from uploads folder
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(image.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete image record from DB
    await image.deleteOne();

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting image:', err.message);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};