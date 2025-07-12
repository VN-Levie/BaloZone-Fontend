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
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "Black Friday 2025",
      "slug": "black-friday-2025",
      "description": "Siêu sale Black Friday - Giảm giá khủng lên đến 70% tất cả sản phẩm balo",
      "banner_image": "https://placehold.co/600x400?text=campaigns/black-friday-2025.jpg",
      "start_date": "2025-07-13T17:24:39.000000Z",
      "end_date": "2025-07-19T17:24:39.000000Z",
      "status": "active",
      "is_featured": true,
      "priority": 100,
      "metadata": {
        "tags": ["black-friday", "mega-sale", "limited-time"],
        "color": "#000000",
        "description_short": "Giảm giá lên đến 70%"
      },
      "created_at": "2025-07-12T17:24:39.000000Z",
      "updated_at": "2025-07-12T17:24:39.000000Z",
      "deleted_at": null,
      "sale_products": [
        {
          "id": 1,
          "sale_campaign_id": 1,
          "product_id": 2,
          "original_price": "1200000.00",
          "sale_price": "696000.00",
          "discount_percentage": "42.00",
          "discount_amount": "504000.00",
          "discount_type": "percentage",
          "start_date": null,
          "end_date": null,
          "max_quantity": 28,
          "sold_quantity": 1,
          "is_active": true,
          "product": {
            "id": 2,
            "name": "Balo Nike Heritage 2.0",
            "slug": "balo-nike-heritage-20",
            "price": "1200000.00",
            "stock": 30,
            "image": "https://placehold.co/600x400?text=products/balo-nike-heritage-20.jpg"
          }
        }
      ]
    },
    {
      "id": 2,
      "name": "Flash Sale Cuối Tuần",
      "slug": "flash-sale-weekend",
      "description": "Flash sale cuối tuần - Cơ hội vàng săn balo giá rẻ",
      "banner_image": "https://placehold.co/600x400?text=campaigns/flash-sale-weekend.jpg",
      "start_date": "2025-07-12T17:24:39.000000Z",
      "end_date": "2025-07-15T17:24:39.000000Z",
      "status": "active",
      "is_featured": true,
      "priority": 90,
      "metadata": {
        "tags": ["flash-sale", "weekend", "quick-sale"],
        "color": "#ff6b35",
        "description_short": "Giảm ngay 50%"
      }
    }
  ],
  "first_page_url": "http://localhost:8000/api/sale-campaigns?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/sale-campaigns?page=1",
  "next_page_url": null,
  "path": "http://localhost:8000/api/sale-campaigns",
  "per_page": 10,
  "prev_page_url": null,
  "to": 4,
  "total": 4
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
  "data": {
    "id": 1,
    "name": "Black Friday 2025",
    "slug": "black-friday-2025",
    "description": "Siêu sale Black Friday - Giảm giá khủng lên đến 70% tất cả sản phẩm balo",
    "banner_image": "https://placehold.co/600x400?text=campaigns/black-friday-2025.jpg",
    "start_date": "2025-07-13T17:24:39.000000Z",
    "end_date": "2025-07-19T17:24:39.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": 100,
    "metadata": {
      "tags": ["black-friday", "mega-sale", "limited-time"],
      "color": "#000000",
      "description_short": "Giảm giá lên đến 70%"
    },
    "created_at": "2025-07-12T17:24:39.000000Z",
    "updated_at": "2025-07-12T17:24:39.000000Z",
    "deleted_at": null,
    "sale_products": [
      {
        "id": 1,
        "sale_campaign_id": 1,
        "product_id": 2,
        "original_price": "1200000.00",
        "sale_price": "696000.00",
        "discount_percentage": "42.00",
        "discount_amount": "504000.00",
        "discount_type": "percentage",
        "max_quantity": 28,
        "sold_quantity": 1,
        "is_active": true,
        "product": {
          "id": 2,
          "name": "Balo Nike Heritage 2.0",
          "slug": "balo-nike-heritage-20",
          "price": "1200000.00",
          "stock": 30,
          "image": "https://placehold.co/600x400?text=products/balo-nike-heritage-20.jpg",
          "category": {
            "id": 1,
            "name": "Balo Học Sinh",
            "slug": "balo-hoc-sinh"
          },
          "brand": {
            "id": 1,
            "name": "Nike",
            "slug": "nike"
          }
        }
      }
    ]
  }
}
```

**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "Endpoint không tồn tại",
  "data": null
}
```

## Lấy chi tiết chiến dịch khuyến mãi theo slug

### GET /api/sale-campaigns/slug/{slug}

**Mô tả**: Lấy chi tiết một chiến dịch khuyến mãi theo slug

**Phương thức**: GET

**URL**: `/api/sale-campaigns/slug/{slug}`

**Phân quyền**: Không yêu cầu authentication

**Tham số URL**:

- `slug` (string, required): Slug của chiến dịch khuyến mãi

**Response thành công (200)**:

```json
{
  "data": {
    "id": 1,
    "name": "Black Friday 2025",
    "slug": "black-friday-2025",
    "description": "Siêu sale Black Friday - Giảm giá khủng lên đến 70% tất cả sản phẩm balo",
    "banner_image": "https://placehold.co/600x400?text=campaigns/black-friday-2025.jpg",
    "start_date": "2025-07-13T17:24:39.000000Z",
    "end_date": "2025-07-19T17:24:39.000000Z",
    "status": "active",
    "is_featured": true,
    "priority": 100,
    "metadata": {
      "tags": ["black-friday", "mega-sale", "limited-time"],
      "color": "#000000",
      "description_short": "Giảm giá lên đến 70%"
    },
    "created_at": "2025-07-12T17:24:39.000000Z",
    "updated_at": "2025-07-12T17:24:39.000000Z",
    "deleted_at": null,
    "sale_products": [
      {
        "id": 1,
        "sale_campaign_id": 1,
        "product_id": 2,
        "original_price": "1200000.00",
        "sale_price": "696000.00",
        "discount_percentage": "42.00",
        "discount_amount": "504000.00",
        "discount_type": "percentage",
        "max_quantity": 28,
        "sold_quantity": 1,
        "is_active": true,
        "product": {
          "id": 2,
          "name": "Balo Nike Heritage 2.0",
          "slug": "balo-nike-heritage-20",
          "price": "1200000.00",
          "stock": 30,
          "image": "https://placehold.co/600x400?text=products/balo-nike-heritage-20.jpg",
          "category": {
            "id": 1,
            "name": "Balo Học Sinh",
            "slug": "balo-hoc-sinh"
          },
          "brand": {
            "id": 1,
            "name": "Nike",
            "slug": "nike"
          }
        }
      }
    ]
  }
}
```

**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "Endpoint không tồn tại", 
  "data": null
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
  "current_page": 1,
  "data": [
    {
      "id": 8,
      "category_id": 2,
      "brand_id": 15,
      "name": "Balo Gaming RGB voluptatem",
      "description": "Ut distinctio voluptas dolores. Et consectetur perspiciatis ducimus fugit ipsa veritatis veritatis.",
      "price": "1936829.00",
      "discount_price": null,
      "stock": 62,
      "image": "https://placehold.co/600x400?text=products/balo-gaming-rgb-voluptatem.jpg",
      "gallery": null,
      "slug": "balo-gaming-rgb-voluptatem-3008",
      "color": "Tím",
      "created_at": "2025-07-12T17:24:37.000000Z",
      "updated_at": "2025-07-12T17:24:37.000000Z",
      "deleted_at": null,
      "category": {
        "id": 2,
        "name": "Balo Du Lịch",
        "slug": "balo-du-lich"
      },
      "brand": {
        "id": 15,
        "name": "Borer-Johns",
        "slug": "borer-johns"
      },
      "pivot": {
        "sale_campaign_id": 1,
        "product_id": 8,
        "original_price": "1936829.00",
        "sale_price": "987782.79",
        "discount_percentage": "49.00",
        "discount_amount": "949046.21",
        "discount_type": "percentage",
        "max_quantity": 16,
        "sold_quantity": 1,
        "is_active": 1
      }
    }
  ],
  "first_page_url": "http://localhost:8000/api/sale-campaigns/1/products?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/sale-campaigns/1/products?page=1",
  "next_page_url": null,
  "path": "http://localhost:8000/api/sale-campaigns/1/products",
  "per_page": 12,
  "prev_page_url": null,
  "to": 5,
  "total": 5
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
- Response structure khác với các API khác (không có success field ở cấp root)
- Danh sách chiến dịch bao gồm cả sale_products với thông tin chi tiết
- Sản phẩm trong chiến dịch có thông tin về giá gốc, giá sale, % giảm giá
- Admin có thể quản lý sản phẩm trong chiến dịch khuyến mãi
- Metadata chứa thông tin bổ sung như tags, color, description_short
- **Có thể lấy chiến dịch theo ID hoặc slug**:
  - `/api/sale-campaigns/{id}` - Lấy theo ID
  - `/api/sale-campaigns/slug/{slug}` - Lấy theo slug
- Route slug được đặt trước route ID để tránh xung đột routing

**Test với cURL**:

```bash
# Lấy danh sách tất cả chiến dịch khuyến mãi
curl -X GET "http://localhost:8000/api/sale-campaigns" \
  -H "Accept: application/json" | jq .

# Lấy chi tiết chiến dịch cụ thể
curl -X GET "http://localhost:8000/api/sale-campaigns/1" \
  -H "Accept: application/json" | jq .

# Lấy chi tiết chiến dịch theo slug  
curl -X GET "http://localhost:8000/api/sale-campaigns/slug/black-friday-2025" \
  -H "Accept: application/json" | jq .

# Lấy sản phẩm của chiến dịch khuyến mãi
curl -X GET "http://localhost:8000/api/sale-campaigns/1/products" \
  -H "Accept: application/json" | jq .

# Test với ID không tồn tại (lỗi 404)
curl -X GET "http://localhost:8000/api/sale-campaigns/999" \
  -H "Accept: application/json" | jq .

# Test với slug không tồn tại (lỗi 404)  
curl -X GET "http://localhost:8000/api/sale-campaigns/slug/invalid-slug" \
  -H "Accept: application/json" | jq .
```
