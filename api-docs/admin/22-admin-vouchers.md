# 22. Quản lý voucher (Admin Vouchers)

> **Lưu ý**: Các endpoint quản lý voucher sử dụng `/api/dashboard/vouchers/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý voucher

## Danh sách voucher (Admin)

### GET /api/dashboard/vouchers

**Mô tả**: Lấy danh sách tất cả voucher

**Phương thức**: GET

**URL**: `/api/dashboard/vouchers`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Accept: application/json
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "WELCOME10",
      "name": "Voucher Chào Mừng",
      "description": "Giảm 10% cho khách hàng mới",
      "discount_type": "percentage",
      "discount_value": "10.00",
      "min_order_value": "200000.00",
      "max_discount_amount": "50000.00",
      "usage_limit": 100,
      "used_count": 0,
      "start_date": "2025-08-02T19:37:52.000000Z",
      "end_date": "2025-11-02T19:37:52.000000Z",
      "is_active": true,
      "created_at": "2025-08-02T19:37:52.000000Z",
      "updated_at": "2025-08-02T19:37:52.000000Z",
      "deleted_at": null
    }
  ],
  "message": "Lấy danh sách voucher thành công"
}
```

## Chi tiết voucher (Admin)

### GET /api/dashboard/vouchers/{id}

**Mô tả**: Lấy thông tin chi tiết một voucher

**Phương thức**: GET

**URL**: `/api/dashboard/vouchers/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Accept: application/json
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "WELCOME10",
    "name": "Voucher Chào Mừng",
    "description": "Giảm 10% cho khách hàng mới",
    "discount_type": "percentage",
    "discount_value": "10.00",
    "min_order_value": "200000.00",
    "max_discount_amount": "50000.00",
    "usage_limit": 100,
    "used_count": 0,
    "start_date": "2025-08-02T19:37:52.000000Z",
    "end_date": "2025-11-02T19:37:52.000000Z",
    "is_active": true,
    "created_at": "2025-08-02T19:37:52.000000Z",
    "updated_at": "2025-08-02T19:37:52.000000Z",
    "deleted_at": null
  },
  "message": "Lấy thông tin voucher thành công"
}
```

## Tạo voucher mới (Admin)

### POST /api/dashboard/vouchers

**Mô tả**: Tạo voucher mới

**Phương thức**: POST

**URL**: `/api/dashboard/vouchers`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "code": "TEST2025",
  "name": "Test Voucher 2025",
  "description": "Test voucher for API testing",
  "discount_type": "percentage",
  "discount_value": 20,
  "min_order_value": 300000,
  "max_discount_amount": 100000,
  "usage_limit": 50,
  "start_date": "2025-08-03 00:00:00",
  "end_date": "2025-08-31 23:59:59",
  "is_active": true
}
```

**Validation Rules**:

| Field | Rules | Mô tả |
|-------|-------|-------|
| code | required, string, max:50, unique | Mã voucher |
| name | required, string, max:255 | Tên voucher |
| description | nullable, string | Mô tả voucher |
| discount_type | required, in:percentage,fixed | Loại giảm giá |
| discount_value | required, numeric, min:0 | Giá trị giảm |
| min_order_value | nullable, numeric, min:0 | Giá trị đơn hàng tối thiểu |
| max_discount_amount | nullable, numeric, min:0 | Giảm tối đa (cho percentage) |
| usage_limit | nullable, integer, min:0 | Giới hạn số lần sử dụng |
| start_date | required, date | Ngày bắt đầu |
| end_date | required, date, after:start_date | Ngày kết thúc |
| is_active | boolean | Trạng thái hoạt động |

**Response thành công (201)**:

```json
{
  "success": true,
  "data": {
    "code": "TEST2025",
    "name": "Test Voucher 2025",
    "description": "Test voucher for API testing",
    "discount_type": "percentage",
    "discount_value": "20.00",
    "min_order_value": "300000.00",
    "max_discount_amount": "100000.00",
    "usage_limit": 50,
    "start_date": "2025-08-03T00:00:00.000000Z",
    "end_date": "2025-08-31T23:59:59.000000Z",
    "is_active": true,
    "updated_at": "2025-08-03T07:34:04.000000Z",
    "created_at": "2025-08-03T07:34:04.000000Z",
    "id": 7
  },
  "message": "Tạo voucher thành công"
}
```

**Response lỗi (400)**:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "code": ["The code field is required."],
    "name": ["The name field is required."],
    "discount_type": ["The selected discount type is invalid."],
    "discount_value": ["The discount value field is required."],
    "start_date": ["The start date field is required."],
    "end_date": ["The end date field is required."]
  }
}
```

## Cập nhật voucher (Admin)

### PUT /api/dashboard/vouchers/{id}

**Mô tả**: Cập nhật thông tin voucher

**Phương thức**: PUT

**URL**: `/api/dashboard/vouchers/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "code": "TEST2025",
  "name": "Updated Test Voucher 2025",
  "description": "Updated test voucher with new description",
  "discount_type": "percentage",
  "discount_value": 25,
  "min_order_value": 300000,
  "max_discount_amount": 150000,
  "usage_limit": 75,
  "start_date": "2025-08-03 00:00:00",
  "end_date": "2025-09-30 23:59:59",
  "is_active": true
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 7,
    "code": "TEST2025",
    "name": "Updated Test Voucher 2025",
    "description": "Updated test voucher with new description",
    "discount_type": "percentage",
    "discount_value": "25.00",
    "min_order_value": "300000.00",
    "max_discount_amount": "150000.00",
    "usage_limit": 75,
    "used_count": 0,
    "start_date": "2025-08-03T00:00:00.000000Z",
    "end_date": "2025-09-30T23:59:59.000000Z",
    "is_active": true,
    "created_at": "2025-08-03T07:34:04.000000Z",
    "updated_at": "2025-08-03T07:34:22.000000Z",
    "deleted_at": null
  },
  "message": "Cập nhật voucher thành công"
}
```

## Xóa voucher (Admin)

### DELETE /api/dashboard/vouchers/{id}

**Mô tả**: Xóa voucher (soft delete)

**Phương thức**: DELETE

**URL**: `/api/dashboard/vouchers/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Accept: application/json
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Xóa voucher thành công"
}
```

**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "Voucher không tồn tại hoặc có lỗi xảy ra"
}
```

## Ví dụ sử dụng

### 1. Lấy danh sách voucher

```bash
curl -X GET "http://localhost:8000/api/dashboard/vouchers" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

### 2. Tạo voucher phần trăm

```bash
curl -X POST "http://localhost:8000/api/dashboard/vouchers" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST2025",
    "name": "Test Voucher 2025",
    "description": "Test voucher for API testing",
    "discount_type": "percentage",
    "discount_value": 20,
    "min_order_value": 300000,
    "max_discount_amount": 100000,
    "usage_limit": 50,
    "start_date": "2025-08-03 00:00:00",
    "end_date": "2025-08-31 23:59:59",
    "is_active": true
  }'
```

### 3. Tạo voucher số tiền cố định

```bash
curl -X POST "http://localhost:8000/api/dashboard/vouchers" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FIXED80K",
    "name": "Fixed Amount Voucher",
    "description": "Giảm cố định 80k",
    "discount_type": "fixed",
    "discount_value": 80000,
    "min_order_value": 400000,
    "usage_limit": 30,
    "start_date": "2025-08-03 00:00:00",
    "end_date": "2025-08-31 23:59:59",
    "is_active": true
  }'
```

### 4. Cập nhật voucher

```bash
curl -X PUT "http://localhost:8000/api/dashboard/vouchers/7" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST2025",
    "name": "Updated Test Voucher 2025",
    "description": "Updated test voucher with new description",
    "discount_type": "percentage",
    "discount_value": 25,
    "min_order_value": 300000,
    "max_discount_amount": 150000,
    "usage_limit": 75,
    "start_date": "2025-08-03 00:00:00",
    "end_date": "2025-09-30 23:59:59",
    "is_active": true
  }'
```

### 5. Xóa voucher

```bash
curl -X DELETE "http://localhost:8000/api/dashboard/vouchers/8" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

## Lưu ý quan trọng

- **Code voucher**: Phải unique và sẽ được tự động uppercase
- **Discount types**:
  - `percentage`: Giảm theo phần trăm (cần `max_discount_amount`)
  - `fixed`: Giảm số tiền cố định (không cần `max_discount_amount`)
- **Validation**: Ngày kết thúc phải sau ngày bắt đầu
- **Soft delete**: Voucher bị xóa sẽ không bị xóa hoàn toàn khỏi database
- **Code duplicate**: Không thể tạo voucher với code đã tồn tại
