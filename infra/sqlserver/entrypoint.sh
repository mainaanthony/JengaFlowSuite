#!/bin/bash

# Start SQL Server in the background
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to start
echo "Waiting for SQL Server to start..."
sleep 30s

# Run initialization script
echo "Running database initialization script..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -v DB_NAME="$DB_NAME" -i /docker-entrypoint-initdb.d/init-db.sql

echo "Database initialization completed!"

# Keep the container running
wait
