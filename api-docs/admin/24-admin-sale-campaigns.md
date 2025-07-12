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
  "description": "Giảm giá sốc lên đến 50% cho tất cả sản phẩm",
  "discount_type": "percentage",
  "discount_value": 30,
  "max_discount": 500000,
  "start_date": "2025-02-01 00:00:00",
  "end_date": "2025-02-15 23:59:59",
  "is_active": true,
  "is_featured": true,
  "priority": 1
}
```

**Response thành công (201)**:

```json
{
  "message": "Sale campaign created successfully",
  "data": {
    "name": "Test Sale Campaign",
    "slug": "test-sale-campaign",
    "description": "Test campaign tạo từ API",
    "banner_image": "https://placehold.co/600x400?text=test-campaign.jpg",
    "start_date": "2025-07-13T00:00:00.000000Z",
    "end_date": "2025-07-20T23:59:59.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": 50,
    "metadata": {
      "color": "#ff0000",
      "tags": ["test", "api"]
    },
    "updated_at": "2025-07-12T19:27:08.000000Z",
    "created_at": "2025-07-12T19:27:08.000000Z",
    "id": 5
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
    "discount_type": ["The selected discount type is invalid."],
    "discount_value": ["The discount value field is required."],
    "start_date": ["The start date must be a valid date."],
    "end_date": ["The end date must be after start date."]
  }
}
```

**Validation rules**:

- `name` (string, required, max:255): Tên chiến dịch
- `description` (string, optional): Mô tả chiến dịch
- `discount_type` (string, required): Loại giảm giá (percentage, fixed_amount)
- `discount_value` (numeric, required): Giá trị giảm giá
- `max_discount` (numeric, optional): Giảm giá tối đa (cho percentage)
- `start_date` (datetime, required): Ngày bắt đầu
- `end_date` (datetime, required): Ngày kết thúc
- `is_active` (boolean, optional): Trạng thái hoạt động
- `is_featured` (boolean, optional): Chiến dịch nổi bật
- `priority` (integer, optional): Độ ưu tiên hiển thị

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
  "discount_value": 35,
  "end_date": "2025-02-28 23:59:59",
  "is_featured": false
}
```

**Response thành công (200)**:

```json
{
  "message": "Sale campaign updated successfully",
  "data": {
    "id": 5,
    "name": "Test Sale Campaign - Updated",
    "slug": "test-sale-campaign-updated",
    "description": "Test campaign đã được cập nhật",
    "banner_image": "https://placehold.co/600x400?text=test-campaign-updated.jpg",
    "start_date": "2025-07-13T00:00:00.000000Z",
    "end_date": "2025-07-20T23:59:59.000000Z",
    "status": "active",
    "is_featured": false,
    "priority": 25,
    "metadata": {
      "color": "#00ff00",
      "tags": ["test", "api", "updated"]
    },
    "created_at": "2025-07-12T19:27:08.000000Z",
    "updated_at": "2025-07-12T19:27:28.000000Z",
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
  "message": "Cannot delete active sale campaign"
}
```

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
    "description": "Siêu sale Black Friday giảm đến 70%",
    "discount_type": "percentage",
    "discount_value": 50,
    "max_discount": 1000000,
    "start_date": "2025-11-29 00:00:00",
    "end_date": "2025-11-29 23:59:59",
    "is_active": true,
    "is_featured": true,
    "priority": 1
  }'
```

### Thêm sản phẩm vào chiến dịch

```bash
curl -X POST http://localhost:8000/api/dashboard/sale-campaigns/1/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": [1, 2, 3, 10, 15, 20]
  }'
```

### Xóa sản phẩm khỏi chiến dịch

```bash
curl -X DELETE http://localhost:8000/api/dashboard/sale-campaigns/1/products/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin hoặc contributor
- Response format không có `success` field ở cấp root như documentation cũ
- Khi thêm sản phẩm, cần sử dụng array `products` với object chi tiết cho mỗi sản phẩm
- `sale_price` phải được tính sẵn và truyền vào, không tự động tính từ discount_percentage
- `discount_percentage` và `discount_amount` sẽ được tính tự động dựa trên original_price và sale_price
- Chiến dịch chỉ hoạt động khi `status = "active"` và trong khoảng thời gian start_date - end_date
- `priority` quyết định thứ tự hiển thị (số càng nhỏ càng ưu tiên)
- Có thể xóa chiến dịch active và có sản phẩm đang tham gia
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
    "name": "Test Sale Campaign",
    "slug": "test-sale-campaign",
    "description": "Test campaign",
    "banner_image": "https://placehold.co/600x400?text=test.jpg",
    "start_date": "2025-07-13T00:00:00.000000Z",
    "end_date": "2025-07-20T23:59:59.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": 50,
    "metadata": {"tags": ["test"], "color": "#ff0000"}
  }' | jq .

# Cập nhật chiến dịch
curl -X PUT "http://localhost:8000/api/dashboard/sale-campaigns/5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Campaign",
    "description": "Updated description",
    "priority": 25
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
