# Dev Environment (all services)

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

Open:
- http://localhost:3000  (Keycloak login: `devuser` / `devpass` on realm `dev`)
- http://localhost:5000/swagger
- http://localhost:5000/graphql
- http://localhost:8081/hello
