# 9. Đơn hàng (Orders)

## Lấy danh sách đơn hàng

### GET /api/orders

**Mô tả**: Lấy danh sách đơn hàng của người dùng

**Phương thức**: GET

**URL**: `/api/orders`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `status` (string, optional): Lọc theo trạng thái đơn hàng
- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số đơn hàng mỗi trang (mặc định: 10)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "order_number": "ORD-2024-001",
        "status": "pending",
        "total_amount": 1200000,
        "shipping_fee": 50000,
        "voucher_discount": 120000,
        "final_amount": 1130000,
        "payment_method": "cod",
        "payment_status": "pending",
        "shipping_address": {
          "recipient_name": "Nguyễn Văn A",
          "recipient_phone": "0123456789",
          "address": "123 Đường ABC, Phường XYZ",
          "ward": "Phường 1",
          "district": "Quận 1",
          "province": "TP. Hồ Chí Minh"
        },
        "items": [
          {
            "id": 1,
            "product_id": 1,
            "product_name": "Balo Nike Air Max",
            "product_image": "https://example.com/nike-backpack.jpg",
            "quantity": 1,
            "price": 1200000,
            "total": 1200000
          }
        ],
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "first_page_url": "http://example.com/api/orders?page=1",
    "from": 1,
    "last_page": 2,
    "last_page_url": "http://example.com/api/orders?page=2",
    "next_page_url": "http://example.com/api/orders?page=2",
    "path": "http://example.com/api/orders",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 15
  },
  "message": "Lấy danh sách đơn hàng thành công"
}
```

## Lấy chi tiết đơn hàng

### GET /api/orders/{id}

**Mô tả**: Lấy chi tiết một đơn hàng

**Phương thức**: GET

**URL**: `/api/orders/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID đơn hàng

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-2024-001",
    "status": "pending",
    "total_amount": 1200000,
    "shipping_fee": 50000,
    "voucher_discount": 120000,
    "final_amount": 1130000,
    "payment_method": "cod",
    "payment_status": "pending",
    "shipping_address": {
      "recipient_name": "Nguyễn Văn A",
      "recipient_phone": "0123456789",
      "address": "123 Đường ABC, Phường XYZ",
      "ward": "Phường 1",
      "district": "Quận 1",
      "province": "TP. Hồ Chí Minh"
    },
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Balo Nike Air Max",
        "product_image": "https://example.com/nike-backpack.jpg",
        "quantity": 1,
        "price": 1200000,
        "total": 1200000
      }
    ],
    "order_history": [
      {
        "status": "pending",
        "note": "Đơn hàng đã được tạo",
        "created_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Lấy chi tiết đơn hàng thành công"
}
```

## Tạo đơn hàng

### POST /api/orders

**Mô tả**: Tạo đơn hàng mới

**Phương thức**: POST

**URL**: `/api/orders`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ],
  "shipping_address_id": 1,
  "payment_method": "cod",
  "voucher_code": "SUMMER2024",
  "note": "Ghi chú đơn hàng"
}
```

**Response thành công (201)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-2024-001",
    "status": "pending",
    "total_amount": 1200000,
    "shipping_fee": 50000,
    "voucher_discount": 120000,
    "final_amount": 1130000,
    "payment_method": "cod",
    "payment_status": "pending",
    "shipping_address": {
      "recipient_name": "Nguyễn Văn A",
      "recipient_phone": "0123456789",
      "address": "123 Đường ABC, Phường XYZ",
      "ward": "Phường 1",
      "district": "Quận 1",
      "province": "TP. Hồ Chí Minh"
    },
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Balo Nike Air Max",
        "product_image": "https://example.com/nike-backpack.jpg",
        "quantity": 2,
        "price": 600000,
        "total": 1200000
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Tạo đơn hàng thành công"
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "items": ["Danh sách sản phẩm là bắt buộc"],
    "items.0.product_id": ["Sản phẩm không tồn tại"],
    "items.0.quantity": ["Số lượng phải lớn hơn 0"],
    "shipping_address_id": ["Địa chỉ giao hàng không tồn tại"],
    "payment_method": ["Phương thức thanh toán không hợp lệ"],
    "voucher_code": ["Mã voucher không hợp lệ"]
  }
}
```

**Validation rules**:

- `items` (array, required): Danh sách sản phẩm
  - `product_id` (integer, required): ID sản phẩm
  - `quantity` (integer, required): Số lượng (> 0)
- `shipping_address_id` (integer, required): ID địa chỉ giao hàng
- `payment_method` (string, required): Phương thức thanh toán (cod, vnpay, momo)
- `voucher_code` (string, optional): Mã voucher
- `note` (string, optional): Ghi chú đơn hàng

## Hủy đơn hàng

### POST /api/orders/{id}/cancel

**Mô tả**: Hủy đơn hàng (chỉ được phép hủy khi đơn hàng ở trạng thái pending)

**Phương thức**: POST

**URL**: `/api/orders/{id}/cancel`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `id` (integer, required): ID đơn hàng

**Body**:

```json
{
  "reason": "Thay đổi ý định mua hàng"
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Hủy đơn hàng thành công"
}
```

**Response lỗi (400)**:

```json
{
  "success": false,
  "message": "Không thể hủy đơn hàng ở trạng thái hiện tại"
}
```

**Validation rules**:

- `reason` (string, required): Lý do hủy đơn hàng

## Thống kê đơn hàng

### GET /api/orders-stats

**Mô tả**: Lấy thống kê đơn hàng của người dùng

**Phương thức**: GET

**URL**: `/api/orders-stats`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "total_orders": 15,
    "pending_orders": 3,
    "processing_orders": 5,
    "shipped_orders": 2,
    "delivered_orders": 4,
    "cancelled_orders": 1,
    "total_spent": 12500000,
    "average_order_value": 833333
  },
  "message": "Lấy thống kê đơn hàng thành công"
}
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication
- Người dùng chỉ có thể xem đơn hàng của chính mình
- Trạng thái đơn hàng: pending, processing, shipped, delivered, cancelled
- Phương thức thanh toán: cod (COD), vnpay (VNPay), momo (MoMo)
- Chỉ có thể hủy đơn hàng khi ở trạng thái "pending"
- Voucher sẽ được áp dụng tự động khi tạo đơn hàng nếu hợp lệ
