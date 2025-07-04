# 11. Liên hệ (Contact)

## Gửi liên hệ

### POST /api/contact

**Mô tả**: Gửi form liên hệ

**Phương thức**: POST

**URL**: `/api/contact`

**Phân quyền**: Không yêu cầu authentication

**Headers**:

```
Content-Type: application/json
```

**Body**:

```json
{
  "fullname": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0123456789",
  "subject": "Hỏi về sản phẩm",
  "message": "Xin chào, tôi muốn hỏi về sản phẩm balo Nike..."
}
```

**Response thành công (201)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullname": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "subject": "Hỏi về sản phẩm",
    "message": "Xin chào, tôi muốn hỏi về sản phẩm balo Nike...",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất."
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "fullname": ["Tên là bắt buộc"],
    "email": ["Email là bắt buộc", "Email không hợp lệ"],
    "phone": ["Số điện thoại là bắt buộc"],
    "subject": ["Chủ đề là bắt buộc"],
    "message": ["Nội dung tin nhắn là bắt buộc"]
  }
}
```

**Validation rules**:

- `fullname` (string, required): Tên người liên hệ
- `email` (string, required): Email người liên hệ
- `phone` (string, required): Số điện thoại người liên hệ
- `subject` (string, required): Chủ đề liên hệ
- `message` (string, required): Nội dung tin nhắn

## Lấy thông tin liên hệ

### GET /api/contact-info

**Mô tả**: Lấy thông tin liên hệ của công ty

**Phương thức**: GET

**URL**: `/api/contact-info`

**Phân quyền**: Không yêu cầu authentication

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "company_name": "BaloZone",
    "address": "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
    "phone": "0123456789",
    "email": "info@balozone.com",
    "website": "https://balozone.com",
    "business_hours": {
      "monday_to_friday": "8:00 AM - 6:00 PM",
      "saturday": "8:00 AM - 5:00 PM",
      "sunday": "9:00 AM - 4:00 PM"
    },
    "social_media": {
      "facebook": "https://facebook.com/balozone",
      "instagram": "https://instagram.com/balozone",
      "youtube": "https://youtube.com/balozone"
    },
    "map_coordinates": {
      "latitude": 10.7769,
      "longitude": 106.7009
    }
  },
  "message": "Lấy thông tin liên hệ thành công"
}
```

**Lưu ý**:

- Tất cả các endpoint contact đều public, không cần authentication
- Form liên hệ sẽ được lưu vào database với trạng thái "pending"
- Admin có thể xem và trả lời các liên hệ trong admin panel
- Thông tin liên hệ công ty có thể được config trong admin panel
- Tự động gửi email xác nhận cho khách hàng khi gửi liên hệ thành công
