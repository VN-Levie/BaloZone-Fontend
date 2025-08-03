# Test Admin News API

## Test Cases

### 1. Test Create News with File Upload
```bash
# Test tạo tin tức với file upload
curl -X POST "http://localhost:8000/api/dashboard/news" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test News with File Upload" \
  -F "description=This is a test news article created via API" \
  -F "thumbnail=@/path/to/test-image.jpg"
```

### 2. Test Create News without File
```bash
# Test tạo tin tức không có file
curl -X POST "http://localhost:8000/api/dashboard/news" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Text Only News" \
  -F "description=This news has no thumbnail image"
```

### 3. Test Update News with JSON
```bash
# Test cập nhật tin tức bằng JSON (không upload file)
curl -X PUT "http://localhost:8000/api/dashboard/news/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated News Title",
    "description": "Updated news description"
  }'
```

### 4. Test Update News with File Upload
```bash
# Test cập nhật tin tức với file mới
curl -X POST "http://localhost:8000/api/dashboard/news/1/update" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated News with New Image" \
  -F "description=Updated description with new thumbnail" \
  -F "thumbnail=@/path/to/new-image.jpg"
```

### 5. Test Get News List
```bash
# Test lấy danh sách tin tức
curl -X GET "http://localhost:8000/api/dashboard/news?per_page=5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### 6. Test Get Single News
```bash
# Test lấy thông tin tin tức
curl -X GET "http://localhost:8000/api/dashboard/news/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### 7. Test Delete News
```bash
# Test xóa tin tức
curl -X DELETE "http://localhost:8000/api/dashboard/news/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

## Expected Response Formats

### Create News Response (201)
```json
{
  "message": "Tin tức đã được tạo thành công",
  "data": {
    "title": "Test News with File Upload",
    "description": "This is a test news article created via API",
    "thumbnail": "/storage/news/thumbnails/1754208173_test.png",
    "updated_at": "2025-08-03T08:02:53.000000Z",
    "created_at": "2025-08-03T08:02:53.000000Z",
    "id": 22
  }
}
```

### Get News List Response (200)
```json
{
  "current_page": 1,
  "data": [...],
  "first_page_url": "http://localhost:8000/api/dashboard/news?page=1",
  "from": 1,
  "last_page": 2,
  "last_page_url": "http://localhost:8000/api/dashboard/news?page=2",
  "per_page": 10,
  "total": 20
}
```

## Frontend Integration Notes

1. **File Upload**: Use FormData for file uploads
2. **File Validation**:
   - Types: jpeg, png, jpg, gif, webp
   - Max size: 2MB
3. **Update Methods**:
   - PUT for JSON data only
   - POST /update for file uploads
4. **Response Handling**: Check for success/error messages
5. **Error Handling**: API returns validation errors in `errors` field
