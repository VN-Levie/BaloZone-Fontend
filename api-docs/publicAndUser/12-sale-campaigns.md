# 12. Chiến dịch khuyến mãi (Sale Campaigns)

## Lấy danh sách chiến dịch khuyến mãi

### GET /api/sale-campaigns

**Mô tả**: Lấy danh sách tất cả chiến dịch khuyến mãi đang hoạt động

**Phương thức**: GET

**URL**: `/api/sale-campaigns`

**Phân quyền**: Không yêu cầu authentication

**Tham số query**:

- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số chiến dịch mỗi trang (mặc định: 10)
- `active_only` (boolean, optional): Chỉ lấy chiến dịch đang hoạt động (mặc định: true)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Flash Sale Cuối Tuần",
        "description": "Giảm giá 50% cho tất cả sản phẩm balo",
        "discount_percentage": 50,
        "start_date": "2024-01-01T00:00:00.000000Z",
        "end_date": "2024-01-07T23:59:59.000000Z",
        "banner_image": "https://example.com/flash-sale-banner.jpg",
        "is_active": true,
        "products_count": 25,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "first_page_url": "http://example.com/api/sale-campaigns?page=1",
    "from": 1,
    "last_page": 3,
    "last_page_url": "http://example.com/api/sale-campaigns?page=3",
    "next_page_url": "http://example.com/api/sale-campaigns?page=2",
    "path": "http://example.com/api/sale-campaigns",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 25
  },
  "message": "Lấy danh sách chiến dịch khuyến mãi thành công"
}
```

## Lấy chi tiết chiến dịch khuyến mãi

### GET /api/sale-campaigns/{id}

**Mô tả**: Lấy chi tiết một chiến dịch khuyến mãi

**Phương thức**: GET

**URL**: `/api/sale-campaigns/{id}`

**Phân quyền**: Không yêu cầu authentication

**Tham số URL**:

- `id` (integer, required): ID chiến dịch khuyến mãi

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Flash Sale Cuối Tuần",
    "description": "Giảm giá 50% cho tất cả sản phẩm balo trong tuần này. Cơ hội tốt nhất để sở hữu những sản phẩm yêu thích với giá ưu đãi.",
    "discount_percentage": 50,
    "start_date": "2024-01-01T00:00:00.000000Z",
    "end_date": "2024-01-07T23:59:59.000000Z",
    "banner_image": "https://example.com/flash-sale-banner.jpg",
    "gallery": [
      "https://example.com/sale-1.jpg",
      "https://example.com/sale-2.jpg"
    ],
    "terms_and_conditions": "Điều khoản và điều kiện áp dụng...",
    "is_active": true,
    "products_count": 25,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Lấy chi tiết chiến dịch khuyến mãi thành công"
}
```

**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "Chiến dịch khuyến mãi không tồn tại"
}
```

## Lấy sản phẩm của chiến dịch khuyến mãi

### GET /api/sale-campaigns/{id}/products

**Mô tả**: Lấy danh sách sản phẩm áp dụng cho chiến dịch khuyến mãi

**Phương thức**: GET

**URL**: `/api/sale-campaigns/{id}/products`

**Phân quyền**: Không yêu cầu authentication

**Tham số URL**:

- `id` (integer, required): ID chiến dịch khuyến mãi

**Tham số query**:

- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số sản phẩm mỗi trang (mặc định: 10)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Balo Nike Air Max",
        "slug": "balo-nike-air-max",
        "description": "Balo thể thao Nike Air Max với thiết kế hiện đại",
        "price": 1200000,
        "discount_price": 600000,
        "sale_price": 600000,
        "discount_percentage": 50,
        "image": "https://example.com/nike-backpack.jpg",
        "stock": 50,
        "brand": {
          "id": 1,
          "name": "Nike",
          "slug": "nike"
        },
        "category": {
          "id": 1,
          "name": "Balo",
          "slug": "balo"
        },
        "sale_campaign": {
          "id": 1,
          "name": "Flash Sale Cuối Tuần",
          "discount_percentage": 50,
          "start_date": "2024-01-01T00:00:00.000000Z",
          "end_date": "2024-01-07T23:59:59.000000Z"
        },
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "first_page_url": "http://example.com/api/sale-campaigns/1/products?page=1",
    "from": 1,
    "last_page": 3,
    "last_page_url": "http://example.com/api/sale-campaigns/1/products?page=3",
    "next_page_url": "http://example.com/api/sale-campaigns/1/products?page=2",
    "path": "http://example.com/api/sale-campaigns/1/products",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 25
  },
  "message": "Lấy sản phẩm chiến dịch khuyến mãi thành công"
}
```

## Quản lý sản phẩm chiến dịch khuyến mãi (Admin)

### POST /api/sale-campaigns/{saleCampaign}/products/{product}

**Mô tả**: Thêm sản phẩm vào chiến dịch khuyến mãi

**Phương thức**: POST

**URL**: `/api/sale-campaigns/{saleCampaign}/products/{product}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `saleCampaign` (integer, required): ID chiến dịch khuyến mãi
- `product` (integer, required): ID sản phẩm

**Response thành công (201)**:

```json
{
  "success": true,
  "message": "Thêm sản phẩm vào chiến dịch khuyến mãi thành công"
}
```

**Response lỗi (403)**:

```json
{
  "success": false,
  "message": "Bạn không có quyền thực hiện thao tác này"
}
```

**Response lỗi (409)**:

```json
{
  "success": false,
  "message": "Sản phẩm đã tồn tại trong chiến dịch khuyến mãi"
}
```

### DELETE /api/sale-campaigns/{saleCampaign}/products/{product}

**Mô tả**: Xóa sản phẩm khỏi chiến dịch khuyến mãi

**Phương thức**: DELETE

**URL**: `/api/sale-campaigns/{saleCampaign}/products/{product}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `saleCampaign` (integer, required): ID chiến dịch khuyến mãi
- `product` (integer, required): ID sản phẩm

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Xóa sản phẩm khỏi chiến dịch khuyến mãi thành công"
}
```

**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "Sản phẩm không tồn tại trong chiến dịch khuyến mãi"
}
```

**Lưu ý**:

- Các endpoint public không cần authentication
- Chỉ trả về chiến dịch đang hoạt động (trong thời gian hiệu lực)
- Giá sale được tính tự động từ giá gốc và % giảm giá
- Sản phẩm có thể tham gia nhiều chiến dịch khuyến mãi
- Admin có thể quản lý sản phẩm trong chiến dịch khuyến mãi
- Gallery có thể là array rỗng nếu không có ảnh phụ
