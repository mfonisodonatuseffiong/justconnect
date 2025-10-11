#!/bin/bash

# -------------------------
# Variables
# -------------------------
BASE_URL="http://localhost:5000/api/v1"
EMAIL="testuser@example.com"
PASSWORD="123456"
PROFESSIONAL_ID=2  # Make sure this professional exists
SERVICE="Plumber"
JOB_DETAILS="Fix leaking tap"
DATE="2025-10-06"
TIME="10:00"

# -------------------------
# 1️⃣ Log in and get token
# -------------------------
echo "Logging in..."
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}" \
  | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Check email/password."
  exit 1
fi

echo "Token: $TOKEN"

# -------------------------
# 2️⃣ Fetch dashboard
# -------------------------
echo -e "\nFetching dashboard..."
curl -s -X GET "$BASE_URL/dashboard" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  | jq

# -------------------------
# 3️⃣ Create a new request
# -------------------------
echo -e "\nCreating new request..."
curl -s -X POST "$BASE_URL/dashboard" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"professional_id\": $PROFESSIONAL_ID, \"service\": \"$SERVICE\", \"job_details\": \"$JOB_DETAILS\", \"date\": \"$DATE\", \"time\": \"$TIME\"}" \
  | jq

# -------------------------
# 4️⃣ Fetch dashboard again
# -------------------------
echo -e "\nFetching updated dashboard..."
curl -s -X GET "$BASE_URL/dashboard" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  | jq
