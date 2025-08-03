# 7. Quản lý người dùng (User Management)

## Lấy thông tin người dùng hiện tại

### GET /api/profile

**Mô tả**: Lấy thông tin chi tiết người dùng hiện tại

**Phương thức**: GET

**URL**: `/api/profile`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "status": "active",
    "email_verified_at": "2024-01-01T00:00:00.000000Z",
    "address_books": [
      {
        "id": 1,
        "name": "Địa chỉ nhà riêng",
        "recipient_name": "Nguyễn Văn A",
        "recipient_phone": "0123456789",
        "address": "123 Đường ABC, Phường XYZ",
        "ward": "Phường 1",
        "district": "Quận 1",
        "province": "TP. Hồ Chí Minh",
        "postal_code": "70000",
        "is_default": true
      }
    ],
    "orders": [
      {
        "id": 1,
        "order_number": "ORD-2024-001",
        "status": "pending",
        "total_price": 1200000,
        "payment_status": "pending",
        "created_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## Cập nhật thông tin người dùng

### PUT /api/profile

**Mô tả**: Cập nhật thông tin người dùng hiện tại

**Phương thức**: PUT

**URL**: `/api/profile`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "name": "Nguyễn Văn A Updated",
  "email": "user-updated@example.com",
  "phone": "0987654321"
}
```

**Response thành công (200)**:

```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A Updated",
    "email": "user-updated@example.com",
    "phone": "0987654321",
    "status": "active",
    "email_verified_at": "2024-01-01T00:00:00.000000Z",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z"
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
    "email": ["The email has already been taken."],
    "phone": ["The phone must not be greater than 20 characters."]
  }
}
```

**Validation rules**:

- `name` (string, required, max:255): Tên người dùng
- `email` (string, required, email, max:255, unique): Email người dùng
- `phone` (string, optional, max:20): Số điện thoại

## Thay đổi mật khẩu

### POST /api/change-password

**Mô tả**: Thay đổi mật khẩu người dùng

**Phương thức**: POST

**URL**: `/api/change-password`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "current_password": "old_password123",
  "new_password": "new_password123",
  "new_password_confirmation": "new_password123"
}
```

**Response thành công (200)**:

```json
{
  "message": "Password changed successfully"
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "current_password": ["The current password field is required."],
    "new_password": ["The new password must be at least 6 characters.", "The new password confirmation does not match."]
  }
}
```

**Response lỗi - Mật khẩu hiện tại sai (422)**:

```json
{
  "success": false,
  "message": "Mật khẩu hiện tại không đúng"
}
```

**Validation rules**:

- `current_password` (string, required): Mật khẩu hiện tại
- `new_password` (string, required, min:6, confirmed): Mật khẩu mới
- `new_password_confirmation` (string, required): Xác nhận mật khẩu mới

## Lấy thống kê người dùng

### GET /api/user/stats

**Mô tả**: Lấy thống kê của người dùng hiện tại

**Phương thức**: GET

**URL**: `/api/user/stats`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "data": {
    "total_orders": 5,
    "pending_orders": 2,
    "completed_orders": 3,
    "total_spent": 6500000,
    "total_comments": 8,
    "addresses_count": 2,
    "member_since": "2024-01-01"
  }
}
```

## Xóa tài khoản

### DELETE /api/delete-account

**Mô tả**: Xóa tài khoản người dùng hiện tại

**Phương thức**: DELETE

**URL**: `/api/delete-account`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "password": "user_password123"
}
```

**Response thành công (200)**:

```json
{
  "message": "Account deleted successfully"
}
```

**Response lỗi (422) - Mật khẩu sai**:

```json
{
  "success": false,
  "message": "Mật khẩu không đúng"
}
```

**Response lỗi (422) - Có đơn hàng pending**:

```json
{
  "message": "Cannot delete account with pending orders"
}
```

**Validation rules**:

- `password` (string, required): Mật khẩu xác nhận

**Lưu ý**:

- Tất cả các endpoint trong module này đều yêu cầu authentication
- Không thể xóa tài khoản khi có đơn hàng đang pending
- Profile sẽ include thông tin addresses và orders gần đây (5 đơn hàng cuối)
- Status chỉ có 2 giá trị: "active", "inactive"
- Không có avatar, date_of_birth, gender trong hệ thống
