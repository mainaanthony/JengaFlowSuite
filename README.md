# JengaFlowSuite

This repository contains a small microservice stack used for development and testing. The recommended entrypoint for local development is the `dev-environment` folder which uses Docker Compose to bring up Keycloak, SQL Server, the backend, frontend, and supporting services.

TL;DR quick start

1. From the project root run:

```powershell
cd dev-environment
docker compose build
docker compose up
```

2. Open the frontend at `http://localhost:3000` and the backend at `http://localhost:5000`.

Environment files

The compose files use environment variable interpolation. Example `.env` files are provided next to the folders that need them. Copy each `.env.example` to `.env` and edit values before running compose.

- `dev-environment/.env.example` — values used by the dev compose stack (ports, Keycloak admin, SQL SA password, etc.)
- `infra/.env.example` — infra-level values
- `infra/keycloak/.env.example` — keycloak-specific variables (admin username/password, dev user password)
- `frontend/.env.example` — frontend-port or other frontend-specific variables

Keycloak credentials (development)

The development stack imports a realm and creates a `dev` realm. Example default credentials used in the example files:

- Keycloak admin: `administrator` / `SuperSecretAdmin123`
- Dev user: `dev` / `pa$$123`

These are only for local development. Replace them before deploying to any shared environment.

Backend notes

- The backend uses `ConnectionStrings__Default` environment variable to connect to the SQL Server database. Example value (used in examples):

```
Server=sqldb,1422;Database=AppDb;User ID=sa;Password=Pa$$w0rd;TrustServerCertificate=true;
```

- The backend contains GraphQL (see `backend/GraphQL/Query.cs`) and exposes a GraphQL endpoint. It also has Swagger/OpenAPI available when running locally — visit `http://localhost:5000/swagger` (or use the backend's `/graphql` route for GraphQL queries).

- `appsettings.json` and `appsettings.Development.json` are present in `backend/Api`. You can set or override any settings via environment variables (ASP.NET configuration binding supports `ConnectionStrings__Default` etc.).

