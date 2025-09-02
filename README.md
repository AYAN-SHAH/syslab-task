## Syslab Event Management Task

Run from root:

```bash
npm install
npm start   # starts backend API only
npm run start:all  # runs backend (4000) and frontend (5173)
```

Backend: http://localhost:4001

Env vars (optional): create `backend/.env` or use defaults

PORT=4001
MONGODB_URI=mongodb://127.0.0.1:27017/syslab_events
JWT_SECRET=change_me
ADMIN_EMAIL=admin@syslab.local
ADMIN_PASSWORD=admin123

API

- POST `/api/auth/login` { email, password } → { token }
- POST `/api/events` (admin, multipart/form-data)
  - fields: title, description, date (ISO), timezone (IANA e.g. "Asia/Karachi"), image (file)
- GET `/api/events` → list (sorted by UTC date)
- GET `/api/events/:id` → event
- DELETE `/api/events/:id` (admin)
- POST `/api/notifications` (admin) { message, eventId }
- GET `/api/notifications` → recent notifications
- GET `/api/debug/db` → current DB name and collection counts

Notes

- Times are stored as UTC in `dateUtc` and original `timezone` saved. Frontend will convert for display.
- Images are saved under `/uploads` and served statically at `/uploads/*`.
- Monorepo uses npm workspaces; dependencies are hoisted to root `node_modules` by default.

Architecture & Flow

- Backend (Express + MongoDB):
  - `src/index.js`: bootstraps express, connects to MongoDB, serves static uploads, mounts routers, exposes health/debug.
  - `routes/auth.js`: login endpoint returns JWT for the seeded admin (see `.env`).
  - `routes/events.js`: CRUD for events (create requires admin), handles image upload via `multer`, converts provided local time to UTC using Luxon (`utils/time.js`).
  - `routes/notifications.js`: simulated push notifications (store + log).
  - `middleware/auth.js`: `requireAdmin` verifies JWT and role.
  - `models/*`: Mongoose schemas for `User`, `Event`, `Notification`.
  - `seed/seedAdmin.js`: creates an admin on first run based on env.

- Frontend (Vite + React):
  - `vite.config.js` proxies `/api` and `/uploads` to backend.
  - `src/api.js`: Axios instance with auth header from `localStorage`.
  - Pages: `EventsList`, `EventDetails`, `CreateEvent`, `Login`, `Notifications`.
  - Components: `EventCard`, `FormField`.
  - Styling: lightweight CSS in `styles.css`.

Timezone Handling

- Create Event: user selects timezone and provides local date/time (ISO-like).
- Server uses Luxon to interpret that local time in the selected timezone, converts to UTC (`dateUtc`) and stores it.
- Frontend displays by taking `dateUtc` as UTC and formatting it in the event's saved timezone.

Auth Flow

- Admin login posts to `/api/auth/login`.
- Token is stored in `localStorage` and automatically attached by Axios to protected routes.
- Protected endpoints: `POST /api/events`, `DELETE /api/events/:id`, `POST /api/notifications`.

Local Dev Tips

- If port 4000 is busy, change `PORT` in `backend/.env` and update `vite.config.js` proxy.
- Use `/api/debug/db` to verify which MongoDB database you are connected to when checking collections.

