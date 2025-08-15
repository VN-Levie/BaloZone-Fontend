# 24. Quản lý chiến dịch khuyến mãi (Admin Sale Campaigns)

> **Lưu ý**: Các endpoint quản lý chiến dịch khuyến mãi sử dụng `/api/dashboard/sale-campaigns/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý chiến dịch khuyến mãi

## Tạo chiến dịch khuyến mãi mới (Admin)

### POST /api/dashboard/sale-campaigns

**Mô tả**: Tạo chiến dịch khuyến mãi mới

**Phương thức**: POST

**URL**: `/api/dashboard/sale-campaigns`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "name": "Flash Sale Tết 2025",
  "slug": "flash-sale-tet-2025",
  "description": "Giảm giá sốc lên đến 50% cho tất cả sản phẩm",
  "banner_image": "https://placehold.co/600x400?text=flash-sale-tet-2025.jpg",
  "start_date": "2025-02-01T00:00:00.000000Z",
  "end_date": "2025-02-15T23:59:59.000000Z",
  "status": "active",
  "is_featured": true,
  "priority": 1,
  "metadata": {
    "tags": ["flash-sale", "tet", "2025"],
    "color": "#ff0000",
    "description_short": "Giảm ngay 50%"
  }
}
```

**Response thành công (201)**:

```json
{
  "message": "Sale campaign created successfully",
  "data": {
    "id": 5,
    "name": "Test Sale Campaign API",
    "slug": "test-sale-campaign-api",
    "description": "Test campaign tạo từ API",
    "banner_image": "https://placehold.co/600x400?text=test-campaign-api.jpg",
    "start_date": "2025-08-16T00:00:00.000000Z",
    "end_date": "2025-08-20T23:59:59.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": 50,
    "metadata": {
      "color": "#ff0000",
      "tags": ["test", "api"]
    },
    "created_at": "2025-08-15T18:23:08.000000Z",
    "updated_at": "2025-08-15T18:23:08.000000Z"
  }
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "name": ["The name field is required."],
    "slug": ["The slug field is required."],
    "start_date": ["The start date field is required."],
    "end_date": ["The end date field is required."],
    "status": ["The status field is required."]
  }
}
```

**Validation rules**:

- `name` (string, required, max:255): Tên chiến dịch
- `slug` (string, required, unique): Slug của chiến dịch
- `description` (string, optional): Mô tả chiến dịch
- `banner_image` (string, optional): URL ảnh banner
- `start_date` (datetime, required): Ngày bắt đầu
- `end_date` (datetime, required): Ngày kết thúc
- `status` (string, required): Trạng thái (active, inactive, expired)
- `is_featured` (boolean, optional): Chiến dịch nổi bật
- `priority` (integer, optional): Độ ưu tiên hiển thị
- `metadata` (object, optional): Metadata tùy chỉnh

## Cập nhật chiến dịch khuyến mãi (Admin)

### PUT /api/dashboard/sale-campaigns/{saleCampaign}

**Mô tả**: Cập nhật thông tin chiến dịch khuyến mãi

**Phương thức**: PUT

**URL**: `/api/dashboard/sale-campaigns/{saleCampaign}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `saleCampaign` (integer, required): ID chiến dịch khuyến mãi

**Body**:

```json
{
  "name": "Flash Sale Tết 2025 - Gia hạn",
  "slug": "flash-sale-tet-2025-gia-han",
  "description": "Flash Sale Tết được gia hạn thêm 2 tuần",
  "banner_image": "https://placehold.co/600x400?text=flash-sale-extended.jpg",
  "start_date": "2025-02-01T00:00:00.000000Z",
  "end_date": "2025-02-28T23:59:59.000000Z",
  "status": "active",
  "is_featured": false,
  "priority": 10,
  "metadata": {
    "tags": ["flash-sale", "tet", "extended"],
    "color": "#00ff00"
  }
}
```

**Response thành công (200)**:

```json
{
  "message": "Sale campaign updated successfully",
  "data": {
    "id": 5,
    "name": "Test Sale Campaign API - Updated",
    "slug": "test-sale-campaign-api-updated",
    "description": "Test campaign đã được cập nhật",
    "banner_image": "https://placehold.co/600x400?text=test-campaign-updated.jpg",
    "start_date": "2025-08-16T00:00:00.000000Z",
    "end_date": "2025-08-20T23:59:59.000000Z",
    "status": "active",
    "is_featured": false,
    "priority": 25,
    "metadata": {
      "color": "#00ff00",
      "tags": ["test", "api", "updated"]
    },
    "created_at": "2025-08-15T18:23:08.000000Z",
    "updated_at": "2025-08-15T18:23:48.000000Z",
    "deleted_at": null
  }
}
```

## Xóa chiến dịch khuyến mãi (Admin)

### DELETE /api/dashboard/sale-campaigns/{saleCampaign}

**Mô tả**: Xóa chiến dịch khuyến mãi

**Phương thức**: DELETE

**URL**: `/api/dashboard/sale-campaigns/{saleCampaign}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `saleCampaign` (integer, required): ID chiến dịch khuyến mãi

**Response thành công (200)**:

```json
{
  "message": "Sale campaign deleted successfully"
}
```

**Response lỗi (400) - Chiến dịch đang hoạt động**:

```json
{
  "success": false,
  "message": "Cannot delete active sale campaign with products"
}
```

**Lưu ý**: Thực tế API cho phép xóa campaign đang active và có sản phẩm. Message trên chỉ là ví dụ cho trường hợp có thể xảy ra.

## Thêm sản phẩm vào chiến dịch (Admin)

### POST /api/dashboard/sale-campaigns/{saleCampaign}/products

**Mô tả**: Thêm sản phẩm vào chiến dịch khuyến mãi

**Phương thức**: POST

**URL**: `/api/dashboard/sale-campaigns/{saleCampaign}/products`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `saleCampaign` (integer, required): ID chiến dịch khuyến mãi

**Body**:

```json
{
  "products": [
    {
      "product_id": 1,
      "sale_price": 674250,
      "discount_type": "percentage",
      "max_quantity": 50
    },
    {
      "product_id": 2,
      "sale_price": 900000,
      "discount_type": "percentage",
      "max_quantity": 30
    }
  ]
}
```

**Response thành công (200)**:

```json
{
  "message": "Products added to sale campaign successfully"
}
```

## Xóa sản phẩm khỏi chiến dịch (Admin)

### DELETE /api/dashboard/sale-campaigns/{saleCampaign}/products/{product}

**Mô tả**: Xóa sản phẩm khỏi chiến dịch khuyến mãi

**Phương thức**: DELETE

**URL**: `/api/dashboard/sale-campaigns/{saleCampaign}/products/{product}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `saleCampaign` (integer, required): ID chiến dịch khuyến mãi
- `product` (integer, required): ID sản phẩm

**Response thành công (200)**:

```json
{
  "message": "Product removed from sale campaign successfully"
}
```

## Ví dụ sử dụng curl

### Tạo chiến dịch khuyến mãi mới

```bash
curl -X POST http://localhost:8000/api/dashboard/sale-campaigns \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Friday 2025",
    "slug": "black-friday-2025",
    "description": "Siêu sale Black Friday giảm đến 70%",
    "banner_image": "https://placehold.co/600x400?text=black-friday-2025.jpg",
    "start_date": "2025-11-29T00:00:00.000000Z",
    "end_date": "2025-11-29T23:59:59.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": 1,
    "metadata": {
      "tags": ["black-friday", "2025"],
      "color": "#000000"
    }
  }'
```

### Thêm sản phẩm vào chiến dịch

```bash
curl -X POST http://localhost:8000/api/dashboard/sale-campaigns/1/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "product_id": 1,
        "sale_price": 674250,
        "discount_type": "percentage",
        "max_quantity": 50
      },
      {
        "product_id": 2,
        "sale_price": 900000,
        "discount_type": "percentage",
        "max_quantity": 30
      }
    ]
  }'
```

### Xóa sản phẩm khỏi chiến dịch

```bash
curl -X DELETE http://localhost:8000/api/dashboard/sale-campaigns/1/products/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin hoặc contributor
- Response format không có `success` field ở cấp root (trừ trường hợp lỗi)
- Khi thêm sản phẩm, cần sử dụng array `products` với object chi tiết cho mỗi sản phẩm
- `sale_price` phải được tính sẵn và truyền vào, không tự động tính từ discount_percentage
- `discount_percentage` và `discount_amount` sẽ được tính tự động dựa trên original_price và sale_price
- Chiến dịch hoạt động khi `status = "active"` và trong khoảng thời gian start_date - end_date
- `priority` quyết định thứ tự hiển thị (số càng nhỏ càng ưu tiên)
- Có thể xóa chiến dịch active và có sản phẩm đang tham gia
- Khi cập nhật campaign, cần cung cấp đầy đủ các trường required (name, slug, start_date, end_date, status)
- Khi thêm sản phẩm vào chiến dịch, tất cả thông tin sale được lưu trong pivot table

**Test với cURL**:

```bash
# Login để lấy admin token
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@balozone.com","password":"admin123"}' | jq -r '.authorization.token'

# Lấy danh sách chiến dịch (admin view)
curl -X GET "http://localhost:8000/api/dashboard/sale-campaigns" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" | jq .

# Tạo chiến dịch mới
curl -X POST "http://localhost:8000/api/dashboard/sale-campaigns" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Sale Campaign API",
    "slug": "test-sale-campaign-api",
    "description": "Test campaign tạo từ API",
    "banner_image": "https://placehold.co/600x400?text=test-campaign-api.jpg",
    "start_date": "2025-08-16T00:00:00.000000Z",
    "end_date": "2025-08-20T23:59:59.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": 50,
    "metadata": {"tags": ["test", "api"], "color": "#ff0000"}
  }' | jq .

# Cập nhật chiến dịch (cần đầy đủ trường required)
curl -X PUT "http://localhost:8000/api/dashboard/sale-campaigns/5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Sale Campaign API - Updated",
    "slug": "test-sale-campaign-api-updated",
    "description": "Test campaign đã được cập nhật",
    "banner_image": "https://placehold.co/600x400?text=test-campaign-updated.jpg",
    "start_date": "2025-08-16T00:00:00.000000Z",
    "end_date": "2025-08-20T23:59:59.000000Z",
    "status": "active",
    "is_featured": false,
    "priority": 25,
    "metadata": {"tags": ["test", "api", "updated"], "color": "#00ff00"}
  }' | jq .

# Thêm sản phẩm vào chiến dịch
curl -X POST "http://localhost:8000/api/dashboard/sale-campaigns/5/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
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
  }' | jq .

# Xóa sản phẩm khỏi chiến dịch
curl -X DELETE "http://localhost:8000/api/dashboard/sale-campaigns/5/products/1" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .

# Xóa chiến dịch
curl -X DELETE "http://localhost:8000/api/dashboard/sale-campaigns/5" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .
```
