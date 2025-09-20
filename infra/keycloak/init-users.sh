#!/bin/bash
set -e

KEYCLOAK_URL="${KEYCLOAK_URL:-http://keycloak:8080}"
REALM_NAME="dev"

echo "Using KEYCLOAK_URL=$KEYCLOAK_URL"
echo "Waiting for Keycloak to be ready..."

# Wait for Keycloak to be available (use realm endpoint which is reliable after import)
until curl -sf "$KEYCLOAK_URL/realms/master" > /dev/null 2>&1; do
  echo "Waiting for Keycloak at $KEYCLOAK_URL..."
  sleep 5
done

echo "Keycloak is ready, creating users..."
# Get admin token
ADMIN_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${KEYCLOAK_ADMIN}" \
  -d "password=${KEYCLOAK_ADMIN_PASSWORD}" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | \
  jq -r '.access_token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "Failed to get admin token"
  exit 1
fi

echo "Got admin token, creating dev user..."

# Check if user already exists
USER_EXISTS=$(curl -s -X GET "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=devuser" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '. | length')

if [ "$USER_EXISTS" -eq 0 ]; then
  # Create user
  CREATE_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"devuser\",
      \"enabled\": true,
      \"emailVerified\": true,
      \"firstName\": \"Dev\",
      \"lastName\": \"User\",
      \"credentials\": [{
        \"type\": \"password\",
        \"value\": \"${DEV_USER_PASSWORD}\",
        \"temporary\": false
      }]
    }")
  
  HTTP_CODE="${CREATE_RESPONSE: -3}"
  if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Dev user created successfully"
  else
    echo "❌ Failed to create user. HTTP Code: $HTTP_CODE"
    echo "Response: ${CREATE_RESPONSE%???}"
  fi
else
  echo "ℹ️ Dev user already exists, skipping creation"
fi

echo "User initialization complete!"