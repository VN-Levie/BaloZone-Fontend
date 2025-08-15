#!/bin/bash

# Script để test Admin Sale Campaigns API theo tài liệu mới

BASE_URL="http://localhost:8000/api"
echo "Testing Admin Sale Campaigns API..."

# Login để lấy admin token
echo "1. Login to get admin token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@balozone.com","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.authorization.token // .data.access_token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Failed to get token. Response:"
  echo $LOGIN_RESPONSE | jq .
  exit 1
fi

echo "✅ Got admin token: ${TOKEN:0:20}..."

# Test 1: Get all sale campaigns (admin view)
echo "2. Get all sale campaigns (admin)..."
CAMPAIGNS_RESPONSE=$(curl -s -X GET "$BASE_URL/dashboard/sale-campaigns" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Admin sale campaigns response:"
echo $CAMPAIGNS_RESPONSE | jq .

# Test 2: Create new sale campaign with JSON
echo "3. Create new sale campaign (JSON)..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/dashboard/sale-campaigns" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Sale Campaign API Fixed",
    "slug": "test-sale-campaign-api-fixed",
    "description": "Test campaign tạo từ API đã được sửa",
    "banner_image": "https://placehold.co/600x400?text=test-campaign-fixed.jpg",
    "start_date": "2025-08-16T00:00:00.000000Z",
    "end_date": "2025-08-20T23:59:59.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": 75,
    "metadata": {"tags": ["test", "api", "fixed"], "color": "#ff0000"}
  }')

echo "Create campaign (JSON) response:"
echo $CREATE_RESPONSE | jq .

# Test 2b: Create campaign with FormData (file upload simulation)
echo "3b. Create new sale campaign with FormData..."
CREATE_FORMDATA_RESPONSE=$(curl -s -X POST "$BASE_URL/dashboard/sale-campaigns" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "name=Test FormData Campaign" \
  -F "slug=test-formdata-campaign" \
  -F "description=Test campaign with FormData upload" \
  -F "start_date=2025-08-17" \
  -F "end_date=2025-08-30" \
  -F "status=draft" \
  -F "is_featured=1" \
  -F "priority=25" \
  -F "metadata[color]=#0066cc" \
  -F "metadata[tags][0]=formdata" \
  -F "metadata[tags][1]=test")

echo "Create campaign (FormData) response:"
echo $CREATE_FORMDATA_RESPONSE | jq .

# Extract campaign ID from response
CAMPAIGN_ID=$(echo $CREATE_RESPONSE | jq -r '.data.id // empty')
FORMDATA_CAMPAIGN_ID=$(echo $CREATE_FORMDATA_RESPONSE | jq -r '.data.id // empty')

if [ -n "$CAMPAIGN_ID" ] && [ "$CAMPAIGN_ID" != "null" ]; then
  echo "✅ Created JSON campaign with ID: $CAMPAIGN_ID"
else
  echo "❌ Failed to create JSON campaign"
fi

if [ -n "$FORMDATA_CAMPAIGN_ID" ] && [ "$FORMDATA_CAMPAIGN_ID" != "null" ]; then
  echo "✅ Created FormData campaign with ID: $FORMDATA_CAMPAIGN_ID"
else
  echo "❌ Failed to create FormData campaign"
fi

# Use the first successful campaign for further testing
TEST_CAMPAIGN_ID="${CAMPAIGN_ID:-$FORMDATA_CAMPAIGN_ID}"

if [ -n "$TEST_CAMPAIGN_ID" ] && [ "$TEST_CAMPAIGN_ID" != "null" ]; then

  # Test 3: Update the campaign with FormData (method spoofing)
  echo "4. Update sale campaign with FormData..."
  UPDATE_FORMDATA_RESPONSE=$(curl -s -X POST "$BASE_URL/dashboard/sale-campaigns/$TEST_CAMPAIGN_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -F "_method=PUT" \
    -F "name=Test Campaign Updated via FormData" \
    -F "slug=test-campaign-updated-formdata" \
    -F "description=Campaign đã được update qua FormData" \
    -F "start_date=2025-08-17" \
    -F "end_date=2025-08-30" \
    -F "status=active" \
    -F "is_featured=0" \
    -F "priority=30")

  echo "Update campaign (FormData) response:"
  echo $UPDATE_FORMDATA_RESPONSE | jq .

  # Test 4: Update with JSON
  echo "4b. Update sale campaign with JSON..."
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/dashboard/sale-campaigns/$TEST_CAMPAIGN_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test Sale Campaign API Fixed - Updated",
      "slug": "test-sale-campaign-api-fixed-updated",
      "description": "Test campaign đã được cập nhật qua JSON",
      "banner_image": "https://placehold.co/600x400?text=test-campaign-updated.jpg",
      "start_date": "2025-08-16T00:00:00.000000Z",
      "end_date": "2025-08-20T23:59:59.000000Z",
      "status": "active",
      "is_featured": false,
      "priority": 50,
      "metadata": {"tags": ["test", "api", "updated"], "color": "#00ff00"}
    }')

  echo "Update campaign (JSON) response:"
  echo $UPDATE_RESPONSE | jq .

  # Test 5: Add products to campaign
  echo "5. Add products to campaign..."
  ADD_PRODUCTS_RESPONSE=$(curl -s -X POST "$BASE_URL/dashboard/sale-campaigns/$TEST_CAMPAIGN_ID/products" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "products": [
        {
          "product_id": 1,
          "sale_price": 674250,
          "discount_type": "percentage",
          "max_quantity": 50
        }
      ]
    }')

  echo "Add products response:"
  echo $ADD_PRODUCTS_RESPONSE | jq .

  # Test 6: Remove product from campaign
  echo "6. Remove product from campaign..."
  REMOVE_PRODUCT_RESPONSE=$(curl -s -X DELETE "$BASE_URL/dashboard/sale-campaigns/$TEST_CAMPAIGN_ID/products/1" \
    -H "Authorization: Bearer $TOKEN")

  echo "Remove product response:"
  echo $REMOVE_PRODUCT_RESPONSE | jq .

  # Test 7: Delete the campaign
  echo "7. Delete sale campaign..."
  DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/dashboard/sale-campaigns/$TEST_CAMPAIGN_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "Delete campaign response:"
  echo $DELETE_RESPONSE | jq .

  # Clean up FormData campaign if different
  if [ -n "$FORMDATA_CAMPAIGN_ID" ] && [ "$FORMDATA_CAMPAIGN_ID" != "$CAMPAIGN_ID" ]; then
    echo "7b. Delete FormData campaign..."
    curl -s -X DELETE "$BASE_URL/dashboard/sale-campaigns/$FORMDATA_CAMPAIGN_ID" \
      -H "Authorization: Bearer $TOKEN" | jq .
  fi

else
  echo "❌ Failed to create any campaign for testing"
fi

echo "🎉 Admin Sale Campaigns API testing completed!"
