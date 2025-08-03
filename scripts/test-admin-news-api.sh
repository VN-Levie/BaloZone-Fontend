#!/usr/bin/env bash

# Test script for Admin News API
# Usage: ./test-admin-news-api.sh

# Base URL
BASE_URL="http://localhost:8000/api/dashboard/news"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# JWT Token (replace with actual token)
JWT_TOKEN="your_jwt_token_here"

echo -e "${YELLOW}🧪 Testing Admin News API${NC}"
echo "=================================="

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4

    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "Method: $method"
    echo "URL: $url"

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$url" \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Accept: application/json")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT "$url" \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$url" \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Accept: application/json")
    fi

    # Extract status code
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)

    # Check status code
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Success (Status: $status_code)${NC}"
    else
        echo -e "${RED}❌ Failed (Status: $status_code)${NC}"
    fi

    # Pretty print JSON response
    echo "Response:"
    echo "$response_body" | python3 -m json.tool 2>/dev/null || echo "$response_body"
}

# Check if JWT token is provided
if [ "$JWT_TOKEN" = "your_jwt_token_here" ]; then
    echo -e "${RED}❌ Please update JWT_TOKEN in the script${NC}"
    exit 1
fi

# Test 1: Get all news
test_endpoint "GET" "$BASE_URL" "" "Get all news"

# Test 2: Get news with pagination
test_endpoint "GET" "$BASE_URL?page=1&per_page=5" "" "Get news with pagination"

# Test 3: Search news
test_endpoint "GET" "$BASE_URL?search=balo" "" "Search news by title"

# Test 4: Create new news
create_data='{
    "title": "Test News from API Script",
    "description": "This is a test news article created from API test script",
    "thumbnail": "https://placehold.co/600x400?text=test-news.jpg"
}'
test_endpoint "POST" "$BASE_URL" "$create_data" "Create new news"

# Store the created news ID (you might need to extract from response)
# For demo purposes, assuming news ID is 1
NEWS_ID=1

# Test 5: Get single news
test_endpoint "GET" "$BASE_URL/$NEWS_ID" "" "Get single news"

# Test 6: Update news
update_data='{
    "title": "Updated Test News from API Script",
    "description": "This news has been updated from the API test script",
    "thumbnail": "https://placehold.co/600x400?text=updated-test-news.jpg"
}'
test_endpoint "PUT" "$BASE_URL/$NEWS_ID" "$update_data" "Update news"

# Test 7: Delete news
# Uncomment to test delete
# test_endpoint "DELETE" "$BASE_URL/$NEWS_ID" "" "Delete news"

echo -e "\n${GREEN}🎉 API Testing completed!${NC}"
echo "=================================="

# Test Frontend Integration
echo -e "\n${YELLOW}🌐 Frontend Integration Test${NC}"
echo "You can test the frontend by:"
echo "1. Starting the development server: npm run dev"
echo "2. Login as admin/contributor"
echo "3. Navigate to: http://localhost:5173/admin/news"
echo "4. Test all CRUD operations through the UI"
