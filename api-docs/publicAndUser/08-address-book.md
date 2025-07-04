# 8. Sổ địa chỉ (Address Book)

## Lấy danh sách địa chỉ

### GET /api/addresses

**Mô tả**: Lấy danh sách tất cả địa chỉ của người dùng

**Phương thức**: GET

**URL**: `/api/addresses`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Địa chỉ nhà riêng",
      "recipient_name": "Nguyễn Văn A",
      "recipient_phone": "0123456789",
      "address": "123 Đường ABC, Phường XYZ",
      "ward": "Phường 1",
      "district": "Quận 1",
      "province": "TP. Hồ Chí Minh",
      "postal_code": "70000",
      "is_default": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "name": "Địa chỉ công ty",
      "recipient_name": "Nguyễn Văn A",
      "recipient_phone": "0123456789",
      "address": "456 Đường DEF, Phường GHI",
      "ward": "Phường 2",
      "district": "Quận 2",
      "province": "TP. Hồ Chí Minh",
      "postal_code": "70000",
      "is_default": false,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "message": "Lấy danh sách địa chỉ thành công"
}
```

## Lấy chi tiết địa chỉ

### GET /api/addresses/{id}

**Mô tả**: Lấy chi tiết một địa chỉ

**Phương thức**: GET

**URL**: `/api/addresses/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID địa chỉ

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "Địa chỉ nhà riêng",
    "recipient_name": "Nguyễn Văn A",
    "recipient_phone": "0123456789",
    "address": "123 Đường ABC, Phường XYZ",
    "ward": "Phường 1",
    "district": "Quận 1",
    "province": "TP. Hồ Chí Minh",
    "postal_code": "70000",
    "is_default": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Lấy chi tiết địa chỉ thành công"
}
```

**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "Địa chỉ không tồn tại"
}
```

## Thêm địa chỉ mới

### POST /api/addresses

**Mô tả**: Thêm địa chỉ mới

**Phương thức**: POST

**URL**: `/api/addresses`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
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
```

**Response thành công (201)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "Địa chỉ nhà riêng",
    "recipient_name": "Nguyễn Văn A",
    "recipient_phone": "0123456789",
    "address": "123 Đường ABC, Phường XYZ",
    "ward": "Phường 1",
    "district": "Quận 1",
    "province": "TP. Hồ Chí Minh",
    "postal_code": "70000",
    "is_default": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Thêm địa chỉ thành công"
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "name": ["Tên địa chỉ là bắt buộc"],
    "recipient_name": ["Tên người nhận là bắt buộc"],
    "recipient_phone": ["Số điện thoại người nhận là bắt buộc"],
    "address": ["Địa chỉ là bắt buộc"],
    "ward": ["Phường/Xã là bắt buộc"],
    "district": ["Quận/Huyện là bắt buộc"],
    "province": ["Tỉnh/Thành phố là bắt buộc"]
  }
}
```

**Validation rules**:

- `name` (string, required): Tên địa chỉ
- `recipient_name` (string, required): Tên người nhận
- `recipient_phone` (string, required): Số điện thoại người nhận
- `address` (string, required): Địa chỉ chi tiết
- `ward` (string, required): Phường/Xã
- `district` (string, required): Quận/Huyện
- `province` (string, required): Tỉnh/Thành phố
- `postal_code` (string, optional): Mã bưu điện
- `is_default` (boolean, optional): Đặt làm địa chỉ mặc định

## Cập nhật địa chỉ

### PUT /api/addresses/{id}

**Mô tả**: Cập nhật thông tin địa chỉ

**Phương thức**: PUT

**URL**: `/api/addresses/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `id` (integer, required): ID địa chỉ

**Body**: Giống như POST /api/addresses

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "Địa chỉ nhà riêng (đã cập nhật)",
    "recipient_name": "Nguyễn Văn A",
    "recipient_phone": "0123456789",
    "address": "123 Đường ABC, Phường XYZ",
    "ward": "Phường 1",
    "district": "Quận 1",
    "province": "TP. Hồ Chí Minh",
    "postal_code": "70000",
    "is_default": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z"
  },
  "message": "Cập nhật địa chỉ thành công"
}
```

## Xóa địa chỉ

### DELETE /api/addresses/{id}

**Mô tả**: Xóa địa chỉ

**Phương thức**: DELETE

**URL**: `/api/addresses/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID địa chỉ

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Xóa địa chỉ thành công"
}
```

**Response lỗi (400)**:

```json
{
  "success": false,
  "message": "Không thể xóa địa chỉ mặc định"
}
```

## Đặt địa chỉ mặc định

### POST /api/addresses/{id}/set-default

**Mô tả**: Đặt địa chỉ thành mặc định

**Phương thức**: POST

**URL**: `/api/addresses/{id}/set-default`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID địa chỉ

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Đặt địa chỉ mặc định thành công"
}
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication
- Người dùng chỉ có thể xem/sửa/xóa địa chỉ của chính mình
- Chỉ có thể có 1 địa chỉ mặc định cho mỗi người dùng
- Khi đặt địa chỉ mặc định mới, địa chỉ mặc định cũ sẽ được bỏ đặt
- Không thể xóa địa chỉ mặc định trừ khi có địa chỉ mặc định khác
