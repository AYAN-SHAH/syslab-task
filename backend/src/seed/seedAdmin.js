import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@syslab.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email: adminEmail });
  if (existing) return;

  const hashed = await bcrypt.hash(adminPassword, 10);
  await User.create({ email: adminEmail, passwordHash: hashed, role: 'admin' });
  console.log(`Seeded admin user ${adminEmail} / ${adminPassword}`);
}

