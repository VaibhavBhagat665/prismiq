/** Express API gateway for Prismiq */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';

// Import routes
import authRoutes from './routes/auth.js';
import recommendRoutes from './routes/recommend.js';
import roadmapRoutes from './routes/roadmap.js';
import chatRoutes from './routes/chat.js';
import pricingRoutes from './routes/pricing.js';
import resumeRoutes from './routes/resume.js';
import { embedRouter } from './routes/embed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'prismiq-backend'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', recommendRoutes);
app.use('/api', roadmapRoutes);
app.use('/api', chatRoutes);
app.use('/api', embedRouter);
app.use('/api', pricingRoutes);
app.use('/api', resumeRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Prismiq API Server' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
process.on('SIGINT', () => { server.close(() => process.exit(0)) })
process.on('SIGTERM', () => { server.close(() => process.exit(0)) })
