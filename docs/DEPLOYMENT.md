# Production Deployment Guide

## Overview
This guide outlines how to deploy the Real-Time Navigation System including:
- FastAPI back-end
- React front-end
- Rust WebAssembly module
- Python CLI (if needed)

## Prerequisites
- Docker & Docker Compose installed
- Environment variables defined in `/Users/cjacobson/git/NaviWasm/.env`
- CI/CD pipeline configured (see `.github/workflows/ci.yml`)

## Steps

### 1. Build the Rust WASM Module
Navigate to `/Users/cjacobson/git/NaviWasm/wasm` and run:
```
wasm-pack build
```
This will output the WASM package to `/Users/cjacobson/git/NaviWasm/wasm/pkg`.

### 2. Configure Environment Variables
Ensure sensitive values (Mapbox token, Sentry DSN, etc.) are placed in the `.env` file:
```
REACT_APP_MAPBOX_ACCESS_TOKEN=your_production_mapbox_token_here
SENTRY_DSN=your_sentry_dsn_here
DEBUG=False
```

### 3. Build and Run Docker Containers
From the project root, run:
```
docker-compose build
docker-compose up -d
```
This starts the back-end on port 8000 and the front-end on port 3000.

### 4. CI/CD Integration
- The GitHub Actions workflow in `.github/workflows/ci.yml` performs linting, testing, and builds Docker images.
- Configure your deployment service (e.g., Heroku, AWS, or Kubernetes) to pull the latest container images after a successful build.

### 5. Monitor & Scale
- **Error Monitoring:** Sentry is integrated for both backend and frontend error tracking.
- **Logging:** Ensure logs are aggregated via your logging service for production.
- **Scaling:** Adjust Docker Compose or move to an orchestration platform for horizontal scaling.

## Additional Resources
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
