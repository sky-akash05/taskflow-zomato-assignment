# Running TaskFlow Locally (Without Docker)

If you're having Docker issues, you can run TaskFlow directly on your machine.

## Prerequisites

- **Node.js 18+** installed ([download here](https://nodejs.org/))
- **npm** or **yarn**

## Quick Start

### Terminal 1: Start Mock API

```bash
cd mock-api
npm install
npm start
```

You should see: `🚀 Mock API Server is running on http://localhost:4000`

### Terminal 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:3000`

### Access the App

Open your browser to: **http://localhost:3000**

Login with:
- Email: `test@example.com`
- Password: `password123`

## If npm install fails due to SSL

If you get `SELF_SIGNED_CERT_IN_CHAIN` errors:

```bash
# Temporarily disable strict SSL (only for this install)
npm config set strict-ssl false
npm install
npm config set strict-ssl true  # Re-enable after install
```

Or use this one-liner for each directory:

```bash
# In mock-api/
npm config set strict-ssl false && npm install && npm config set strict-ssl true

# In frontend/
npm config set strict-ssl false && npm install && npm config set strict-ssl true
```

## Development Commands

### Mock API (in mock-api/)
```bash
npm start          # Start server on port 4000
```

### Frontend (in frontend/)
```bash
npm run dev        # Start dev server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Check code quality
```

## Troubleshooting

### Port already in use

**Error**: `EADDRINUSE: address already in use :::4000`

**Fix**:
```bash
# Find what's using the port
lsof -i :4000
lsof -i :3000

# Kill the process (replace PID with actual number)
kill -9 PID
```

Or change ports in `.env`:
```bash
# In .env (create if not exists)
VITE_API_URL=http://localhost:4001
PORT=4001
```

### Module not found errors

**Fix**: Delete node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

**Fix**: The project uses TypeScript strict mode, errors are expected during build but shouldn't prevent running in dev mode.

```bash
# Ignore and run anyway (dev mode)
npm run dev
```

### CORS errors

Make sure:
1. Mock API is running on port 4000
2. Frontend `.env` file has: `VITE_API_URL=http://localhost:4000`
3. Restart frontend dev server after changing `.env`

## File Structure

```
Greening-India-Assingment-main/
├── mock-api/
│   ├── package.json
│   ├── server.js       # Express server with auth
│   └── db.json         # Seed data
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx    # App entry
        └── ...
```

## Production Build

To create a production build:

```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`.

To test the production build:
```bash
npm run preview
```

## Why Docker is Better

Running locally works great for development, but Docker is recommended for:
- ✅ **Consistent environment**: Same setup everywhere
- ✅ **No conflicts**: Isolated from your system
- ✅ **Easy cleanup**: `docker compose down` removes everything
- ✅ **Production-like**: Tests the actual deployment setup

## Back to Docker

Once Docker issues are resolved, just run:
```bash
docker compose up
```

All your local changes will be picked up and containerized!

---

**Note**: This local setup is for development only. For submission and production, use the Docker setup as specified in the assignment.
