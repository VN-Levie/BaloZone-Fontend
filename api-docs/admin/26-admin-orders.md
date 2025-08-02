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

- `status` (string, optional): Lọc theo trạng thái (pending, processing, shipped, delivered, cancelled)
- `payment_status` (string, optional): Lọc theo trạng thái thanh toán (pending, paid, failed)
- `user_id` (integer, optional): Lọc theo user ID
- `date_from` (date, optional): Lọc từ ngày (Y-m-d)
- `date_to` (date, optional): Lọc đến ngày (Y-m-d)
- `search` (string, optional): Tìm kiếm theo mã đơn hàng hoặc tên khách hàng
- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số đơn hàng mỗi trang (mặc định: 15)

**Response thành công (200)**:

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-2025-000001",
      "status": "pending",
      "total_amount": "10311375.00",
      "shipping_fee": "43102.00",
      "voucher_discount": "0.00",
      "final_amount": "10354477.00",
      "payment_method": {
        "id": 5,
        "name": "vnpay",
        "status": "active",
        "display_name": "VNPay"
      },
      "note": null,
      "payment_status": "pending",
      "voucher_id": null,
      "user_id": 7,
      "user": {
        "id": 7,
        "name": "Phạm Thị Dung",
        "email": "dung.pham@gmail.com",
        "phone": "0945678901",
        "status": "active"
      },
      "voucher": null,
      "order_details": [
        {
          "id": 1,
          "product_id": 21,
          "quantity": 3,
          "price": "265468.00",
          "product": {
            "id": 21,
            "name": "Balo Nike Sportswear natus",
            "image": "https://placehold.co/600x400?text=products/balo-nike-sportswear-natus.jpg",
            "slug": "balo-nike-sportswear-natus-9612",
            "color": "Đỏ"
          }
        }
      ],
      "created_at": "2025-08-02T19:37:55.000000Z",
      "updated_at": "2025-08-02T19:39:08.000000Z"
    }
  ],
  "first_page_url": "http://localhost:8000/api/dashboard/orders?page=1",
  "from": 1,
  "last_page": 2,
  "last_page_url": "http://localhost:8000/api/dashboard/orders?page=2",
  "next_page_url": "http://localhost:8000/api/dashboard/orders?page=2",
  "path": "http://localhost:8000/api/dashboard/orders",
  "per_page": 20,
  "prev_page_url": null,
  "to": 20,
  "total": 33
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
  "status": "shipped",
  "payment_status": "paid",
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

- `status` (string, optional): Trạng thái đơn hàng (pending, processing, shipped, delivered, cancelled)
- `payment_status` (string, optional): Trạng thái thanh toán (pending, paid, failed)
- `tracking_number` (string, optional): Mã vận đơn
- `notes` (string, optional): Ghi chú thêm

## Quy tắc thay đổi trạng thái

### Luồng trạng thái hợp lệ:

```
pending → processing → shipped → delivered
   ↓           ↓          ↓
cancelled   cancelled  cancelled
```

### Trạng thái đơn hàng:

- **pending**: Chờ xử lý
- **processing**: Đang xử lý
- **shipped**: Đã giao hàng
- **delivered**: Đã hoàn thành
- **cancelled**: Đã hủy

### Trạng thái thanh toán:

- **pending**: Chờ thanh toán
- **paid**: Đã thanh toán
- **failed**: Thanh toán thất bại

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

### Xử lý đơn hàng

```bash
curl -X PUT http://localhost:8000/api/dashboard/orders/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing",
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
    "status": "shipped",
    "notes": "Đơn hàng đã được giao cho đơn vị vận chuyển"
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
- Trạng thái đơn hàng theo database: `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- Trạng thái thanh toán theo database: `pending`, `paid`, `failed`
- Các trường trong validation là `optional` (không bắt buộc) để cho phép cập nhật từng phần
- Khi hủy đơn hàng, cần cân nhắc hoàn tiền nếu đã thanh toán
- Hệ thống không lưu lịch sử thay đổi trạng thái (chưa implement)
- Có thể lọc và tìm kiếm đơn hàng theo nhiều tiêu chí
- Response trả về trực tiếp pagination data, không có wrapper `success` và `message`
