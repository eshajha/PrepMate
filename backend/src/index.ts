import dotenv from 'dotenv';
// Configure dotenv before other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes';
import { connectDatabase } from './config/database';
import { rateLimiter, authLimiter, errorHandler } from './middleware/rate-limit';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://prepmate.com' 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Apply rate limiting
app.use('/api/auth', authLimiter); // Stricter rate limiting for auth routes
app.use('/api', rateLimiter); // General rate limiting for all routes

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode at http://localhost:${port}`);
  });
});
