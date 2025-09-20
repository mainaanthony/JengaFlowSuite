# Backend (.NET 8 + EF Core + GraphQL)

- `/graphql`, `/swagger`, `/health`

## Local
```
docker build -t backend .
docker run --rm -p 5000:5000 -e ConnectionStrings__Default="Server=host.docker.internal,1438;Database=AppDb;User ID=sa;Password=Your!StrongPassw0rd;TrustServerCertificate=true;" backend
```
