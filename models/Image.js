// models/Image.js
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: String,
  size: Number,
  url: String,
  public_id: String, // Important for deletion from Cloudinary
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Image', imageSchema);
