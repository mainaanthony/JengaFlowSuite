# Backend (.NET 8 + EF Core + GraphQL)

## Features

- **GraphQL API** - `/graphql` with filtering, sorting, and projections
- **Swagger/OpenAPI** - `/swagger` for REST API documentation
- **Health Check** - `/health` endpoint
- **Auto Migrations** - Database migrations apply automatically on startup
- **Repository Pattern** - Clean architecture with repositories and services

## Quick Start

### Using Docker Compose (Recommended)

```bash
cd dev-environment
docker-compose up backend
```

The backend will:

- ✅ Wait for SQL Server to be healthy
- ✅ Automatically apply any pending migrations
- ✅ Start on port 5001

### Local Development

```bash
cd backend/Api
dotnet restore
dotnet run
```

**Prerequisites:**

- .NET 8 SDK
- SQL Server running (Docker or local)
- Connection string in `appsettings.json` or environment variable

## Database Migrations

### ⚡ Automatic Migration on Startup

**Your application now automatically applies pending migrations!**

When you:

- Switch branches with new migrations
- Pull changes from teammates
- Start the application

The backend will:

1. Check for pending migrations
2. Log which migrations will be applied
3. Apply them automatically
4. Log success or failure

**See [MIGRATIONS_GUIDE.md](MIGRATIONS_GUIDE.md) for complete documentation.**

### Creating New Migrations

```bash
cd backend/Api

# Create a migration
dotnet ef migrations add YourMigrationName

# (Optional) Apply manually
dotnet ef database update

# Remove last migration if needed
dotnet ef migrations remove
```

### View Migration History

```bash
# List all migrations and status
dotnet ef migrations list
```

## API Endpoints

### GraphQL

- **URL**: `http://localhost:5001/graphql`
- **Features**: Query, filter, sort, project entities
- **Playground**: Banana Cake Pop UI available at endpoint

### REST/Swagger

- **URL**: `http://localhost:5001/swagger`
- **Interactive**: Test APIs directly in browser

### Health Check

- **URL**: `http://localhost:5001/health`
- **Response**: `{"status": "ok"}`

## Configuration

### Connection String

**Environment Variable (Docker):**

```bash
ConnectionStrings__Default=Server=sqldb,1433;Database=JengaFlowDB;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
```

**appsettings.json:**

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost,1438;Database=JengaFlowDB;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
  }
}
```

## Project Structure

```
Api/
├── Core/                    # Core utilities and interfaces
├── Data/                    # DbContext and configurations
│   ├── AppDbContext.cs
│   ├── Configurations/      # Entity configurations
│   └── Seeding/            # Data seeding helpers
├── Enums/                  # Enumerations
├── GraphQL/                # GraphQL types and queries
├── Migrations/             # EF Core migrations
├── Models/                 # Domain models/entities
├── Repositories/           # Data access layer
│   └── Implementations/
├── Services/               # Business logic layer
│   └── Implementations/
└── Program.cs              # Application entry point
```

## Development Workflow

### 1. Pull Latest Changes

```bash
git pull origin main
```

### 2. Start Application

```bash
cd dev-environment
docker-compose up backend
```

**Migrations apply automatically!** ✨

### 3. Make Changes

Add/modify entities, repositories, services

### 4. Create Migration

```bash
cd backend/Api
dotnet ef migrations add YourMigrationName
```

### 5. Test & Commit

```bash
git add .
git commit -m "Add new feature with migration"
git push
```

## Docker

### Build Image

```bash
cd backend
docker build -t jengaflow-backend .
```

### Run Container

```bash
docker run --rm -p 5000:5000 \
  -e ConnectionStrings__Default="Server=host.docker.internal,1438;Database=JengaFlowDB;User ID=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=true;" \
  jengaflow-backend
```

## Troubleshooting

### Migrations Won't Apply

Check logs for detailed error:

```bash
docker-compose logs backend
```

See [MIGRATIONS_GUIDE.md](MIGRATIONS_GUIDE.md#troubleshooting) for solutions.

### Connection Refused

Ensure SQL Server is running and healthy:

```bash
docker-compose ps sqldb
```

### Port Already in Use

Change `BACKEND_PORT` in `dev-environment/.env`:

```bash
BACKEND_PORT=5002
```

## Additional Documentation

- **[Migrations Guide](MIGRATIONS_GUIDE.md)** - Complete EF Core migrations documentation
- **[Repository Pattern](Api/REPOSITORY_PATTERN_IMPLEMENTATION.md)** - Architecture details
- **[GraphQL Setup](Api/GRAPHQL_COMPLETION_REPORT.md)** - GraphQL implementation details

## Testing

```bash
cd backend/Api
dotnet test
```

## Building for Production

```bash
dotnet publish -c Release -o out
```

---

**Need help?** Check the [Migrations Guide](MIGRATIONS_GUIDE.md) or [Database Setup Guide](../DATABASE_SETUP.md).

```

```
