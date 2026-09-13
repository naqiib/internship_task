# Tourist Management System — Frontend (React + Vite)

A working React app for the tourist/tourism platform: browsing destinations,
viewing packages, booking, reviews, favourites, and an admin dashboard.

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173` by default.

## Connect it to your backend

The default API URL is `http://127.0.0.1:8000/api`. To use another host or
port, copy `.env.example` to `.env` and set `VITE_API_URL`.

Start the backend first by following `../tourist-backend-files/README.md`, then
open the Vite URL shown in the terminal.

## Checks

```powershell
npm run build
npm run lint
```

## Pages included

- `/` — Landing page
- `/login`, `/register` — Auth (tourist or guide signup)
- `/destinations` — Browse + search destinations
- `/destinations/:id` — Destination detail: packages, reviews, favourite button
- `/packages` — All tour packages
- `/book/:packageId` — Booking form (requires login)
- `/bookings` — "My Bookings" with status
- `/admin` — Admin dashboard with stats (admin role only)

## What's NOT included (documented scope cut)

- Interactive map component (destination lat/long is available from the API —
  add a library like `react-leaflet` when ready)
- Admin CRUD screens for destinations/packages/guides (currently API-only —
  use Postman/curl or extend the admin dashboard with forms)
- Smart recommendations UI
- Notification bell/dropdown (API endpoint exists, UI not built yet)

## Test accounts (after seeding the backend)

- admin@example.com / password
- guide@example.com / password
- tourist@example.com / password
