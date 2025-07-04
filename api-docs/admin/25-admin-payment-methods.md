# 25. Quản lý phương thức thanh toán (Admin Payment Methods)

> **Lưu ý**: Các endpoint quản lý phương thức thanh toán sử dụng `/api/dashboard/payment-methods/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý phương thức thanh toán

## Tạo phương thức thanh toán mới (Admin)

### POST /api/dashboard/payment-methods

**Mô tả**: Tạo phương thức thanh toán mới

**Phương thức**: POST

**URL**: `/api/dashboard/payment-methods`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "name": "Ví điện tử MoMo",
  "code": "momo",
  "description": "Thanh toán qua ví điện tử MoMo",
  "instructions": "Quét mã QR hoặc nhập số điện thoại để thanh toán",
  "is_active": true,
  "sort_order": 1,
  "config": {
    "merchant_id": "MOMO123456",
    "secret_key": "your_secret_key",
    "environment": "sandbox"
  }
}
```

**Response thành công (201)**:

```json
{
  "success": true,
  "message": "Payment method created successfully",
  "data": {
    "id": 1,
    "name": "Ví điện tử MoMo",
    "code": "momo",
    "description": "Thanh toán qua ví điện tử MoMo",
    "instructions": "Quét mã QR hoặc nhập số điện thoại để thanh toán",
    "is_active": true,
    "sort_order": 1,
    "config": {
      "merchant_id": "MOMO123456",
      "secret_key": "***hidden***",
      "environment": "sandbox"
    },
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
    "code": ["The code has already been taken."],
    "sort_order": ["The sort order must be a number."]
  }
}
```

**Validation rules**:

- `name` (string, required, max:255): Tên phương thức thanh toán
- `code` (string, required, max:50, unique): Mã phương thức (unique)
- `description` (string, optional): Mô tả ngắn
- `instructions` (text, optional): Hướng dẫn sử dụng
- `is_active` (boolean, optional): Trạng thái hoạt động
- `sort_order` (integer, optional): Thứ tự hiển thị
- `config` (json, optional): Cấu hình kỹ thuật

## Cập nhật phương thức thanh toán (Admin)

### PUT /api/dashboard/payment-methods/{paymentMethod}

**Mô tả**: Cập nhật thông tin phương thức thanh toán

**Phương thức**: PUT

**URL**: `/api/dashboard/payment-methods/{paymentMethod}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `paymentMethod` (integer, required): ID phương thức thanh toán

**Body**:

```json
{
  "name": "Ví điện tử MoMo - Cập nhật",
  "description": "Thanh toán nhanh chóng qua ví điện tử MoMo",
  "is_active": false,
  "sort_order": 2
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Payment method updated successfully",
  "data": {
    "id": 1,
    "name": "Ví điện tử MoMo - Cập nhật",
    "code": "momo",
    "description": "Thanh toán nhanh chóng qua ví điện tử MoMo",
    "instructions": "Quét mã QR hoặc nhập số điện thoại để thanh toán",
    "is_active": false,
    "sort_order": 2,
    "config": {
      "merchant_id": "MOMO123456",
      "secret_key": "***hidden***",
      "environment": "sandbox"
    },
    "created_at": "2025-01-01T12:00:00.000000Z",
    "updated_at": "2025-01-01T15:30:00.000000Z"
  }
}
```

## Xóa phương thức thanh toán (Admin)

### DELETE /api/dashboard/payment-methods/{paymentMethod}

**Mô tả**: Xóa phương thức thanh toán

**Phương thức**: DELETE

**URL**: `/api/dashboard/payment-methods/{paymentMethod}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `paymentMethod` (integer, required): ID phương thức thanh toán

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Payment method deleted successfully"
}
```

**Response lỗi (400) - Phương thức đang được sử dụng**:

```json
{
  "success": false,
  "message": "Cannot delete payment method that is in use"
}
```

## Ví dụ sử dụng curl

### Tạo phương thức thanh toán mới

```bash
curl -X POST http://localhost:8000/api/dashboard/payment-methods \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thẻ tín dụng/ghi nợ",
    "code": "credit_card",
    "description": "Thanh toán bằng thẻ Visa, MasterCard, JCB",
    "instructions": "Nhập thông tin thẻ và xác thực OTP",
    "is_active": true,
    "sort_order": 1,
    "config": {
      "gateway": "stripe",
      "public_key": "pk_test_...",
      "secret_key": "sk_test_...",
      "webhook_secret": "whsec_..."
    }
  }'
```

### Cập nhật phương thức thanh toán

```bash
curl -X PUT http://localhost:8000/api/dashboard/payment-methods/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thẻ tín dụng - Visa/MasterCard",
    "description": "Thanh toán an toàn với thẻ quốc tế",
    "is_active": true,
    "sort_order": 1
  }'
```

### Xóa phương thức thanh toán

```bash
curl -X DELETE http://localhost:8000/api/dashboard/payment-methods/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Các phương thức thanh toán phổ biến

### 1. Thanh toán khi nhận hàng (COD)

```json
{
  "name": "Thanh toán khi nhận hàng",
  "code": "cod",
  "description": "Thanh toán bằng tiền mặt khi nhận hàng",
  "instructions": "Quý khách vui lòng chuẩn bị tiền mặt khi nhận hàng",
  "is_active": true,
  "sort_order": 1,
  "config": {
    "max_amount": 5000000,
    "regions": ["HCM", "HN", "DN"]
  }
}
```

### 2. Chuyển khoản ngân hàng

```json
{
  "name": "Chuyển khoản ngân hàng",
  "code": "bank_transfer",
  "description": "Chuyển khoản qua tài khoản ngân hàng",
  "instructions": "Chuyển khoản và gửi ảnh chụp biên lai",
  "is_active": true,
  "sort_order": 2,
  "config": {
    "bank_name": "Vietcombank",
    "account_number": "1234567890",
    "account_name": "CONG TY BALOZONE"
  }
}
```

### 3. Ví điện tử ZaloPay

```json
{
  "name": "Ví điện tử ZaloPay",
  "code": "zalopay",
  "description": "Thanh toán qua ví điện tử ZaloPay",
  "instructions": "Quét mã QR hoặc chọn thanh toán trong app ZaloPay",
  "is_active": true,
  "sort_order": 3,
  "config": {
    "app_id": "553",
    "key1": "your_key1",
    "key2": "your_key2"
  }
}
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin hoặc contributor
- Code phương thức phải unique trong hệ thống
- Chỉ phương thức có `is_active = true` mới hiển thị cho khách hàng
- `sort_order` quyết định thứ tự hiển thị trên frontend
- `config` chứa các thông tin kỹ thuật cần thiết cho tích hợp
- Sensitive data trong config sẽ được ẩn khi trả về API
- Không thể xóa phương thức đang được sử dụng trong đơn hàng
