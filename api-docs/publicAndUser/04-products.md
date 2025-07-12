# API Products - Sản phẩm

Tài liệu này mô tả các API endpoint liên quan đến quản lý sản phẩm trong hệ thống BaloZone.

## 1. Lấy danh sách sản phẩm với filtering và search

### GET /api/products

**Mô tả**: Lấy danh sách sản phẩm với khả năng filtering, search và sorting tổng hợp

**Phương thức**: GET

**URL**: `/api/products`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Query Parameters** (tất cả optional):
- `search` (string): Tìm kiếm theo tên sản phẩm
- `category_id` (integer): Lọc theo ID category  
- `brand_id` (integer): Lọc theo ID thương hiệu
- `min_price` (integer): Giá tối thiểu
- `max_price` (integer): Giá tối đa
- `color` (string): Lọc theo màu sắc
- `in_stock` (boolean): Chỉ lấy sản phẩm còn hàng (true/false)
- `sort_by` (string): Sắp xếp theo trường (name, price, created_at)
- `sort_order` (string): Thứ tự sắp xếp (asc, desc)
- `page` (integer): Số trang (mặc định: 1)
- `per_page` (integer): Số items per page (mặc định: 10)

### Ví dụ 1: Lấy tất cả sản phẩm
**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Balo Nike Sportswear Heritage",
        "slug": "balo-nike-sportswear-heritage",
        "description": "Balo thời trang với thiết kế cổ điển từ Nike",
        "price": 1500000,
        "discount_price": 1200000,
        "image": "https://placehold.co/600x400?text=products/balo-nike-sportswear-heritage.jpg",
        "gallery": [
          "https://placehold.co/600x400?text=Nike-1.jpg",
          "https://placehold.co/600x400?text=Nike-2.jpg"
        ],
        "stock": 15,
        "brand": {
          "id": 1,
          "name": "Nike",
          "slug": "nike"
        },
        "category": {
          "id": 1,
          "name": "Balo Học Sinh",
          "slug": "balo-hoc-sinh"
        },
        "created_at": "2025-07-12T17:24:37.000000Z",
        "updated_at": "2025-07-12T17:24:37.000000Z"
      }
    ],
    "first_page_url": "http://localhost:8000/api/products?page=1",
    "from": 1,
    "last_page": 21,
    "last_page_url": "http://localhost:8000/api/products?page=21",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://localhost:8000/api/products?page=1",
        "label": "1",
        "active": true
      }
    ],
    "next_page_url": "http://localhost:8000/api/products?page=2",
    "path": "http://localhost:8000/api/products",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 205
  }
}
```

### Ví dụ 2: Tìm kiếm sản phẩm theo từ khóa
**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products?search=nike" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 49,
        "name": "Balo Thể Thao Nike Air suscipit",
        "slug": "balo-the-thao-nike-air-suscipit-8730",
        "description": "Suscipit dolore aut consequatur in et doloribus. Laborum vel corrupti aut incidunt ut. Nemo vitae atque quia nesciunt aperiam corrupti.",
        "price": 1937413,
        "discount_price": 0,
        "image": "https://placehold.co/600x400?text=products/balo-the-thao-nike-air-suscipit.jpg",
        "gallery": [
          "https://placehold.co/600x400?text=balo-the-thao-nike-air-suscipit-1.jpg",
          "https://placehold.co/600x400?text=balo-the-thao-nike-air-suscipit-2.jpg"
        ],
        "stock": 12,
        "brand": {
          "id": 1,
          "name": "Nike",
          "slug": "nike"
        },
        "category": {
          "id": 6,
          "name": "Balo Mini",
          "slug": "balo-mini"
        },
        "created_at": "2025-07-12T17:24:37.000000Z",
        "updated_at": "2025-07-12T17:24:37.000000Z"
      }
    ],
    "first_page_url": "http://localhost:8000/api/products?page=1",
    "from": 1,
    "last_page": 2,
    "last_page_url": "http://localhost:8000/api/products?page=2",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://localhost:8000/api/products?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": "http://localhost:8000/api/products?page=2",
        "label": "2",
        "active": false
      },
      {
        "url": "http://localhost:8000/api/products?page=2",
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": "http://localhost:8000/api/products?page=2",
    "path": "http://localhost:8000/api/products",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 15
  }
}
```

### Ví dụ 3: Lọc theo category và brand
**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products?category_id=1&brand_id=6" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 202,
        "name": "Balo Thể Thao Nike Air eum",
        "slug": "balo-the-thao-nike-air-eum-4873",
        "description": "Ducimus debitis quis odio in enim voluptatem. Ratione sunt accusamus fuga qui.",
        "price": 410858,
        "discount_price": 328686,
        "image": "https://placehold.co/600x400?text=products/balo-the-thao-nike-air-eum.jpg",
        "gallery": [],
        "stock": 77,
        "brand": {
          "id": 6,
          "name": "Herschel",
          "slug": "herschel"
        },
        "category": {
          "id": 1,
          "name": "Balo Học Sinh",
          "slug": "balo-hoc-sinh"
        },
        "created_at": "2025-07-12T17:24:38.000000Z",
        "updated_at": "2025-07-12T17:24:38.000000Z"
      },
      {
        "id": 58,
        "name": "Balo Du Lịch Samsonite eos",
        "slug": "balo-du-lich-samsonite-eos-8388",
        "description": "Sint est amet laborum. Dolores nihil dolor nesciunt quas itaque amet.",
        "price": 1640641,
        "discount_price": 0,
        "image": "https://placehold.co/600x400?text=products/balo-du-lich-samsonite-eos.jpg",
        "gallery": [
          "https://placehold.co/600x400?text=balo-du-lich-samsonite-eos-1.jpg",
          "https://placehold.co/600x400?text=balo-du-lich-samsonite-eos-2.jpg"
        ],
        "stock": 49,
        "brand": {
          "id": 6,
          "name": "Herschel",
          "slug": "herschel"
        },
        "category": {
          "id": 1,
          "name": "Balo Học Sinh",
          "slug": "balo-hoc-sinh"
        },
        "created_at": "2025-07-12T17:24:37.000000Z",
        "updated_at": "2025-07-12T17:47:55.000000Z"
      }
    ],
    "first_page_url": "http://localhost:8000/api/products?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost:8000/api/products?page=1",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://localhost:8000/api/products?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": null,
    "path": "http://localhost:8000/api/products",
    "per_page": 10,
    "prev_page_url": null,
    "to": 3,
    "total": 3
  }
}
```

### Ví dụ 4: Lọc theo khoảng giá và sắp xếp
**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products?min_price=1000000&max_price=2000000&sort_by=price&sort_order=asc" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 80,
        "name": "Túi Adidas Classic id",
        "slug": "tui-adidas-classic-id-3003",
        "description": "Ut molestiae animi enim ad adipisci fuga ea. Consequatur reprehenderit impedit cupiditate distinctio.",
        "price": 1019494,
        "discount_price": 815595,
        "image": "https://placehold.co/600x400?text=products/tui-adidas-classic-id.jpg",
        "gallery": [
          "https://placehold.co/600x400?text=tui-adidas-classic-id-1.jpg",
          "https://placehold.co/600x400?text=tui-adidas-classic-id-2.jpg"
        ],
        "stock": 8,
        "brand": {
          "id": 6,
          "name": "Herschel",
          "slug": "herschel"
        },
        "category": {
          "id": 5,
          "name": "Túi Xách",
          "slug": "tui-xach"
        },
        "created_at": "2025-07-12T17:24:37.000000Z",
        "updated_at": "2025-07-12T17:24:37.000000Z"
      }
    ],
    "first_page_url": "http://localhost:8000/api/products?page=1",
    "from": 1,
    "last_page": 12,
    "last_page_url": "http://localhost:8000/api/products?page=12",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://localhost:8000/api/products?page=1",
        "label": "1",
        "active": true
      }
    ],
    "next_page_url": "http://localhost:8000/api/products?page=2",
    "path": "http://localhost:8000/api/products",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 115
  }
}
```

### Ví dụ 5: Chỉ lấy sản phẩm còn hàng, sắp xếp theo giá giảm dần
**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products?in_stock=true&sort_by=price&sort_order=desc" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 4,
        "name": "Balo Samsonite Guardit 2.0",
        "slug": "balo-samsonite-guardit-20",
        "description": "Balo du lịch cao cấp với ngăn laptop 15.6\", chống thấm nước. Thiết kế sang trọng, phù hợp cho công tác.",
        "price": 3200000,
        "discount_price": 0,
        "image": "https://placehold.co/600x400?text=products/balo-samsonite-guardit-20.jpg",
        "gallery": [
          "https://placehold.co/600x400?text=Samsonite-1.jpg",
          "https://placehold.co/600x400?text=Samsonite-2.jpg"
        ],
        "stock": 20,
        "brand": {
          "id": 3,
          "name": "Samsonite",
          "slug": "samsonite"
        },
        "category": {
          "id": 2,
          "name": "Balo Du Lịch",
          "slug": "balo-du-lich"
        },
        "created_at": "2025-07-12T17:24:37.000000Z",
        "updated_at": "2025-07-12T17:24:37.000000Z"
      },
      {
        "id": 3,
        "name": "Balo The North Face Borealis 28L",
        "slug": "balo-the-north-face-borealis-28l",
        "description": "Balo trekking chuyên nghiệp với nhiều ngăn tiện ích, dây đeo thoải mái. Lý tưởng cho các chuyến du lịch ngắn ngày.",
        "price": 2500000,
        "discount_price": 2200000,
        "image": "https://placehold.co/600x400?text=products/balo-the-north-face-borealis-28l.jpg",
        "gallery": [
          "https://placehold.co/600x400?text=TNF-1.jpg",
          "https://placehold.co/600x400?text=TNF-2.jpg"
        ],
        "stock": 25,
        "brand": {
          "id": 5,
          "name": "The North Face",
          "slug": "the-north-face"
        },
        "category": {
          "id": 2,
          "name": "Balo Du Lịch",
          "slug": "balo-du-lich"
        },
        "created_at": "2025-07-12T17:24:37.000000Z",
        "updated_at": "2025-07-12T17:24:37.000000Z"
      }
    ],
    "first_page_url": "http://localhost:8000/api/products?page=1",
    "from": 1,
    "last_page": 20,
    "last_page_url": "http://localhost:8000/api/products?page=20",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://localhost:8000/api/products?page=1",
        "label": "1",
        "active": true
      }
    ],
    "next_page_url": "http://localhost:8000/api/products?page=2",
    "path": "http://localhost:8000/api/products",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 199
  }
}
```

## 2. Lấy chi tiết sản phẩm

### GET /api/products/{id}

**Mô tả**: Lấy thông tin chi tiết của một sản phẩm

**Phương thức**: GET

**URL**: `/api/products/{id}`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Path Parameters**:
- `id` (integer, required): ID của sản phẩm

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products/1" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Balo Nike Sportswear Heritage",
    "slug": "balo-nike-sportswear-heritage",
    "description": "Balo thời trang với thiết kế cổ điển từ Nike. Chất liệu bền bỉ, thiết kế tiện dụng với nhiều ngăn chứa. Phù hợp cho học sinh, sinh viên và người đi làm.",
    "price": 1500000,
    "discount_price": 1200000,
    "image": "https://placehold.co/600x400?text=products/balo-nike-sportswear-heritage.jpg",
    "gallery": [
      "https://placehold.co/600x400?text=Nike-1.jpg",
      "https://placehold.co/600x400?text=Nike-2.jpg"
    ],
    "stock": 15,
    "brand": {
      "id": 1,
      "name": "Nike",
      "slug": "nike",
      "logo": "https://placehold.co/200x200?text=Nike"
    },
    "category": {
      "id": 1,
      "name": "Balo Học Sinh",
      "slug": "balo-hoc-sinh"
    },
    "created_at": "2025-07-12T17:24:37.000000Z",
    "updated_at": "2025-07-12T17:24:37.000000Z"
  }
}
```

## 3. Lấy chi tiết sản phẩm theo slug

### GET /api/products/slug/{slug}

**Mô tả**: Lấy thông tin chi tiết của một sản phẩm theo slug

**Phương thức**: GET

**URL**: `/api/products/slug/{slug}`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Path Parameters**:
- `slug` (string, required): Slug của sản phẩm

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products/slug/balo-nike-sportswear-heritage" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Balo Nike Sportswear Heritage",
    "slug": "balo-nike-sportswear-heritage",
    "description": "Balo thời trang với thiết kế cổ điển từ Nike. Chất liệu bền bỉ, thiết kế tiện dụng với nhiều ngăn chứa. Phù hợp cho học sinh, sinh viên và người đi làm.",
    "price": 1500000,
    "discount_price": 1200000,
    "image": "https://placehold.co/600x400?text=products/balo-nike-sportswear-heritage.jpg",
    "gallery": [
      "https://placehold.co/600x400?text=Nike-1.jpg",
      "https://placehold.co/600x400?text=Nike-2.jpg"
    ],
    "stock": 15,
    "brand": {
      "id": 1,
      "name": "Nike",
      "slug": "nike",
      "logo": "https://placehold.co/200x200?text=Nike"
    },
    "category": {
      "id": 1,
      "name": "Balo Học Sinh",
      "slug": "balo-hoc-sinh"
    },
    "created_at": "2025-07-12T17:24:37.000000Z",
    "updated_at": "2025-07-12T17:24:37.000000Z"
  }
}
```

## 4. Lấy sản phẩm nổi bật

### GET /api/products/featured

**Mô tả**: Lấy danh sách sản phẩm nổi bật (featured products)

**Phương thức**: GET

**URL**: `/api/products/featured`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products/featured" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Balo Nike Sportswear Heritage",
      "slug": "balo-nike-sportswear-heritage",
      "description": "Balo thời trang với thiết kế cổ điển từ Nike",
      "price": 1500000,
      "discount_price": 1200000,
      "image": "https://placehold.co/600x400?text=products/balo-nike-sportswear-heritage.jpg",
      "gallery": [
        "https://placehold.co/600x400?text=Nike-1.jpg",
        "https://placehold.co/600x400?text=Nike-2.jpg"
      ],
      "stock": 15,
      "brand": {
        "id": 1,
        "name": "Nike",
        "slug": "nike"
      },
      "category": {
        "id": 1,
        "name": "Balo Học Sinh",
        "slug": "balo-hoc-sinh"
      },
      "created_at": "2025-07-12T17:24:37.000000Z",
      "updated_at": "2025-07-12T17:24:37.000000Z"
    },
    {
      "id": 2,
      "name": "Balo Adidas 3-Stripes Power",
      "slug": "balo-adidas-3-stripes-power",
      "description": "Balo thể thao năng động từ Adidas với thiết kế 3 sọc đặc trưng",
      "price": 1800000,
      "discount_price": 1500000,
      "image": "https://placehold.co/600x400?text=products/balo-adidas-3-stripes-power.jpg",
      "gallery": [
        "https://placehold.co/600x400?text=Adidas-1.jpg",
        "https://placehold.co/600x400?text=Adidas-2.jpg"
      ],
      "stock": 12,
      "brand": {
        "id": 2,
        "name": "Adidas",
        "slug": "adidas"
      },
      "category": {
        "id": 4,
        "name": "Balo Thể Thao",
        "slug": "balo-the-thao"
      },
      "created_at": "2025-07-12T17:24:37.000000Z",
      "updated_at": "2025-07-12T17:24:37.000000Z"
    }
  ]
}
```

## 5. Lấy sản phẩm mới nhất

### GET /api/products/latest

**Mô tả**: Lấy danh sách sản phẩm mới nhất

**Phương thức**: GET

**URL**: `/api/products/latest`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Query Parameters** (optional):
- `limit` (integer): Số lượng sản phẩm (mặc định: 10)

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products/latest?limit=5" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 205,
      "name": "Balo Gaming RGB sit",
      "slug": "balo-gaming-rgb-sit-4158",
      "description": "Et dignissimos dolorum tempora hic minus. Voluptas sint ex earum est.",
      "price": 1766374,
      "discount_price": 0,
      "image": "https://placehold.co/600x400?text=products/balo-gaming-rgb-sit.jpg",
      "gallery": [],
      "stock": 37,
      "brand": {
        "id": 4,
        "name": "JanSport",
        "slug": "jansport"
      },
      "category": {
        "id": 4,
        "name": "Balo Thể Thao",
        "slug": "balo-the-thao"
      },
      "created_at": "2025-07-12T17:24:38.000000Z",
      "updated_at": "2025-07-12T17:24:38.000000Z"
    }
  ]
}
```

## 6. Lấy sản phẩm liên quan

### GET /api/products/{id}/related

**Mô tả**: Lấy danh sách sản phẩm liên quan dựa trên category hoặc brand

**Phương thức**: GET

**URL**: `/api/products/{id}/related`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Path Parameters**:
- `id` (integer, required): ID của sản phẩm gốc

**Query Parameters** (optional):
- `limit` (integer): Số lượng sản phẩm (mặc định: 8)

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/products/1/related?limit=4" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 58,
      "name": "Balo Du Lịch Samsonite eos",
      "slug": "balo-du-lich-samsonite-eos-8388",
      "description": "Sint est amet laborum. Dolores nihil dolor nesciunt quas itaque amet.",
      "price": 1640641,
      "discount_price": 0,
      "image": "https://placehold.co/600x400?text=products/balo-du-lich-samsonite-eos.jpg",
      "gallery": [
        "https://placehold.co/600x400?text=balo-du-lich-samsonite-eos-1.jpg",
        "https://placehold.co/600x400?text=balo-du-lich-samsonite-eos-2.jpg"
      ],
      "stock": 49,
      "brand": {
        "id": 6,
        "name": "Herschel",
        "slug": "herschel"
      },
      "category": {
        "id": 1,
        "name": "Balo Học Sinh",
        "slug": "balo-hoc-sinh"
      },
      "created_at": "2025-07-12T17:24:37.000000Z",
      "updated_at": "2025-07-12T17:47:55.000000Z"
    }
  ]
}
```

**Response lỗi (404)**:
```json
{
  "message": "Product not found"
}
```

**Response lỗi (500)**:
```json
{
  "message": "Server Error"
}
```

---

## Ghi chú quan trọng

### Filtering mạnh mẽ với endpoint chính
Endpoint chính `/api/products` có khả năng filtering và search rất mạnh mẽ:

1. **Search tên sản phẩm**: `?search=nike`
2. **Lọc theo category**: `?category_id=1` 
3. **Lọc theo brand**: `?brand_id=6`
4. **Lọc theo khoảng giá**: `?min_price=1000000&max_price=2000000`
5. **Lọc sản phẩm còn hàng**: `?in_stock=true`
6. **Sorting linh hoạt**: `?sort_by=price&sort_order=desc`
7. **Kết hợp nhiều filter**: `?category_id=1&brand_id=6&min_price=500000&sort_by=price`

### Lợi ích của approach này:
- **Tối ưu hiệu suất**: Chỉ 1 endpoint thay vì nhiều route riêng biệt
- **Linh hoạt**: Có thể kết hợp bất kỳ filter nào với nhau
- **Dễ maintain**: Logic filtering tập trung trong 1 controller method
- **Scalable**: Dễ dàng thêm filter mới mà không cần tạo route mới

Điều này giúp API trở nên mạnh mẽ và linh hoạt hơn rất nhiều so với việc chia ra thành nhiều endpoint riêng biệt như `/search`, `/category/{slug}`, `/brand/{slug}`.
