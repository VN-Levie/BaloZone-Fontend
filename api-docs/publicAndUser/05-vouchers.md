# 5. Phiếu giảm giá (Vouchers)

## Lấy danh sách voucher

### GET /api/vouchers

**Mô tả**: Lấy danh sách voucher còn hiệu lực

**Phương thức**: GET

**URL**: `/api/vouchers`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số**: Không có

**Response thành công (200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "SUMMER2024",
      "name": "Voucher Hè 2024",
      "description": "Giảm 20% cho đơn hàng từ 500k",
      "discount_type": "percentage",
      "discount_value": 20,
      "min_order_value": 500000,
      "max_discount_amount": 200000,
      "usage_limit": 100,
      "used_count": 25,
      "start_date": "2024-06-01T00:00:00.000000Z",
      "end_date": "2024-08-31T23:59:59.000000Z",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "message": "Lấy danh sách voucher thành công"
}
```

**Response lỗi (401)**:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Kiểm tra voucher

### POST /api/vouchers/check

**Mô tả**: Kiểm tra tính hợp lệ của voucher

**Phương thức**: POST

**URL**: `/api/vouchers/check`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "code": "SUMMER2024",
  "order_total": 600000
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "SUMMER2024",
    "name": "Voucher Hè 2024",
    "discount_type": "percentage",
    "discount_value": 20,
    "discount_amount": 120000,
    "min_order_value": 500000,
    "max_discount_amount": 200000,
    "is_applicable": true,
    "message": "Voucher hợp lệ"
  },
  "message": "Kiểm tra voucher thành công"
}
```

**Response lỗi (400)**:

```json
{
  "success": false,
  "message": "Voucher không hợp lệ hoặc không thể áp dụng",
  "errors": {
    "code": ["Voucher không tồn tại"],
    "order_total": ["Giá trị đơn hàng không đủ điều kiện"]
  }
}
```

**Validation rules**:

- `code` (string, required): Mã voucher
- `order_total` (numeric, required): Tổng giá trị đơn hàng

**Lưu ý**:

- Endpoint này yêu cầu authentication
- Voucher phải còn hiệu lực (trong thời gian và còn lượt sử dụng)
- Kiểm tra điều kiện áp dụng (giá trị đơn hàng tối thiểu)
- Trả về số tiền được giảm cụ thể
- `discount_type` có thể là "percentage" hoặc "fixed"
