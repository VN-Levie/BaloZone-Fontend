# 16. Quản lý liên hệ (Admin Contact)

> **Lưu ý**: Các endpoint quản lý liên hệ sử dụng prefix `/api/dashboard/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý liên hệ

## Lấy danh sách liên hệ (Admin)

### GET /api/dashboard/contacts

**Mô tả**: Lấy danh sách tất cả liên hệ trong hệ thống

**Phương thức**: GET

**URL**: `/api/dashboard/contacts`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `status` (string, optional): Lọc theo trạng thái (pending, processing, resolved, closed)
- `search` (string, optional): Tìm kiếm theo tên, email hoặc chủ đề
- `from_date` (date, optional): Từ ngày (format: YYYY-MM-DD)
- `to_date` (date, optional): Đến ngày (format: YYYY-MM-DD)
- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số liên hệ mỗi trang (mặc định: 10)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "phone": "0123456789",
        "subject": "Hỏi về sản phẩm",
        "message": "Xin chào, tôi muốn hỏi về sản phẩm balo Nike...",
        "status": "pending",
        "priority": "normal",
        "assigned_to": null,
        "replied_at": null,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      },
      {
        "id": 2,
        "name": "Trần Thị B",
        "email": "customer@example.com",
        "phone": "0987654321",
        "subject": "Khiếu nại về đơn hàng",
        "message": "Tôi có vấn đề với đơn hàng #ORD-2024-001...",
        "status": "processing",
        "priority": "high",
        "assigned_to": {
          "id": 1,
          "name": "Admin",
          "email": "admin@example.com"
        },
        "replied_at": null,
        "created_at": "2024-01-01T08:00:00.000000Z",
        "updated_at": "2024-01-01T09:00:00.000000Z"
      }
    ],
    "first_page_url": "http://example.com/api/dashboard/contacts?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://example.com/api/dashboard/contacts?page=5",
    "next_page_url": "http://example.com/api/dashboard/contacts?page=2",
    "path": "http://example.com/api/dashboard/contacts",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 45
  },
  "message": "Lấy danh sách liên hệ thành công"
}
```

## Lấy chi tiết liên hệ (Admin)

### GET /api/dashboard/contacts/{id}

**Mô tả**: Lấy chi tiết một liên hệ

**Phương thức**: GET

**URL**: `/api/dashboard/contacts/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID liên hệ

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "subject": "Hỏi về sản phẩm",
    "message": "Xin chào, tôi muốn hỏi về sản phẩm balo Nike...",
    "status": "pending",
    "priority": "normal",
    "assigned_to": null,
    "replied_at": null,
    "replies": [],
    "attachments": [],
    "notes": [
      {
        "id": 1,
        "content": "Khách hàng hỏi về sản phẩm balo Nike",
        "admin": {
          "id": 1,
          "name": "Admin",
          "email": "admin@example.com"
        },
        "created_at": "2024-01-01T10:00:00.000000Z"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Lấy chi tiết liên hệ thành công"
}
```

## Cập nhật trạng thái liên hệ

### PUT /api/dashboard/contacts/{id}/status

**Mô tả**: Cập nhật trạng thái liên hệ

**Phương thức**: PUT

**URL**: `/api/dashboard/contacts/{id}/status`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `id` (integer, required): ID liên hệ

**Body**:

```json
{
  "status": "processing",
  "priority": "high",
  "assigned_to": 1,
  "note": "Chuyển trạng thái sang xử lý"
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "processing",
    "priority": "high",
    "assigned_to": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com"
    },
    "updated_at": "2024-01-01T12:00:00.000000Z"
  },
  "message": "Cập nhật trạng thái liên hệ thành công"
}
```

**Validation rules**:

- `status` (string, required): Trạng thái mới (pending, processing, resolved, closed)
- `priority` (string, optional): Độ ưu tiên (low, normal, high, urgent)
- `assigned_to` (integer, optional): ID admin được phân công
- `note` (string, optional): Ghi chú về việc cập nhật

## Trả lời liên hệ

### POST /api/dashboard/contacts/{id}/reply

**Mô tả**: Trả lời liên hệ của khách hàng

**Phương thức**: POST

**URL**: `/api/dashboard/contacts/{id}/reply`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `id` (integer, required): ID liên hệ

**Body**:

```json
{
  "message": "Xin chào, cảm ơn bạn đã liên hệ với chúng tôi...",
  "send_email": true
}
```

**Response thành công (201)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "contact_id": 1,
    "message": "Xin chào, cảm ơn bạn đã liên hệ với chúng tôi...",
    "admin": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com"
    },
    "created_at": "2024-01-01T12:00:00.000000Z"
  },
  "message": "Trả lời liên hệ thành công"
}
```

**Validation rules**:

- `message` (string, required): Nội dung trả lời
- `send_email` (boolean, optional): Gửi email thông báo cho khách hàng (mặc định: true)

## Thống kê liên hệ (Admin)

### GET /api/dashboard/contacts/statistics

**Mô tả**: Lấy thống kê liên hệ cho admin

**Phương thức**: GET

**URL**: `/api/dashboard/contacts/statistics`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `period` (string, optional): Khoảng thời gian (today, week, month, year)
- `from_date` (date, optional): Từ ngày (format: YYYY-MM-DD)
- `to_date` (date, optional): Đến ngày (format: YYYY-MM-DD)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "total_contacts": 45,
    "pending_contacts": 12,
    "processing_contacts": 8,
    "resolved_contacts": 20,
    "closed_contacts": 5,
    "contacts_by_priority": {
      "low": 5,
      "normal": 25,
      "high": 10,
      "urgent": 5
    },
    "average_response_time": 2.5,
    "contacts_today": 3,
    "contacts_this_week": 15,
    "contacts_this_month": 45,
    "top_subjects": [
      {
        "subject": "Hỏi về sản phẩm",
        "count": 15
      },
      {
        "subject": "Khiếu nại về đơn hàng",
        "count": 10
      }
    ],
    "response_trend": [
      {
        "date": "2024-01-01",
        "new_contacts": 5,
        "resolved_contacts": 3
      }
    ]
  },
  "message": "Lấy thống kê liên hệ thành công"
}
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin
- Admin có thể xem và quản lý tất cả liên hệ trong hệ thống
- Có thể lọc và tìm kiếm liên hệ theo nhiều tiêu chí
- Khi trả lời liên hệ, hệ thống có thể tự động gửi email cho khách hàng
- Trạng thái liên hệ: pending, processing, resolved, closed
- Độ ưu tiên: low, normal, high, urgent
- Thống kê cung cấp cái nhìn tổng quan về tình hình liên hệ
