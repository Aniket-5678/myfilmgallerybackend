import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/uploadRoutes.js';
import connectionDB from './config/db.js';
import domainRoutes from "./routes/domainRoutes.js"

dotenv.config();

// ES Modules __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Connect MongoDB Atlas
connectionDB();

// Middlewares
app.use(cors());
app.use(express.json());




// API Routes
app.use('/api/v1/upload', uploadRoutes);

app.use('/api/v1/domain', domainRoutes)





// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at ${process.env.PORT}`);
});
