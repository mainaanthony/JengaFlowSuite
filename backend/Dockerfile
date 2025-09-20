FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY Api/Api.csproj Api/
RUN dotnet restore Api/Api.csproj
COPY . .
RUN dotnet publish Api/Api.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
COPY Api/entrypoint.sh ./
RUN chmod +x /app/entrypoint.sh
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ConnectionStrings__Default="Server=sqldb,1433;Database=AppDb;User ID=sa;Password=Your!StrongPassw0rd;TrustServerCertificate=true;"
ENTRYPOINT ["/app/entrypoint.sh"]
