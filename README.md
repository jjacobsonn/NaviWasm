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

3. Frontend setup:
   - Navigate to `/Users/cjacobson/git/NaviWasm/frontend`
   - Run: `npm install` then `npm start` to start development.

4. Docker Compose:
   - From the project root, run: `docker-compose up` to start all services.

## Further Enhancements
- Improve WASM integration with actual pathfinding logic.
- Add unit and integration testing.
- Configure CI/CD for automated builds and deployments.
