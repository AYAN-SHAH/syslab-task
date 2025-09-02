// Enable async error propagation for express route handlers
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';

import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';
import notificationsRouter from './routes/notifications.js';
import { seedAdminUser } from './seed/seedAdmin.js';

dotenv.config();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core middlewares
app.use(cors()); // allow cross-origin during development
app.use(express.json()); // parse JSON request bodies
app.use(morgan('dev')); // request logging
// Ensure uploads directory exists (for multer disk storage)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Lightweight health endpoint
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'backend', env: process.env.NODE_ENV || 'dev' });
});

// Debug: show connected DB and collection document counts
app.get('/api/debug/db', async (_req, res) => {
  const db = mongoose.connection.db;
  const name = db.databaseName;
  const eventsCount = await db.collection('events').countDocuments().catch(() => -1);
  const notifsCount = await db.collection('notifications').countDocuments().catch(() => -1);
  const usersCount = await db.collection('users').countDocuments().catch(() => -1);
  res.json({ database: name, counts: { events: eventsCount, notifications: notifsCount, users: usersCount } });
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/notifications', notificationsRouter);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/syslab_events';

// Bootstrap server and DB
async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB DB:', mongoose.connection.db.databaseName);
    await seedAdminUser();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

