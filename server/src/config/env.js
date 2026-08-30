import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint-system';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey-replace-in-production';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PORT = process.env.SMTP_PORT || '587';
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';

export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
