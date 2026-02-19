# Dev Environment (all services)

## 🚀 Quick Start

**Easiest way to start everything:**
```powershell
.\start.ps1
```

This automatically:
- ✅ Starts all Docker containers
- ✅ Opens Frontend, GraphQL, and Swagger in your browser
- ✅ Displays service status

For more options, see [README_STARTUP.md](./README_STARTUP.md)

## Manual Start

Folder layout expected:
```
parent/
  backend/
  frontend/
  go-service/
  infra/
  dev-environment/
```

Run:
```
docker compose up --build
```

## Available Services

Open these URLs after services start:
- http://localhost:4200 - Frontend Application
- http://localhost:5001/graphql - GraphQL Playground
- http://localhost:5001/swagger - API Documentation  
- http://localhost:8080 - Keycloak Admin (admin / admin123)
- http://localhost:8081 - Go Service

**Login Credentials:**
- Username: `devuser`
- Password: `REDACTED`
