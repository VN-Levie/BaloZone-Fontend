# Admin - Quản lý Sale Campaigns

## Tạo chiến dịch khuyến mãi (Admin)

### POST /api/dashboard/sale-campaigns

**Mô tả**: Tạo chiến dịch sale mới với hỗ trợ upload ảnh trực tiếp

**Phương thức**: POST

**URL**: `/api/dashboard/sale-campaigns`

**Phân quyền**: Admin, Contributor

**Headers**:
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: multipart/form-data
```

**Body** (multipart/form-data):
```
name: Test Sale Campaign (string, required)
slug: test-sale-campaign (string, required, unique)
description: Mô tả chiến dịch (string, optional)
banner_image: @path/to/image.jpg (file, optional) - Hỗ trợ jpeg,png,jpg,gif,webp, max 2MB
start_date: 2025-08-20 (date, required, >= today)
end_date: 2025-08-30 (date, required, > start_date)
status: draft|active|expired|cancelled (required)
is_featured: 1 hoặc 0 (boolean, optional)
priority: 10 (integer 0-100, optional)
metadata[color]: #ff0000 (string, optional)
metadata[tags][]: tag1 (string array, optional)
```

**Ví dụ cURL**:
```bash
curl -X POST "http://localhost:8000/api/dashboard/sale-campaigns" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "name=Test Sale Campaign" \
  -F "slug=test-sale-campaign" \
  -F "description=Mô tả chiến dịch" \
  -F "banner_image=@banner.jpg" \
  -F "start_date=2025-08-20" \
  -F "end_date=2025-08-30" \
  -F "status=draft" \
  -F "is_featured=1" \
  -F "priority=10"
```

**Response thành công (201)**:
```json
{
  "message": "Sale campaign created successfully",
  "data": {
    "name": "Test Image Upload Campaign",
    "slug": "test-image-upload-campaign",
    "description": "Testing direct image upload",
    "banner_image": "/storage/sale-campaigns/y38CxA9oaSfqSrCMgYIY4EPsexXkToinTSP8KySU.png",
    "start_date": "2025-08-17T00:00:00.000000Z",
    "end_date": "2025-08-30T00:00:00.000000Z",
    "status": "draft",
    "is_featured": true,
    "priority": "10",
    "updated_at": "2025-08-15T18:42:02.000000Z",
    "created_at": "2025-08-15T18:42:02.000000Z",
    "id": 7
  }
}
```

## Cập nhật chiến dịch khuyến mãi (Admin)

### PUT /api/dashboard/sale-campaigns/{id}

**Mô tả**: Cập nhật thông tin chiến dịch với hỗ trợ upload ảnh mới

**Phương thức**: POST (với _method=PUT)

**URL**: `/api/dashboard/sale-campaigns/{id}`

**Phân quyền**: Admin, Contributor

**Headers**:
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: multipart/form-data
```

**Body** (multipart/form-data):
```
_method: PUT (required cho method spoofing)
name: Test Sale Campaign Updated (string, required)
slug: test-sale-campaign-updated (string, required, unique)
description: Mô tả chiến dịch cập nhật (string, optional)
banner_image: @path/to/new_image.jpg (file, optional) - Ảnh mới sẽ thay thế ảnh cũ
start_date: 2025-08-20 (date, required, >= today)
end_date: 2025-08-30 (date, required, > start_date)
status: active (string, required)
is_featured: 1 (boolean, optional)
priority: 15 (integer 0-100, optional)
```

**Ví dụ cURL**:
```bash
curl -X POST "http://localhost:8000/api/dashboard/sale-campaigns/7" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "_method=PUT" \
  -F "name=Test Image Upload Campaign Updated" \
  -F "slug=test-image-upload-campaign-updated" \
  -F "description=Testing direct image upload with update" \
  -F "banner_image=@test_banner_2.jpg" \
  -F "start_date=2025-08-17" \
  -F "end_date=2025-08-30" \
  -F "status=active" \
  -F "is_featured=1" \
  -F "priority=15"
```

**Response thành công (200)**:
```json
{
  "message": "Sale campaign updated successfully",
  "data": {
    "id": 7,
    "name": "Test Image Upload Campaign Updated",
    "slug": "test-image-upload-campaign-updated",
    "description": "Testing direct image upload with update",
    "banner_image": "/storage/sale-campaigns/Xmv6tWLPtpxqD3H8lPGlsh4bndHNGtglEVA9W2wB.png",
    "start_date": "2025-08-17T00:00:00.000000Z",
    "end_date": "2025-08-30T00:00:00.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": "15",
    "metadata": null,
    "created_at": "2025-08-15T18:42:02.000000Z",
    "updated_at": "2025-08-15T18:43:19.000000Z",
    "deleted_at": null
  }
}
```

## Lưu ý quan trọng về Image Upload

### Tính năng mới
- ✅ **Upload ảnh trực tiếp**: Hỗ trợ upload file ảnh thay vì chỉ URL
- ✅ **Auto delete**: Tự động xóa ảnh cũ khi update ảnh mới
- ✅ **Validation**: Kiểm tra định dạng và kích thước file
- ✅ **Storage**: Lưu trong `/storage/sale-campaigns/`

### Format hỗ trợ
- **File types**: jpeg, png, jpg, gif, webp
- **Max size**: 2MB
- **Storage location**: `/storage/sale-campaigns/`
- **Public URL**: `/storage/sale-campaigns/{filename}`

### Method Spoofing cho Update
Vì Laravel không hỗ trợ PUT với multipart/form-data, cần sử dụng POST với `_method=PUT`:

```bash
curl -X POST "url" -F "_method=PUT" -F "banner_image=@file.jpg" ...
```

### Validation Rules
```php
'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
```

### Boolean Fields với Form Data
Sử dụng `1` hoặc `0` thay vì `true`/`false`:
```bash
-F "is_featured=1"  # ✅ Correct
-F "is_featured=true"  # ❌ Wrong - validation error
```

## Backward Compatibility

API vẫn hỗ trợ cách cũ với JSON và URL string:

```bash
# Cách cũ (vẫn hoạt động)
curl -X POST "url" \
  -H "Content-Type: application/json" \
  -d '{"banner_image": "https://example.com/image.jpg"}'

# Cách mới (upload trực tiếp)
curl -X POST "url" \
  -F "banner_image=@local_image.jpg"
```

Cả hai cách đều được hỗ trợ trong cùng một endpoint.
