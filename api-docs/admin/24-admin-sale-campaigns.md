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
  "success": true,
  "message": "Sale campaign created successfully",
  "data": {
    "id": 1,
    "name": "Flash Sale Tết 2025",
    "description": "Giảm giá sốc lên đến 50% cho tất cả sản phẩm",
    "discount_type": "percentage",
    "discount_value": 30,
    "max_discount": 500000,
    "start_date": "2025-02-01T00:00:00.000000Z",
    "end_date": "2025-02-15T23:59:59.000000Z",
    "is_active": true,
    "is_featured": true,
    "priority": 1,
    "products_count": 0,
    "created_at": "2025-01-01T12:00:00.000000Z",
    "updated_at": "2025-01-01T12:00:00.000000Z"
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
  "success": true,
  "message": "Sale campaign updated successfully",
  "data": {
    "id": 1,
    "name": "Flash Sale Tết 2025 - Gia hạn",
    "description": "Giảm giá sốc lên đến 50% cho tất cả sản phẩm",
    "discount_type": "percentage",
    "discount_value": 35,
    "max_discount": 500000,
    "start_date": "2025-02-01T00:00:00.000000Z",
    "end_date": "2025-02-28T23:59:59.000000Z",
    "is_active": true,
    "is_featured": false,
    "priority": 1,
    "products_count": 25,
    "created_at": "2025-01-01T12:00:00.000000Z",
    "updated_at": "2025-01-01T15:30:00.000000Z"
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
  "success": true,
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
  "product_ids": [1, 2, 3, 4, 5]
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Products added to sale campaign successfully",
  "data": {
    "campaign_id": 1,
    "added_products": 5,
    "products": [
      {
        "id": 1,
        "name": "Túi xách da cao cấp",
        "price": 1200000,
        "sale_price": 840000,
        "discount_percentage": 30
      },
      {
        "id": 2,
        "name": "Ba lô laptop thời trang",
        "price": 800000,
        "sale_price": 560000,
        "discount_percentage": 30
      }
    ]
  }
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
  "success": true,
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
- Discount type: `percentage` (phần trăm) hoặc `fixed_amount` (số tiền cố định)
- `max_discount` chỉ áp dụng cho type `percentage`
- Chiến dịch chỉ hoạt động khi `is_active = true` và trong khoảng thời gian start_date - end_date
- `priority` quyết định thứ tự hiển thị (số càng nhỏ càng ưu tiên)
- Không thể xóa chiến dịch đang hoạt động hoặc có sản phẩm đang tham gia
- Khi thêm sản phẩm vào chiến dịch, giá sale sẽ được tính tự động
