import express from 'express';
import Notification from '../models/Notification.js';
import Event from '../models/Event.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /notifications (admin)
// Simulates a push notification by storing in DB and logging to console
router.post('/', requireAdmin, async (req, res) => {
  const { message, eventId } = req.body;
  const ev = await Event.findById(eventId);
  if (!ev) return res.status(400).json({ message: 'Invalid eventId' });
  const notif = await Notification.create({ message, eventId });
  console.log('Simulated push notification:', { eventId, message });
  res.status(201).json(notif);
});

// GET /notifications (latest first, capped)
router.get('/', async (_req, res) => {
  const notifs = await Notification.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('eventId', 'title');
  res.json(notifs);
});

export default router;

