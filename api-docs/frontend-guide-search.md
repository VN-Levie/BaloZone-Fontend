# API Guide - Tìm kiếm sản phẩm - BaloZone

Tài liệu hướng dẫn API tìm kiếm sản phẩm cho frontend developer.

## 🔗 Base URL

```text
http://localhost:8000/api
```

## 📋 API Tìm kiếm sản phẩm

### 1. Tìm kiếm & Lọc sản phẩm chính

**Endpoint**: `GET /products`

**Các tham số quan trọng**:

```javascript
// Tìm kiếm cơ bản
?search=nike

// Lọc theo danh mục và thương hiệu
?category_id=1&brand_id=2

// Lọc theo giá
?min_price=500000&max_price=2000000

// Chỉ sản phẩm còn hàng
?in_stock=true

// Sắp xếp
?sort_by=price&sort_order=desc

// Phân trang
?page=1&per_page=12
```

**Response cần quan tâm**:
```javascript
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Tên sản phẩm",
        "slug": "ten-san-pham",
        "price": 1500000,
        "discount_price": 1200000,
        "image": "url_hinh_anh",
        "stock": 15,
        "brand": {
          "id": 1,
          "name": "Nike"
        },
        "category": {
          "id": 1,
          "name": "Balo Học Sinh"
        }
      }
    ],
    "total": 150,
    "current_page": 1,
    "last_page": 15
  }
}
```

### 2. Tìm kiếm theo slug

**Endpoint**: `GET /products/slug/{slug}`

**Response**:
```javascript
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tên sản phẩm",
    "description": "Mô tả chi tiết...",
    "price": 1500000,
    "discount_price": 1200000,
    "image": "url_hinh_chinh",
    "gallery": ["url1", "url2", "url3"],
    "stock": 15,
    "brand": {
      "name": "Nike",
      "logo": "url_logo"
    },
    "category": {
      "name": "Balo Học Sinh"
    }
  }
}
```

### 3. Tìm kiếm theo ID

**Endpoint**: `GET /products/{id}`

**Response**: Giống như tìm kiếm theo slug

---

## 🔍 API hỗ trợ tìm kiếm

### Lấy danh sách danh mục (cho filter)

**Endpoint**: `GET /categories`

**Response**:
```javascript
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Balo Học Sinh",
      "slug": "balo-hoc-sinh"
    }
  ]
}
```

### Lấy danh sách thương hiệu (cho filter)

**Endpoint**: `GET /brands`

**Response**: Tương tự categories

---

## 🎯 Ví dụ triển khai tìm kiếm

### 1. Trang tìm kiếm với thanh search

```javascript
// Tìm kiếm khi user nhập từ khóa
const searchQuery = 'nike';
fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
```

### 2. Trang danh sách sản phẩm với filter

```javascript
// URL có thể như: /products?category=1&brand=2&price=500000-2000000
const params = new URLSearchParams({
  category_id: 1,
  brand_id: 2,
  min_price: 500000,
  max_price: 2000000,
  sort_by: 'price',
  sort_order: 'asc',
  page: 1,
  per_page: 12
});

fetch(`/api/products?${params}`)
```

### 3. Trang chi tiết sản phẩm

```javascript
// Lấy chi tiết sản phẩm theo slug (SEO friendly)
fetch(`/api/products/slug/${slug}`)

// Hoặc theo ID
fetch(`/api/products/${id}`)
```

### 4. Tìm kiếm với autocomplete/suggestion

```javascript
// Tìm kiếm realtime khi user typing
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value;
  if (query.length >= 2) {
    const response = await fetch(`/api/products?search=${query}&per_page=5`);
    const data = await response.json();
    // Hiển thị suggestions
  }
});
```

---

## ⚠️ Lưu ý quan trọng cho tìm kiếm

1. **Response format**: `{ success: boolean, data: any }`

2. **Giá tiền**: Số nguyên (VND), VD: `1500000` = 1.500.000 VNĐ

3. **Hình ảnh**: URL đầy đủ, có thể hiển thị trực tiếp

4. **Phân trang**: Sử dụng `page` và `per_page`, response có `total` và `last_page`

5. **Tìm kiếm**: Hỗ trợ tìm kiếm theo tên sản phẩm, không phân biệt hoa thường

6. **Filter**: Có thể kết hợp nhiều filter cùng lúc

7. **Sorting**: Hỗ trợ sắp xếp theo `name`, `price`, `created_at`

---

## 🛠️ Test API tìm kiếm

```bash
# Tìm kiếm cơ bản
curl "http://localhost:8000/api/products?search=nike"

# Tìm kiếm với filter
curl "http://localhost:8000/api/products?search=balo&category_id=1&min_price=500000"

# Lấy chi tiết sản phẩm
curl "http://localhost:8000/api/products/slug/balo-nike-heritage-20"

# Lấy danh mục (cho dropdown filter)
curl "http://localhost:8000/api/categories"
```

---

**Lưu ý**: Tài liệu này chỉ tập trung vào tính năng tìm kiếm sản phẩm. Để biết thêm các API khác, tham khảo file `04-products-new.md` trong thư mục `api-docs/publicAndUser/`.
