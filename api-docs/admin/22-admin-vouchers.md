# 22. Quản lý voucher (Admin Vouchers)

> **Lưu ý**: Các endpoint quản lý voucher sử dụng `/api/dashboard/vouchers/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý voucher

## Tạo voucher mới (Admin)

### POST /api/dashboard/vouchers

**Mô tả**: Tạo voucher mới

**Phương thức**: POST

**URL**: `/api/dashboard/vouchers`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "code": "SALE2025",
  "name": "Khuyến mãi năm mới 2025",
  "description": "Giảm giá 20% cho tất cả sản phẩm",
  "type": "percentage",
  "value": 20,
  "min_order_value": 500000,
  "max_discount": 200000,
  "usage_limit": 100,
  "usage_limit_per_user": 1,
  "start_date": "2025-01-01 00:00:00",
  "end_date": "2025-01-31 23:59:59",
  "is_active": true
}
```

**Response thành công (201)**:

```json
{
  "success": true,
  "message": "Voucher created successfully",
  "data": {
    "id": 1,
    "code": "SALE2025",
    "name": "Khuyến mãi năm mới 2025",
    "description": "Giảm giá 20% cho tất cả sản phẩm",
    "type": "percentage",
    "value": 20,
    "min_order_value": 500000,
    "max_discount": 200000,
    "usage_limit": 100,
    "usage_count": 0,
    "usage_limit_per_user": 1,
    "start_date": "2025-01-01T00:00:00.000000Z",
    "end_date": "2025-01-31T23:59:59.000000Z",
    "is_active": true,
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
    "code": ["The code field is required."],
    "name": ["The name field is required."],
    "type": ["The selected type is invalid."],
    "value": ["The value field is required."],
    "start_date": ["The start date must be a valid date."],
    "end_date": ["The end date must be after start date."]
  }
}
```

**Validation rules**:

- `code` (string, required, max:50, unique): Mã voucher
- `name` (string, required, max:255): Tên voucher
- `description` (string, optional): Mô tả
- `type` (string, required): Loại voucher (percentage, fixed_amount)
- `value` (numeric, required): Giá trị giảm
- `min_order_value` (numeric, optional): Giá trị đơn hàng tối thiểu
- `max_discount` (numeric, optional): Giảm giá tối đa (cho percentage)
- `usage_limit` (integer, optional): Giới hạn số lần sử dụng
- `usage_limit_per_user` (integer, optional): Giới hạn mỗi user
- `start_date` (datetime, required): Ngày bắt đầu
- `end_date` (datetime, required): Ngày kết thúc
- `is_active` (boolean, optional): Trạng thái hoạt động

## Cập nhật voucher (Admin)

### PUT /api/dashboard/vouchers/{voucher}

**Mô tả**: Cập nhật thông tin voucher

**Phương thức**: PUT

**URL**: `/api/dashboard/vouchers/{voucher}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `voucher` (integer, required): ID voucher

**Body**:

```json
{
  "name": "Khuyến mãi tết 2025",
  "description": "Giảm giá 25% cho tất cả sản phẩm",
  "value": 25,
  "max_discount": 300000,
  "is_active": false
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Voucher updated successfully",
  "data": {
    "id": 1,
    "code": "SALE2025",
    "name": "Khuyến mãi tết 2025",
    "description": "Giảm giá 25% cho tất cả sản phẩm",
    "type": "percentage",
    "value": 25,
    "min_order_value": 500000,
    "max_discount": 300000,
    "usage_limit": 100,
    "usage_count": 0,
    "usage_limit_per_user": 1,
    "start_date": "2025-01-01T00:00:00.000000Z",
    "end_date": "2025-01-31T23:59:59.000000Z",
    "is_active": false,
    "created_at": "2025-01-01T12:00:00.000000Z",
    "updated_at": "2025-01-01T12:30:00.000000Z"
  }
}
```

## Xóa voucher (Admin)

### DELETE /api/dashboard/vouchers/{voucher}

**Mô tả**: Xóa voucher

**Phương thức**: DELETE

**URL**: `/api/dashboard/vouchers/{voucher}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `voucher` (integer, required): ID voucher

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Voucher deleted successfully"
}
```

**Response lỗi (400) - Voucher đang được sử dụng**:

```json
{
  "success": false,
  "message": "Cannot delete voucher that is currently in use"
}
```

## Ví dụ sử dụng curl

### Tạo voucher mới

```bash
curl -X POST http://localhost:8000/api/dashboard/vouchers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "NEWYEAR2025",
    "name": "Khuyến mãi năm mới",
    "description": "Giảm 15% tối đa 150k",
    "type": "percentage",
    "value": 15,
    "min_order_value": 300000,
    "max_discount": 150000,
    "usage_limit": 200,
    "usage_limit_per_user": 1,
    "start_date": "2025-01-01 00:00:00",
    "end_date": "2025-01-15 23:59:59",
    "is_active": true
  }'
```

### Cập nhật voucher

```bash
curl -X PUT http://localhost:8000/api/dashboard/vouchers/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Khuyến mãi năm mới - Updated",
    "value": 20,
    "max_discount": 200000
  }'
```

### Xóa voucher

```bash
curl -X DELETE http://localhost:8000/api/dashboard/vouchers/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin hoặc contributor
- Code voucher phải unique trong hệ thống
- Không thể xóa voucher đang được sử dụng trong đơn hàng
- Type voucher: `percentage` (phần trăm) hoặc `fixed_amount` (số tiền cố định)
- Voucher chỉ hoạt động khi `is_active = true` và trong khoảng thời gian start_date - end_date
- `max_discount` chỉ áp dụng cho type `percentage`
