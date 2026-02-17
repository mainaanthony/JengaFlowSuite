#!/bin/sh
set -e
HOST="${DB_HOST:-sqldb}"
PORT="${DB_PORT:-1433}"
echo "Waiting for SQL Server at $HOST:$PORT ..."
for i in $(seq 1 60); do
  if nc -z "$HOST" "$PORT" >/dev/null 2>&1; then
    echo "SQL Server is up!"
    break
  fi
  echo "Still waiting ($i)..."
  sleep 2
done
exec dotnet Api.dll
