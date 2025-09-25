/** Express API gateway for Prismiq */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';

// Import routes
import { authRouter } from './routes/auth';
import { recommendRouter } from './routes/recommend';
import { roadmapRouter } from './routes/roadmap';
import { chatRouter } from './routes/chat';
import { pricingRouter } from './routes/pricing';
import { resumeRouter } from './routes/resume';
import { embedRouter } from './routes/embed';

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
app.use('/api/auth', authRouter);
app.use('/api', recommendRouter);
app.use('/api', roadmapRouter);
app.use('/api', chatRouter);
app.use('/api', embedRouter);
app.use('/api', pricingRouter);
app.use('/api', resumeRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Prismiq API Server' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
process.on('SIGINT', () => { server.close(() => process.exit(0)) })
process.on('SIGTERM', () => { server.close(() => process.exit(0)) })
