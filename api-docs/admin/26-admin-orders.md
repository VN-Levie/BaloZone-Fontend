# 26. Quản lý đơn hàng (Admin Orders)

> **Lưu ý**: Các endpoint quản lý đơn hàng sử dụng `/api/dashboard/orders/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý đơn hàng

## Lấy danh sách đơn hàng (Admin)

### GET /api/dashboard/orders

**Mô tả**: Lấy danh sách tất cả đơn hàng trong hệ thống

**Phương thức**: GET

**URL**: `/api/dashboard/orders`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `status` (string, optional): Lọc theo trạng thái (pending, confirmed, shipping, delivered, cancelled)
- `payment_status` (string, optional): Lọc theo trạng thái thanh toán (pending, paid, failed, refunded)
- `user_id` (integer, optional): Lọc theo user ID
- `date_from` (date, optional): Lọc từ ngày (Y-m-d)
- `date_to` (date, optional): Lọc đến ngày (Y-m-d)
- `search` (string, optional): Tìm kiếm theo mã đơn hàng hoặc tên khách hàng
- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số đơn hàng mỗi trang (mặc định: 15)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "order_code": "ORD-20250101-001",
        "user": {
          "id": 2,
          "name": "Nguyễn Văn A",
          "email": "customer@example.com",
          "phone": "0123456789"
        },
        "total_amount": 2500000,
        "discount_amount": 250000,
        "final_amount": 2250000,
        "status": "confirmed",
        "payment_status": "paid",
        "payment_method": "momo",
        "shipping_address": {
          "name": "Nguyễn Văn A",
          "phone": "0123456789",
          "address": "123 Đường ABC, Phường XYZ",
          "ward": "Phường 1",
          "district": "Quận 1",
          "province": "TP. Hồ Chí Minh"
        },
        "items_count": 3,
        "order_items": [
          {
            "id": 1,
            "product": {
              "id": 1,
              "name": "Túi xách da cao cấp",
              "image": "https://example.com/images/tui-xach-1.jpg"
            },
            "quantity": 1,
            "price": 1200000,
            "discount": 120000,
            "total": 1080000
          }
        ],
        "notes": "Giao hàng trong giờ hành chính",
        "created_at": "2025-01-01T10:00:00.000000Z",
        "updated_at": "2025-01-01T14:00:00.000000Z"
      }
    ],
    "first_page_url": "http://example.com/api/dashboard/orders?page=1",
    "from": 1,
    "last_page": 10,
    "last_page_url": "http://example.com/api/dashboard/orders?page=10",
    "next_page_url": "http://example.com/api/dashboard/orders?page=2",
    "path": "http://example.com/api/dashboard/orders",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 145
  },
  "message": "Orders retrieved successfully"
}
```

## Cập nhật trạng thái đơn hàng (Admin)

### PUT /api/dashboard/orders/{order}/status

**Mô tả**: Cập nhật trạng thái đơn hàng

**Phương thức**: PUT

**URL**: `/api/dashboard/orders/{order}/status`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `order` (integer, required): ID đơn hàng

**Body**:

```json
{
  "status": "shipping",
  "payment_status": "paid",
  "tracking_number": "VN123456789",
  "notes": "Đơn hàng đã được giao cho đơn vị vận chuyển"
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "order_code": "ORD-20250101-001",
    "user": {
      "id": 2,
      "name": "Nguyễn Văn A",
      "email": "customer@example.com",
      "phone": "0123456789"
    },
    "total_amount": 2500000,
    "discount_amount": 250000,
    "final_amount": 2250000,
    "status": "shipping",
    "payment_status": "paid",
    "payment_method": "momo",
    "tracking_number": "VN123456789",
    "shipping_address": {
      "name": "Nguyễn Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC, Phường XYZ",
      "ward": "Phường 1",
      "district": "Quận 1",
      "province": "TP. Hồ Chí Minh"
    },
    "status_history": [
      {
        "status": "pending",
        "changed_at": "2025-01-01T10:00:00.000000Z",
        "changed_by": "customer"
      },
      {
        "status": "confirmed",
        "changed_at": "2025-01-01T14:00:00.000000Z",
        "changed_by": "admin"
      },
      {
        "status": "shipping",
        "changed_at": "2025-01-02T09:00:00.000000Z",
        "changed_by": "admin"
      }
    ],
    "notes": "Đơn hàng đã được giao cho đơn vị vận chuyển",
    "created_at": "2025-01-01T10:00:00.000000Z",
    "updated_at": "2025-01-02T09:00:00.000000Z"
  }
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "status": ["The selected status is invalid."],
    "payment_status": ["The selected payment status is invalid."]
  }
}
```

**Response lỗi (400) - Trạng thái không hợp lệ**:

```json
{
  "success": false,
  "message": "Cannot change status from delivered to shipping"
}
```

**Validation rules**:

- `status` (string, required): Trạng thái đơn hàng (pending, confirmed, shipping, delivered, cancelled)
- `payment_status` (string, optional): Trạng thái thanh toán (pending, paid, failed, refunded)
- `tracking_number` (string, optional): Mã vận đơn
- `notes` (string, optional): Ghi chú thêm

## Quy tắc thay đổi trạng thái

### Luồng trạng thái hợp lệ:

```
pending → confirmed → shipping → delivered
   ↓           ↓          ↓
cancelled   cancelled  cancelled
```

### Trạng thái đơn hàng:

- **pending**: Chờ xác nhận
- **confirmed**: Đã xác nhận
- **shipping**: Đang giao hàng
- **delivered**: Đã giao hàng
- **cancelled**: Đã hủy

### Trạng thái thanh toán:

- **pending**: Chờ thanh toán
- **paid**: Đã thanh toán
- **failed**: Thanh toán thất bại
- **refunded**: Đã hoàn tiền

## Ví dụ sử dụng curl

### Lấy danh sách đơn hàng

```bash
curl -X GET "http://localhost:8000/api/dashboard/orders?status=pending&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Lấy đơn hàng theo trạng thái thanh toán

```bash
curl -X GET "http://localhost:8000/api/dashboard/orders?payment_status=paid&date_from=2025-01-01&date_to=2025-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Tìm kiếm đơn hàng

```bash
curl -X GET "http://localhost:8000/api/dashboard/orders?search=ORD-20250101" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Xác nhận đơn hàng

```bash
curl -X PUT http://localhost:8000/api/dashboard/orders/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "payment_status": "paid",
    "notes": "Đơn hàng đã được xác nhận và bắt đầu chuẩn bị"
  }'
```

### Cập nhật trạng thái giao hàng

```bash
curl -X PUT http://localhost:8000/api/dashboard/orders/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipping",
    "tracking_number": "GHN123456789",
    "notes": "Đơn hàng đã được giao cho GHN"
  }'
```

### Hoàn thành đơn hàng

```bash
curl -X PUT http://localhost:8000/api/dashboard/orders/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "delivered",
    "notes": "Khách hàng đã nhận hàng thành công"
  }'
```

### Hủy đơn hàng

```bash
curl -X PUT http://localhost:8000/api/dashboard/orders/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled",
    "payment_status": "refunded",
    "notes": "Hủy đơn theo yêu cầu khách hàng và hoàn tiền"
  }'
```

## Thống kê đơn hàng

### Thống kê nhanh theo trạng thái:

```bash
curl -X GET "http://localhost:8000/api/dashboard/orders?per_page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" | jq '.data.total'
```

### Thống kê doanh thu theo ngày:

```bash
curl -X GET "http://localhost:8000/api/dashboard/orders?date_from=2025-01-01&date_to=2025-01-01&status=delivered" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin hoặc contributor
- Trạng thái đơn hàng có quy tắc chuyển đổi nghiêm ngặt
- Không thể chuyển ngược trạng thái (ví dụ: từ delivered về shipping)
- Khi hủy đơn hàng, cần cân nhắc hoàn tiền nếu đã thanh toán
- Mã vận đơn chỉ cần thiết khi chuyển sang trạng thái shipping
- Hệ thống tự động lưu lịch sử thay đổi trạng thái
- Có thể lọc và tìm kiếm đơn hàng theo nhiều tiêu chí
