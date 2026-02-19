# JengaFlowSuite

This repository contains a microservice stack for JengaFlow development and testing. The recommended entrypoint for local development is the `dev-environment` folder which uses Docker Compose to bring up Keycloak, SQL Server, the backend, frontend, and supporting services.

## 🚀 Quick Start

**Easiest way (Windows):**

```powershell
cd dev-environment
.\start.ps1
```

This will:
- ✅ Start all Docker containers
- ✅ Wait for services to be ready
- ✅ Automatically open Frontend, GraphQL, and Swagger in your browser

**Manual start:**

```powershell
cd dev-environment
docker compose up --build
```

Then open:
- Frontend: http://localhost:4200
- GraphQL: http://localhost:5001/graphql
- Swagger: http://localhost:5001/swagger

For more startup options, see [dev-environment/README_STARTUP.md](./dev-environment/README_STARTUP.md)

## 🌐 Available Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4200 | Angular application |
| Backend API | http://localhost:5001 | .NET Core API |
| GraphQL | http://localhost:5001/graphql | GraphQL playground |
| Swagger | http://localhost:5001/swagger | API documentation |
| Keycloak | http://localhost:8080 | Authentication server |
| Go Service | http://localhost:8081 | Go microservice |
| SQL Server | localhost:1438 | Database |

## 🔐 Default Credentials (Development Only)

**Keycloak Admin:**
- Username: `admin`
- Password: `admin123`

**Development User:**
- Username: `devuser`
- Password: `20Jenga20?`

**SQL Server:**
- User: `sa`
- Password: `YourStrong!Passw0rd`

⚠️ **These are only for local development. Replace them before deploying to any shared environment.**

## 📁 Environment Files

The compose files use environment variable interpolation. An `.env` file is provided in `dev-environment/`. Edit values before running compose if needed.

## Backend Notes

## Backend Notes

- The backend uses `ConnectionStrings__Default` environment variable to connect to the SQL Server database. Default value:

```
Server=sqldb,1433;Database=JengaFlowDB;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
```

- The backend exposes GraphQL at `/graphql` and Swagger documentation at `/swagger`
- Visit http://localhost:5001/graphql for GraphQL Playground
- Visit http://localhost:5001/swagger for Swagger/OpenAPI documentation

- `appsettings.json` and `appsettings.Development.json` are present in `backend/Api`. You can set or override any settings via environment variables (ASP.NET configuration binding supports `ConnectionStrings__Default` etc.).

