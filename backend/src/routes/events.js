import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/Event.js';
import { requireAdmin } from '../middleware/auth.js';
import { toUtc } from '../utils/time.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Configure multer to store images on disk under /uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

// POST /events (admin)
// Accepts multipart/form-data with optional image; converts provided date+timezone to UTC
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  const { title, description, date, timezone } = req.body;
  const dateUtc = toUtc(date, timezone);
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const created = await Event.create({ title, description, dateUtc, timezone, imageUrl });
  res.status(201).json(created);
});

// GET /events (sorted by event UTC date ascending)
router.get('/', async (_req, res) => {
  const events = await Event.find({}).sort({ dateUtc: 1 });
  res.json(events);
});

// GET /events/:id
router.get('/:id', async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Not found' });
  res.json(ev);
});

// DELETE /events/:id (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  const ev = await Event.findByIdAndDelete(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

export default router;

