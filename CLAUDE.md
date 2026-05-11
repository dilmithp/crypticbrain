# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

CrypticBrain is a full-stack CRUD application with a Next.js frontend and a Spring Boot backend, both deployed to a single AWS EC2 instance.

## Architecture

```
crypticbrain/
├── backend/    # Spring Boot 3.3, Java 17, Maven
└── frontend/   # Next.js 16.2.6, React 19, TypeScript, Tailwind v4
```

### Backend

- **Package root**: `live.dilmith.crypticbrain.backend`
- **Layered structure**: `controller` → `service` (interface + `impl/`) → `repository` → `entity`
- **DTOs**: `ItemRequestDto` (input with validation) / `ItemResponseDto` (output). Never expose entities directly.
- **API contract**: All responses are wrapped in `ApiResponse<T>` (`success`, `message`, `data`). Errors go through `GlobalExceptionHandler` which returns the same wrapper shape.
- **Database**: PostgreSQL on Neon.tech, configured in `application.properties`. JPA with `ddl-auto=update`.
- **Runs on**: port 8081 in all environments.

### Frontend

- **App Router** (`src/app/`), all pages using the Next.js App Router conventions.
- **API calls**: Centralised through `src/lib/api.ts` (`fetchApi`). The backend base URL comes from `NEXT_PUBLIC_API_URL` (`.env.local` for dev, `.env.production` for prod build).
- **Forms**: `react-hook-form`. Icons: `lucide-react`.
- **Important**: This project uses **Next.js 16.2.6**, which contains breaking API and convention changes from earlier versions. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/` for the relevant guide — do not rely on prior training knowledge of Next.js APIs.

## Commands

### Backend

```bash
cd backend

# Build (skip tests for speed)
mvn clean package -DskipTests

# Run locally
mvn spring-boot:run

# Run all tests
mvn test

# Run a single test class
mvn test -Dtest=ClassName

# Build fat JAR for deployment
mvn clean package
```

### Frontend

```bash
cd frontend

# Install dependencies
npm ci

# Dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Deployment

CI/CD is via GitHub Actions on push to `main`, path-filtered per service:

- **Backend** (`.github/workflows/deploy-backend.yml`): builds JAR with Maven, SCPs it to EC2, restarts the `backend` systemd service. Health-checked at `http://localhost:8081/api/items`.
- **Frontend** (`.github/workflows/deploy-frontend.yml`): builds Next.js standalone output, SCPs to EC2, restarts via PM2 on port 3020. `NEXT_PUBLIC_API_URL` is set to `https://api.crypticbrain.dilmith.live:8191` in production.

Required GitHub secrets: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`.

## API Reference

Base path: `/api/items`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/items` | List all items |
| GET | `/api/items/{id}` | Get one item |
| POST | `/api/items` | Create item |
| PUT | `/api/items/{id}` | Update item |
| DELETE | `/api/items/{id}` | Delete item (204 No Content) |

OpenAPI UI available at `/swagger-ui.html`, docs at `/api-docs`.

CORS is configured in `CorsConfig.java`; allowed origins are set via `app.cors.allowed-origins` in `application.properties`.
