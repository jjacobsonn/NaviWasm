# Real-Time Navigation System

This project includes:
- A React front-end with Mapbox.
- A FastAPI back-end.
- A Rust WebAssembly module for pathfinding.
- A Python CLI using click.
- Docker configuration for containerized deployment.

## Setup Instructions

1. Build the WASM module:
   - Navigate to `/Users/cjacobson/git/NaviWasm/wasm`
   - Run: `wasm-pack build`

2. Backend setup:
   - Navigate to `/Users/cjacobson/git/NaviWasm/backend`
   - Install dependencies: `pip install -r requirements.txt`
   - Set environment variables in a `.env` file (see `.env.sample`).

3. Frontend setup:
   - Navigate to `/Users/cjacobson/git/NaviWasm/frontend`
   - Run: `npm install` then `npm run build` for production build.
   - Serve the built files via a static server (or integrate with the backend).

4. Docker Compose:
   - From the project root, run: `docker-compose up` to start all services.

## Further Enhancements
- Integrate comprehensive unit and integration tests.
- Enhance WASM module with actual pathfinding logic.
- Configure CI/CD for automated builds and deployments.
