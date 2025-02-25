# Project Startup Guide

## 1. Environment Setup
First, ensure you have:
- Node.js and npm
- Python 3.9+
- Rust and wasm-pack
- Docker and Docker Compose

## 2. WASM Module
```bash
cd /Users/cjacobson/git/NaviWasm/wasm
```

## 3. Frontend Setup
```bash
cd /Users/cjacobson/git/NaviWasm/frontend
npm install --legacy-peer-deps
```

Create or update your Mapbox token in frontend/.env:
```
REACT_APP_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here
```

## 4. Backend Setup
```bash
cd /Users/cjacobson/git/NaviWasm/backend
pip install -r requirements.txt
```

## 5. Start the Application
Option A - Run services individually:
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm start
```

Option B - Use Docker Compose:
```bash
# From project root
docker-compose up --build
```

## 6. Verify Everything
- Frontend: http://localhost:3000
- Backend health check: http://localhost:8000/health
- Test API: http://localhost:8000/navigate with a POST request

## Common Issues & Solutions
1. If npm install fails, try with --legacy-peer-deps
2. If Mapbox doesn't load, verify your token in frontend/.env
3. If WASM doesn't load, ensure wasm-pack build completed successfully
4. For Docker issues, try docker-compose down --volumes followed by docker-compose up --build

## Development Tips
- Use `npm start` in frontend for hot reloading
- Backend has auto-reload when using uvicorn with --reload flag
- Check browser console and backend logs for errors
