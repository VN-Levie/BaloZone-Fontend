# API Documentation

This document provides a detailed overview of the BaloZone-Backend API endpoints.

## Auth

### 1. Đăng nhập

- **Endpoint:** `POST /api/auth/login`
- **Mô tả:** Đăng nhập người dùng và trả về một token JWT.
- **Input (JSON):**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Output thành công (JSON):**
```json
{
    "success": true,
    "message": "Đăng nhập thành công",
    "data": {
        "access_token": "your_jwt_token",
        "token_type": "bearer",
        "expires_in": 3600,
        "user": {
            "id": 1,
            "name": "Tên người dùng",
            "email": "user@example.com",
            "phone": "0123456789",
            "status": "active",
            "roles": [
                {
                    "id": 2,
                    "name": "user",
                    "guard_name": "api",
                    "created_at": "2025-07-04T12:00:00.000000Z",
                    "updated_at": "2025-07-04T12:00:00.000000Z",
                    "pivot": {
                        "model_id": 1,
                        "role_id": 2,
                        "model_type": "App\Models\User"
                    }
                }
            ]
        }
    }
}
```
- **Output thất bại (JSON):**
```json
{
    "success": false,
    "message": "Email hoặc mật khẩu không đúng"
}
```

### 2. Đăng ký

- **Endpoint:** `POST /api/auth/register`
- **Mô tả:** Đăng ký người dùng mới.
- **Input (JSON):**
```json
{
    "name": "Tên người dùng mới",
    "email": "newuser@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "0987654321"
}
```
- **Output thành công (JSON):**
```json
{
    "success": true,
    "message": "Đăng ký thành công",
    "data": {
        "access_token": "your_jwt_token",
        "token_type": "bearer",
        "expires_in": 3600,
        "user": {
            "id": 2,
            "name": "Tên người dùng mới",
            "email": "newuser@example.com",
            "phone": "0987654321",
            "status": "active",
            "roles": [
                {
                    "id": 2,
                    "name": "user",
                    "guard_name": "api",
                    "created_at": "2025-07-04T12:00:00.000000Z",
                    "updated_at": "2025-07-04T12:00:00.000000Z",
                    "pivot": {
                        "model_id": 2,
                        "role_id": 2,
                        "model_type": "App\Models\User"
                    }
                }
            ]
        }
    }
}
```
- **Output thất bại (Validation errors):**
```json
{
    "success": false,
    "message": "Validation errors",
    "errors": {
        "email": [
            "The email has already been taken."
        ]
    }
}
```

### 3. Đăng xuất

- **Endpoint:** `POST /api/auth/logout`
- **Mô tả:** Đăng xuất người dùng (yêu cầu token JWT).
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Output thành công (JSON):**
```json
{
    "success": true,
    "message": "Đăng xuất thành công"
}
```

### 4. Làm mới Token

- **Endpoint:** `POST /api/auth/refresh`
- **Mô tả:** Làm mới token JWT đã hết hạn (yêu cầu token JWT).
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Output thành công (JSON):**
```json
{
    "access_token": "new_jwt_token",
    "token_type": "bearer",
    "expires_in": 3600
}
```

### 5. Lấy thông tin người dùng

- **Endpoint:** `GET /api/auth/me`
- **Mô tả:** Lấy thông tin của người dùng đang đăng nhập (yêu cầu token JWT).
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Output thành công (JSON):**
```json
{
    "id": 1,
    "name": "Tên người dùng",
    "email": "user@example.com",
    "phone": "0123456789",
    "status": "active",
    "roles": [
        {
            "id": 2,
            "name": "user",
            "guard_name": "api",
            "created_at": "2025-07-04T12:00:00.000000Z",
            "updated_at": "2025-07-04T12:00:00.000000Z",
            "pivot": {
                "model_id": 1,
                "role_id": 2,
                "model_type": "App\Models\User"
            }
        }
    ]
}
```

## Brands

### 1. Lấy danh sách thương hiệu

- **Endpoint:** `GET /api/brands`
- **Mô tả:** Lấy danh sách các thương hiệu, có hỗ trợ tìm kiếm và lọc theo trạng thái.
- **Query Params:**
    - `search` (string, optional): Tìm kiếm theo tên thương hiệu.
    - `status` (string, optional): Lọc theo trạng thái (`active` hoặc `inactive`).
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định là 15).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "name": "Thương hiệu A",
            "slug": "thuong-hieu-a",
            "image": "path/to/image.jpg",
            "description": "Mô tả thương hiệu A",
            "status": "active",
            "created_at": "2025-07-04T12:00:00.000000Z",
            "updated_at": "2025-07-04T12:00:00.000000Z"
        }
    ],
    "first_page_url": "http://localhost/api/brands?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/brands?page=1",
    "links": [
        // ...
    ],
    "next_page_url": null,
    "path": "http://localhost/api/brands",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

### 2. Lấy chi tiết thương hiệu

- **Endpoint:** `GET /api/brands/{brand}`
- **Mô tả:** Lấy thông tin chi tiết của một thương hiệu, bao gồm cả danh sách sản phẩm thuộc thương hiệu đó.
- **URL Params:**
    - `brand` (integer, required): ID của thương hiệu.
- **Output thành công (JSON):**
```json
{
    "data": {
        "id": 1,
        "name": "Thương hiệu A",
        "slug": "thuong-hieu-a",
        "image": "path/to/image.jpg",
        "description": "Mô tả thương hiệu A",
        "status": "active",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T12:00:00.000000Z",
        "products": [
            // ... danh sách sản phẩm
        ]
    }
}
```

### 3. Lấy danh sách thương hiệu đang hoạt động

- **Endpoint:** `GET /api/brands-active`
- **Mô tả:** Lấy danh sách các thương hiệu đang ở trạng thái "active".
- **Output thành công (JSON):**
```json
[
    {
        "id": 1,
        "name": "Thương hiệu A",
        "slug": "thuong-hieu-a"
    },
    {
        "id": 2,
        "name": "Thương hiệu B",
        "slug": "thuong-hieu-b"
    }
]
```

### 4. Tạo thương hiệu mới (Admin/Contributor)

- **Endpoint:** `POST /api/brands`
- **Mô tả:** Tạo một thương hiệu mới.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Input (JSON):**
```json
{
    "name": "Thương hiệu mới",
    "description": "Mô tả cho thương hiệu mới",
    "image": "path/to/new_image.jpg",
    "status": "active"
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Brand created successfully",
    "data": {
        "id": 2,
        "name": "Thương hiệu mới",
        "slug": "thuong-hieu-moi",
        "description": "Mô tả cho thương hiệu mới",
        "image": "path/to/new_image.jpg",
        "status": "active",
        "created_at": "2025-07-04T13:00:00.000000Z",
        "updated_at": "2025-07-04T13:00:00.000000Z"
    }
}
```

### 5. Cập nhật thương hiệu (Admin/Contributor)

- **Endpoint:** `PUT /api/brands/{brand}`
- **Mô tả:** Cập nhật thông tin một thương hiệu.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `brand` (integer, required): ID của thương hiệu.
- **Input (JSON):**
```json
{
    "name": "Tên thương hiệu đã cập nhật",
    "status": "inactive"
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Brand updated successfully",
    "data": {
        "id": 1,
        "name": "Tên thương hiệu đã cập nhật",
        "slug": "ten-thuong-hieu-da-cap-nhat",
        "description": "Mô tả thương hiệu A",
        "image": "path/to/image.jpg",
        "status": "inactive",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T13:30:00.000000Z"
    }
}
```

### 6. Xóa thương hiệu (Admin/Contributor)

- **Endpoint:** `DELETE /api/brands/{brand}`
- **Mô tả:** Xóa một thương hiệu. Lưu ý: không thể xóa nếu thương hiệu vẫn còn sản phẩm.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `brand` (integer, required): ID của thương hiệu.
- **Output thành công (JSON):**
```json
{
    "message": "Brand deleted successfully"
}
```
- **Output thất bại (JSON):**
```json
{
    "message": "Cannot delete brand that has products. Please remove or reassign products first."
}
```

## Categories

### 1. Lấy danh sách danh mục

- **Endpoint:** `GET /api/categories`
- **Mô tả:** Lấy danh sách các danh mục, có hỗ trợ tìm kiếm và đếm số lượng sản phẩm trong mỗi danh mục.
- **Query Params:**
    - `search` (string, optional): Tìm kiếm theo tên danh mục.
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định là 15).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "name": "Danh mục A",
            "slug": "danh-muc-a",
            "description": "Mô tả danh mục A",
            "products_count": 10,
            "created_at": "2025-07-04T12:00:00.000000Z",
            "updated_at": "2025-07-04T12:00:00.000000Z"
        }
    ],
    "first_page_url": "http://localhost/api/categories?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/categories?page=1",
    "links": [
        // ...
    ],
    "next_page_url": null,
    "path": "http://localhost/api/categories",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

### 2. Lấy chi tiết danh mục

- **Endpoint:** `GET /api/categories/{category}`
- **Mô tả:** Lấy thông tin chi tiết của một danh mục.
- **URL Params:**
    - `category` (integer, required): ID của danh mục.
- **Output thành công (JSON):**
```json
{
    "data": {
        "id": 1,
        "name": "Danh mục A",
        "slug": "danh-muc-a",
        "description": "Mô tả danh mục A",
        "products_count": 10,
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T12:00:00.000000Z"
    }
}
```

### 3. Lấy danh mục kèm sản phẩm

- **Endpoint:** `GET /api/categories-with-products`
- **Mô tả:** Lấy danh sách các danh mục, mỗi danh mục kèm theo tối đa 8 sản phẩm mới nhất.
- **Output thành công (JSON):**
```json
{
    "data": [
        {
            "id": 1,
            "name": "Danh mục A",
            "slug": "danh-muc-a",
            "description": "Mô tả danh mục A",
            "created_at": "2025-07-04T12:00:00.000000Z",
            "updated_at": "2025-07-04T12:00:00.000000Z",
            "products": [
                // ... danh sách tối đa 8 sản phẩm
            ]
        }
    ]
}
```

### 4. Lấy danh mục theo slug

- **Endpoint:** `GET /api/categories/slug/{slug}`
- **Mô tả:** Lấy thông tin một danh mục và danh sách sản phẩm của nó (có phân trang) dựa vào slug.
- **URL Params:**
    - `slug` (string, required): Slug của danh mục.
- **Query Params:**
    - `per_page` (integer, optional): Số lượng sản phẩm mỗi trang (mặc định là 12).
- **Output thành công (JSON):**
```json
{
    "category": {
        "id": 1,
        "name": "Danh mục A",
        "slug": "danh-muc-a",
        // ... các trường khác của category
    },
    "products": {
        "current_page": 1,
        "data": [
            // ... danh sách sản phẩm của trang hiện tại
        ],
        // ... các thông tin phân trang khác
    }
}
```

### 5. Tạo danh mục mới (Admin/Contributor)

- **Endpoint:** `POST /api/categories`
- **Mô tả:** Tạo một danh mục mới.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Input (JSON):**
```json
{
    "name": "Danh mục mới",
    "description": "Mô tả cho danh mục mới"
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Category created successfully",
    "data": {
        "id": 2,
        "name": "Danh mục mới",
        "slug": "danh-muc-moi",
        "description": "Mô tả cho danh mục mới",
        "created_at": "2025-07-04T14:00:00.000000Z",
        "updated_at": "2025-07-04T14:00:00.000000Z"
    }
}
```

### 6. Cập nhật danh mục (Admin/Contributor)

- **Endpoint:** `PUT /api/categories/{category}`
- **Mô tả:** Cập nhật thông tin một danh mục.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `category` (integer, required): ID của danh mục.
- **Input (JSON):**
```json
{
    "name": "Tên danh mục đã cập nhật"
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Category updated successfully",
    "data": {
        "id": 1,
        "name": "Tên danh mục đã cập nhật",
        "slug": "ten-danh-muc-da-cap-nhat",
        "description": "Mô tả danh mục A",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T14:30:00.000000Z"
    }
}
```

### 7. Xóa danh mục (Admin/Contributor)

- **Endpoint:** `DELETE /api/categories/{category}`
- **Mô tả:** Xóa một danh mục. Lưu ý: không thể xóa nếu danh mục vẫn còn sản phẩm.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `category` (integer, required): ID của danh mục.
- **Output thành công (JSON):**
```json
{
    "message": "Category deleted successfully"
}
```
- **Output thất bại (JSON):**
```json
{
    "message": "Cannot delete category that has products. Please remove or reassign products first."
}
```

## Products

### 1. Lấy danh sách sản phẩm (Public)

- **Endpoint:** `GET /api/products`
- **Mô tả:** Lấy danh sách sản phẩm với nhiều tùy chọn lọc và sắp xếp.
- **Query Params:**
    - `search` (string, optional): Tìm kiếm theo tên sản phẩm.
    - `category_id` (integer, optional): Lọc theo ID danh mục.
    - `brand_id` (integer, optional): Lọc theo ID thương hiệu.
    - `min_price` (numeric, optional): Lọc theo giá tối thiểu.
    - `max_price` (numeric, optional): Lọc theo giá tối đa.
    - `color` (string, optional): Lọc theo màu sắc.
    - `in_stock` (boolean, optional): Lọc sản phẩm còn hàng (`true`).
    - `sort_by` (string, optional): Trường để sắp xếp (mặc định: `created_at`). Các giá trị hợp lệ: `name`, `price`, `created_at`.
    - `sort_order` (string, optional): Thứ tự sắp xếp (mặc định: `desc`). Các giá trị hợp lệ: `asc`, `desc`.
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định: 12).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "name": "Balo ABC",
            "slug": "balo-abc",
            "price": 500000,
            "quantity": 50,
            "category": { "id": 1, "name": "Danh mục A" },
            "brand": { "id": 1, "name": "Thương hiệu A" }
        }
    ],
    "first_page_url": "http://localhost/api/products?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/products?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost/api/products",
    "per_page": 12,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

### 2. Lấy chi tiết sản phẩm (Public)

- **Endpoint:** `GET /api/products/{product}`
- **Mô tả:** Lấy thông tin chi tiết của một sản phẩm, bao gồm danh mục, thương hiệu và các bình luận.
- **URL Params:**
    - `product` (integer, required): ID của sản phẩm.
- **Output thành công (JSON):**
```json
{
    "data": {
        "id": 1,
        "name": "Balo ABC",
        "slug": "balo-abc",
        "price": 500000,
        "description": "Mô tả chi tiết sản phẩm.",
        "quantity": 50,
        "category": { "id": 1, "name": "Danh mục A" },
        "brand": { "id": 1, "name": "Thương hiệu A" },
        "comments": [
            {
                "id": 1,
                "content": "Sản phẩm rất tốt!",
                "user": { "id": 1, "name": "Người dùng A" }
            }
        ]
    }
}
```

### 3. Tạo sản phẩm mới (Admin/Contributor)

- **Endpoint:** `POST /api/products`
- **Mô tả:** Tạo một sản phẩm mới.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Input (JSON):**
```json
{
    "name": "Balo Mới",
    "price": 750000,
    "quantity": 100,
    "description": "Mô tả cho balo mới.",
    "category_id": 1,
    "brand_id": 2
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Product created successfully",
    "data": {
        "id": 2,
        "name": "Balo Mới",
        "slug": "balo-moi",
        "price": 750000,
        "quantity": 100,
        "description": "Mô tả cho balo mới.",
        "category": { "id": 1, "name": "Danh mục A" },
        "brand": { "id": 2, "name": "Thương hiệu B" }
    }
}
```

### 4. Cập nhật sản phẩm (Admin/Contributor)

- **Endpoint:** `PUT /api/products/{product}`
- **Mô tả:** Cập nhật thông tin một sản phẩm.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `product` (integer, required): ID của sản phẩm.
- **Input (JSON):**
```json
{
    "name": "Balo ABC đã cập nhật",
    "price": 550000
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Product updated successfully",
    "data": {
        "id": 1,
        "name": "Balo ABC đã cập nhật",
        "price": 550000
    }
}
```

### 5. Xóa sản phẩm (Admin/Contributor)

- **Endpoint:** `DELETE /api/products/{product}`
- **Mô tả:** Xóa một sản phẩm. Lưu ý: không thể xóa nếu sản phẩm đã có trong đơn hàng.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `product` (integer, required): ID của sản phẩm.
- **Output thành công (JSON):**
```json
{
    "message": "Product deleted successfully"
}
```
- **Output thất bại (JSON):**
```json
{
    "message": "Cannot delete product that has been ordered."
}
```

### 6. Lấy sản phẩm nổi bật (Public)

- **Endpoint:** `GET /api/products-featured`
- **Mô tả:** Lấy danh sách 8 sản phẩm nổi bật mới nhất (có hàng trong kho).
- **Output thành công (JSON):**
```json
{
    "data": [
        {
            "id": 1,
            "name": "Balo ABC",
            "slug": "balo-abc",
            "price": 500000,
            "quantity": 50,
            "category": { "id": 1, "name": "Danh mục A" },
            "brand": { "id": 1, "name": "Thương hiệu A" }
        }
    ]
}
```

### 7. Lấy sản phẩm theo danh mục (Public)

- **Endpoint:** `GET /api/products/category/{categorySlug}`
- **Mô tả:** Lấy danh sách sản phẩm thuộc một danh mục cụ thể dựa vào slug của danh mục.
- **URL Params:**
    - `categorySlug` (string, required): Slug của danh mục.
- **Query Params:**
    - `brand_id` (integer, optional): Lọc theo ID thương hiệu.
    - `min_price` (numeric, optional): Lọc theo giá tối thiểu.
    - `max_price` (numeric, optional): Lọc theo giá tối đa.
    - `color` (string, optional): Lọc theo màu sắc.
    - `search` (string, optional): Tìm kiếm theo tên sản phẩm.
    - `sort_by` (string, optional): Sắp xếp theo (`name`, `price`). Mặc định: `name`.
    - `sort_order` (string, optional): Thứ tự sắp xếp (`asc`, `desc`). Mặc định: `asc`.
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định: 12).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "name": "Balo ABC",
            "slug": "balo-abc",
            "price": 500000,
            "quantity": 50,
            "category": { "id": 1, "name": "Danh mục A" },
            "brand": { "id": 1, "name": "Thương hiệu A" }
        }
    ],
    "first_page_url": "http://localhost/api/products/category/balo-hoc-sinh?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/products/category/balo-hoc-sinh?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost/api/products/category/balo-hoc-sinh",
    "per_page": 12,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

### 8. Lấy sản phẩm theo thương hiệu (Public)

- **Endpoint:** `GET /api/products/brand/{brandSlug}`
- **Mô tả:** Lấy danh sách sản phẩm thuộc một thương hiệu cụ thể dựa vào slug của thương hiệu.
- **URL Params:**
    - `brandSlug` (string, required): Slug của thương hiệu.
- **Query Params:**
    - `category_id` (integer, optional): Lọc theo ID danh mục.
    - `min_price` (numeric, optional): Lọc theo giá tối thiểu.
    - `max_price` (numeric, optional): Lọc theo giá tối đa.
    - `color` (string, optional): Lọc theo màu sắc.
    - `search` (string, optional): Tìm kiếm theo tên sản phẩm.
    - `sort_by` (string, optional): Sắp xếp theo (`name`, `price`). Mặc định: `name`.
    - `sort_order` (string, optional): Thứ tự sắp xếp (`asc`, `desc`). Mặc định: `asc`.
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định: 12).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "name": "Balo ABC",
            "slug": "balo-abc",
            "price": 500000,
            "quantity": 50,
            "category": { "id": 1, "name": "Danh mục A" },
            "brand": { "id": 1, "name": "Thương hiệu A" }
        }
    ],
    "first_page_url": "http://localhost/api/products/brand/nike?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/products/brand/nike?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost/api/products/brand/nike",
    "per_page": 12,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

### 9. Tìm kiếm sản phẩm (Public)

- **Endpoint:** `GET /api/products-search`
- **Mô tả:** Tìm kiếm sản phẩm theo từ khóa (tìm trong tên, mô tả, tên danh mục và tên thương hiệu).
- **Query Params:**
    - `q` (string, required): Từ khóa tìm kiếm.
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "name": "Balo ABC",
            "slug": "balo-abc",
            "price": 500000,
            "quantity": 50,
            "category": { "id": 1, "name": "Danh mục A" },
            "brand": { "id": 1, "name": "Thương hiệu A" }
        }
    ],
    "first_page_url": "http://localhost/api/products-search?q=balo&page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/products-search?q=balo&page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost/api/products-search",
    "per_page": 12,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```
- **Output thất bại (JSON):**
```json
{
    "data": [],
    "message": "Search query is required"
}
```

### 10. Lấy sản phẩm đang khuyến mãi (Public)

- **Endpoint:** `GET /api/products-on-sale`
- **Mô tả:** Lấy danh sách các sản phẩm đang có chương trình khuyến mãi hoạt động.
- **Query Params:**
    - `category_id` (integer, optional): Lọc theo ID danh mục.
    - `brand_id` (integer, optional): Lọc theo ID thương hiệu.
    - `min_discount` (numeric, optional): Lọc theo phần trăm giảm giá tối thiểu.
    - `max_discount` (numeric, optional): Lọc theo phần trăm giảm giá tối đa.
    - `min_price` (numeric, optional): Lọc theo giá sale tối thiểu.
    - `max_price` (numeric, optional): Lọc theo giá sale tối đa.
    - `search` (string, optional): Tìm kiếm theo tên, mô tả sản phẩm.
    - `sort_by` (string, optional): Sắp xếp theo (`name`, `discount`, `sale_price`). Mặc định: `name`.
    - `sort_order` (string, optional): Thứ tự sắp xếp (`asc`, `desc`). Mặc định: `asc`.
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định: 12).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "name": "Balo ABC",
            "slug": "balo-abc",
            "price": 500000,
            "quantity": 50,
            "category": { "id": 1, "name": "Danh mục A" },
            "brand": { "id": 1, "name": "Thương hiệu A" },
            "current_sale": {
                "id": 1,
                "sale_price": 400000,
                "discount_percentage": 20,
                "sale_campaign": {
                    "id": 1,
                    "name": "Flash Sale Cuối Tuần",
                    "end_date": "2025-07-10T23:59:59.000000Z"
                }
            }
        }
    ],
    "first_page_url": "http://localhost/api/products-on-sale?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/products-on-sale?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost/api/products-on-sale",
    "per_page": 12,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

### 11. Lấy các chương trình khuyến mãi của sản phẩm (Public)

- **Endpoint:** `GET /api/products/{product}/sale-campaigns`
- **Mô tả:** Lấy danh sách các chương trình khuyến mãi mà sản phẩm này đang tham gia.
- **URL Params:**
    - `product` (integer, required): ID của sản phẩm.
- **Output thành công (JSON):**
```json
{
    "data": [
        {
            "id": 1,
            "name": "Flash Sale Cuối Tuần",
            "slug": "flash-sale-weekend",
            "description": "Flash sale cuối tuần - Cơ hội vàng săn balo giá rẻ",
            "start_date": "2025-07-01T00:00:00.000000Z",
            "end_date": "2025-07-10T23:59:59.000000Z",
            "status": "active",
            "is_featured": true,
            "priority": 90,
            "sale_products": [
                {
                    "id": 1,
                    "product_id": 1,
                    "original_price": 500000,
                    "sale_price": 400000,
                    "discount_percentage": 20
                }
            ]
        }
    ]
}
```

## Vouchers

### 1. Lấy danh sách voucher (Public)

- **Endpoint:** `GET /api/vouchers`
- **Mô tả:** Lấy danh sách các voucher, có hỗ trợ tìm kiếm và lọc.
- **Query Params:**
    - `search` (string, optional): Tìm kiếm theo mã voucher.
    - `active` (boolean, optional): Lọc các voucher còn hiệu lực (`true`).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "code": "GIAM10K",
            "price": 10000,
            "quantity": 100,
            "end_at": "2025-12-31T23:59:59.000000Z",
            "created_at": "2025-07-04T12:00:00.000000Z",
            "updated_at": "2025-07-04T12:00:00.000000Z"
        }
    ],
    "first_page_url": "http://localhost/api/vouchers?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/vouchers?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost/api/vouchers",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

### 2. Lấy chi tiết voucher (Public)

- **Endpoint:** `GET /api/vouchers/{voucher}`
- **Mô tả:** Lấy thông tin chi tiết của một voucher.
- **URL Params:**
    - `voucher` (integer, required): ID của voucher.
- **Output thành công (JSON):**
```json
{
    "data": {
        "id": 1,
        "code": "GIAM10K",
        "price": 10000,
        "quantity": 100,
        "end_at": "2025-12-31T23:59:59.000000Z",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T12:00:00.000000Z"
    }
}
```

### 3. Kiểm tra mã voucher (Public)

- **Endpoint:** `POST /api/vouchers/validate`
- **Mô tả:** Kiểm tra tính hợp lệ của một mã voucher.
- **Input (JSON):**
```json
{
    "code": "GIAM10K"
}
```
- **Output thành công (JSON):**
```json
{
    "valid": true,
    "message": "Mã voucher hợp lệ",
    "data": {
        "id": 1,
        "code": "GIAM10K",
        "discount": 10000,
        "end_at": "2025-12-31T23:59:59.000000Z",
        "remaining": 100
    }
}
```
- **Output thất bại (JSON):**
```json
{
    "valid": false,
    "message": "Mã voucher không hợp lệ hoặc đã hết hạn"
}
```

### 4. Lấy danh sách voucher đang hoạt động (Public)

- **Endpoint:** `GET /api/vouchers-active`
- **Mô tả:** Lấy danh sách tất cả các voucher còn hiệu lực và số lượng.
- **Output thành công (JSON):**
```json
{
    "data": [
        {
            "id": 1,
            "code": "GIAM10K",
            "price": 10000,
            "quantity": 100,
            "end_at": "2025-12-31T23:59:59.000000Z",
            "created_at": "2025-07-04T12:00:00.000000Z",
            "updated_at": "2025-07-04T12:00:00.000000Z"
        }
    ]
}
```

### 5. Tạo voucher mới (Admin/Contributor)

- **Endpoint:** `POST /api/vouchers`
- **Mô tả:** Tạo một voucher mới.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Input (JSON):**
```json
{
    "code": "FREESHIP",
    "price": 30000,
    "quantity": 50,
    "end_at": "2025-08-31"
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Voucher created successfully",
    "data": {
        "id": 2,
        "code": "FREESHIP",
        "price": 30000,
        "quantity": 50,
        "end_at": "2025-08-31T00:00:00.000000Z",
        "created_at": "2025-07-04T15:00:00.000000Z",
        "updated_at": "2025-07-04T15:00:00.000000Z"
    }
}
```

### 6. Cập nhật voucher (Admin/Contributor)

- **Endpoint:** `PUT /api/vouchers/{voucher}`
- **Mô tả:** Cập nhật thông tin một voucher.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `voucher` (integer, required): ID của voucher.
- **Input (JSON):**
```json
{
    "quantity": 75
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Voucher updated successfully",
    "data": {
        "id": 1,
        "code": "GIAM10K",
        "price": 10000,
        "quantity": 75,
        "end_at": "2025-12-31T23:59:59.000000Z"
    }
}
```

### 7. Xóa voucher (Admin/Contributor)

- **Endpoint:** `DELETE /api/vouchers/{voucher}`
- **Mô tả:** Xóa một voucher. Lưu ý: không thể xóa nếu voucher đã được sử dụng trong đơn hàng.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `voucher` (integer, required): ID của voucher.
- **Output thành công (JSON):**
```json
{
    "message": "Voucher deleted successfully"
}
```
- **Output thất bại (JSON):**
```json
{
    "message": "Cannot delete voucher that has been used in orders."
}
```

## Comments

### 1. Lấy danh sách bình luận (Public)

- **Endpoint:** `GET /api/comments`
- **Mô tả:** Lấy danh sách tất cả các bình luận, có thể lọc theo sản phẩm hoặc người dùng.
- **Query Params:**
    - `product_id` (integer, optional): Lọc bình luận theo ID sản phẩm.
    - `user_id` (integer, optional): Lọc bình luận theo ID người dùng.
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định là 10).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "comment": "Sản phẩm này rất tuyệt vời!",
            "user_id": 1,
            "product_id": 1,
            "created_at": "2025-07-04T16:00:00.000000Z",
            "updated_at": "2025-07-04T16:00:00.000000Z",
            "user": {
                "id": 1,
                "name": "Tên người dùng"
            },
            "product": {
                "id": 1,
                "name": "Tên sản phẩm"
            }
        }
    ],
    "first_page_url": "http://localhost/api/comments?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost/api/comments?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost/api/comments",
    "per_page": 10,
    "prev_page_url": null,
    "to": 1,
    "total": 1
}
```

### 2. Lấy chi tiết bình luận (Public)

- **Endpoint:** `GET /api/comments/{comment}`
- **Mô tả:** Lấy thông tin chi tiết của một bình luận.
- **URL Params:**
    - `comment` (integer, required): ID của bình luận.
- **Output thành công (JSON):**
```json
{
    "data": {
        "id": 1,
        "comment": "Sản phẩm này rất tuyệt vời!",
        "user_id": 1,
        "product_id": 1,
        "created_at": "2025-07-04T16:00:00.000000Z",
        "updated_at": "2025-07-04T16:00:00.000000Z",
        "user": {
            "id": 1,
            "name": "Tên người dùng"
        },
        "product": {
            "id": 1,
            "name": "Tên sản phẩm",
            "slug": "ten-san-pham"
        }
    }
}
```

### 3. Lấy bình luận theo sản phẩm (Public)

- **Endpoint:** `GET /api/comments/product/{productId}`
- **Mô tả:** Lấy danh sách bình luận cho một sản phẩm cụ thể (có phân trang).
- **URL Params:**
    - `productId` (integer, required): ID của sản phẩm.
- **Query Params:**
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định là 10).
- **Output thành công (JSON):** (Tương tự mục 1, nhưng chỉ chứa các bình luận của sản phẩm đó)

### 4. Lấy bình luận của tôi (Authenticated)

- **Endpoint:** `GET /api/my-comments`
- **Mô tả:** Lấy danh sách các bình luận của người dùng đang đăng nhập.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Query Params:**
    - `per_page` (integer, optional): Số lượng kết quả mỗi trang (mặc định là 10).
- **Output thành công (JSON):**
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "comment": "Sản phẩm này rất tuyệt vời!",
            "user_id": 1,
            "product_id": 1,
            "created_at": "2025-07-04T16:00:00.000000Z",
            "updated_at": "2025-07-04T16:00:00.000000Z",
            "product": {
                "id": 1,
                "name": "Tên sản phẩm",
                "slug": "ten-san-pham",
                "image": "path/to/image.jpg"
            }
        }
    ],
    // ... thông tin phân trang
}
```

### 5. Tạo bình luận mới (Authenticated)

- **Endpoint:** `POST /api/comments`
- **Mô tả:** Tạo một bình luận mới cho sản phẩm. Yêu cầu người dùng phải đăng nhập và đã mua sản phẩm này. Mỗi người dùng chỉ được bình luận một lần cho mỗi sản phẩm.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Input (JSON):**
```json
{
    "product_id": 1,
    "comment": "Nội dung bình luận mới."
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Bình luận đã được thêm thành công",
    "data": {
        "id": 2,
        "product_id": 1,
        "user_id": 1,
        "comment": "Nội dung bình luận mới.",
        "created_at": "2025-07-04T17:00:00.000000Z",
        "updated_at": "2025-07-04T17:00:00.000000Z",
        "user": { "id": 1, "name": "Tên người dùng" },
        "product": { "id": 1, "name": "Tên sản phẩm" }
    }
}
```
- **Output thất bại (JSON):**
```json
{
    "message": "Bạn chỉ có thể bình luận về sản phẩm đã mua"
}
// hoặc
{
    "message": "Bạn đã bình luận về sản phẩm này rồi"
}
```

### 6. Cập nhật bình luận (Authenticated)

- **Endpoint:** `PUT /api/comments/{comment}`
- **Mô tả:** Cập nhật nội dung bình luận của chính mình.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `comment` (integer, required): ID của bình luận.
- **Input (JSON):**
```json
{
    "comment": "Nội dung bình luận đã được cập nhật."
}
```
- **Output thành công (JSON):**
```json
{
    "message": "Bình luận đã được cập nhật",
    "data": {
        // ... thông tin bình luận đã cập nhật
    }
}
```
- **Output thất bại (JSON):**
```json
{
    "message": "Bạn không có quyền sửa bình luận này"
}
```

### 7. Xóa bình luận (Authenticated)

- **Endpoint:** `DELETE /api/comments/{comment}`
- **Mô tả:** Xóa bình luận của chính mình.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `comment` (integer, required): ID của bình luận.
- **Output thành công (JSON):**
```json
{
    "message": "Bình luận đã được xóa"
}
```
- **Output thất bại (JSON):**
```json
{
    "message": "Bạn không có quyền xóa bình luận này"
}
```
<details>
<summary><strong>Lấy danh sách bình luận của một người dùng</strong></summary>

- **Endpoint:** `GET /api/comments/user/{userId}`
- **Mô tả:** Lấy danh sách tất cả bình luận đã được duyệt của một người dùng cụ thể.
- **Phân quyền:** Bất kỳ ai.
- **Tham số:**
  - `userId` (integer, required): ID của người dùng.
- **Output (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "product_id": 1,
        "content": "Sản phẩm tuyệt vời!",
        "rating": 5,
        "status": "approved",
        "created_at": "2024-07-21T10:00:00.000000Z",
        "updated_at": "2024-07-21T10:00:00.000000Z",
        "user": {
          "id": 1,
          "name": "Haiduong"
        }
      }
    ]
  }
  ```
- **Lưu ý:** Chỉ trả về các bình luận có `status` là `approved`.

</details>

---

## 7. User - Quản lý thông tin người dùng

Các endpoint để người dùng quản lý thông tin cá nhân, mật khẩu, xem thống kê và xóa tài khoản.

**Yêu cầu chung:** Cần có `Authorization: Bearer <token>` trong header.

<details>
<summary><strong>Lấy thông tin cá nhân (Profile)</strong></summary>

- **Endpoint:** `GET /api/profile`
- **Mô tả:** Lấy thông tin chi tiết của người dùng đang đăng nhập, bao gồm sổ địa chỉ và 5 đơn hàng gần nhất.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Output (200 OK):**
  ```json
  {
    "data": {
      "id": 1,
      "name": "Haiduong",
      "email": "haiduong@gmail.com",
      "phone": "0987654321",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "address_books": [
        {
          "id": 1,
          "user_id": 1,
          "recipient_name": "Haiduong",
          "street_address": "123 ABC Street",
          "city": "Hanoi",
          "state_province": "Hanoi",
          "country": "Vietnam",
          "postal_code": "100000",
          "phone_number": "0987654321",
          "is_default": true,
          "created_at": "2024-01-01T00:00:00.000000Z",
          "updated_at": "2024-01-01T00:00:00.000000Z"
        }
      ],
      "orders": [
        {
          "id": 1,
          "user_id": 1,
          "total_price": 1500000,
          "payment_status": "paid",
          "created_at": "2024-07-20T10:00:00.000000Z"
        }
      ]
    }
  }
  ```
- **Output (401 Unauthorized):**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

</details>

<details>
<summary><strong>Cập nhật thông tin cá nhân</strong></summary>

- **Endpoint:** `PUT /api/profile`
- **Mô tả:** Cập nhật tên, email, số điện thoại của người dùng.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Input (JSON):**
  ```json
  {
    "name": "Haiduong New Name",
    "email": "newemail@example.com",
    "phone": "0123456789"
  }
  ```
- **Validation:**
  - `name`: `required|string|max:255`
  - `email`: `required|email|max:255|unique:users,email,{user_id}`
  - `phone`: `nullable|string|max:20`
- **Output (200 OK):**
  ```json
  {
    "message": "Profile updated successfully",
    "data": {
      "id": 1,
      "name": "Haiduong New Name",
      "email": "newemail@example.com",
      "phone": "0123456789"
    }
  }
  ```
- **Output (422 Unprocessable Entity):**
  ```json
  {
    "success": false,
    "message": "Validation errors",
    "errors": {
      "email": [
        "The email has already been taken."
      ]
    }
  }
  ```

</details>

<details>
<summary><strong>Thay đổi mật khẩu</strong></summary>

- **Endpoint:** `POST /api/change-password`
- **Mô tả:** Cho phép người dùng thay đổi mật khẩu sau khi cung cấp mật khẩu hiện tại.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Input (JSON):**
  ```json
  {
    "current_password": "old_password",
    "new_password": "new_strong_password",
    "new_password_confirmation": "new_strong_password"
  }
  ```
- **Validation:**
  - `current_password`: `required|string`
  - `new_password`: `required|string|min:6|confirmed`
- **Output (200 OK):**
  ```json
  {
    "message": "Password changed successfully"
  }
  ```
- **Output (422 Unprocessable Entity - Mật khẩu hiện tại sai):**
  ```json
  {
    "success": false,
    "message": "Mật khẩu hiện tại không đúng"
  }
  ```
- **Output (422 Unprocessable Entity - Validation):**
  ```json
  {
    "success": false,
    "message": "Validation errors",
    "errors": {
      "new_password": [
        "The new password confirmation does not match."
      ]
    }
  }
  ```

</details>

<details>
<summary><strong>Lấy thống kê người dùng</strong></summary>

- **Endpoint:** `GET /api/user-stats`
- **Mô tả:** Lấy các thống kê cơ bản của người dùng như tổng số đơn hàng, tổng chi tiêu, v.v.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Output (200 OK):**
  ```json
  {
    "data": {
      "total_orders": 10,
      "pending_orders": 2,
      "completed_orders": 8,
      "total_spent": "5500000.00",
      "total_comments": 15,
      "addresses_count": 3,
      "member_since": "2024-01-01"
    }
  }
  ```

</details>

<details>
<summary><strong>Xóa tài khoản</strong></summary>

- **Endpoint:** `DELETE /api/delete-account`
- **Mô tả:** Xóa tài khoản của người dùng. Yêu cầu xác thực bằng mật khẩu. Không thể xóa nếu người dùng có đơn hàng đang chờ xử lý (`pending`).
- **Phân quyền:** Người dùng đã đăng nhập.
- **Input (JSON):**
  ```json
  {
    "password": "current_password"
  }
  ```
- **Validation:**
  - `password`: `required|string`
- **Output (200 OK):**
  ```json
  {
    "message": "Account deleted successfully"
  }
  ```
- **Output (422 Unprocessable Entity - Mật khẩu sai):**
  ```json
  {
    "success": false,
    "message": "Mật khẩu không đúng"
  }
  ```
- **Output (422 Unprocessable Entity - Có đơn hàng pending):**
  ```json
  {
    "message": "Cannot delete account with pending orders"
  }
  ```

</details>

---

## 8. Address Book - Quản lý sổ địa chỉ

Các endpoint để người dùng quản lý sổ địa chỉ giao hàng.

**Yêu cầu chung:** Cần có `Authorization: Bearer <token>` trong header.

<details>
<summary><strong>Lấy danh sách địa chỉ</strong></summary>

- **Endpoint:** `GET /api/address-books`
- **Mô tả:** Lấy danh sách tất cả địa chỉ của người dùng đang đăng nhập. Địa chỉ mặc định luôn được xếp lên đầu.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 2,
        "user_id": 1,
        "name": "Haiduong Home",
        "phone": "0987654321",
        "address": "123 ABC Street",
        "province": "Hanoi",
        "district": "Cau Giay",
        "ward": "Dich Vong Hau",
        "is_default": true,
        "created_at": "2024-07-21T12:00:00.000000Z",
        "updated_at": "2024-07-21T12:05:00.000000Z"
      },
      {
        "id": 1,
        "user_id": 1,
        "name": "Haiduong Office",
        "phone": "0123456789",
        "address": "456 XYZ Building",
        "province": "Hanoi",
        "district": "Ba Dinh",
        "ward": "Lieu Giai",
        "is_default": false,
        "created_at": "2024-07-20T10:00:00.000000Z",
        "updated_at": "2024-07-20T10:00:00.000000Z"
      }
    ],
    "total": 2
  }
  ```

</details>

<details>
<summary><strong>Thêm địa chỉ mới</strong></summary>

- **Endpoint:** `POST /api/address-books`
- **Mô tả:** Tạo một địa chỉ mới. Nếu đặt `is_default` là `true`, các địa chỉ khác của người dùng sẽ tự động được bỏ trạng thái mặc định.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Input (JSON):**
  ```json
  {
    "name": "My Friend's House",
    "phone": "0911223344",
    "address": "789 QWE Road",
    "province": "Ho Chi Minh City",
    "district": "District 1",
    "ward": "Ben Nghe",
    "is_default": false
  }
  ```
- **Validation (`AddressBookRequest`):**
  - `name`: `required|string|max:100|min:2`
  - `phone`: `required|string|max:10|min:10|regex:/^[0-9...]+$/`
  - `address`: `required|string|max:500|min:10`
  - `province`, `district`, `ward`: `required|string|max:100`
  - `is_default`: `sometimes|boolean`
- **Output (201 Created):**
  ```json
  {
    "success": true,
    "message": "Địa chỉ đã được tạo thành công",
    "data": {
      "id": 3,
      "user_id": 1,
      "name": "My Friend's House",
      "phone": "0911223344",
      "address": "789 QWE Road",
      "province": "Ho Chi Minh City",
      "district": "District 1",
      "ward": "Ben Nghe",
      "is_default": false,
      "created_at": "2024-07-22T08:00:00.000000Z",
      "updated_at": "2024-07-22T08:00:00.000000Z"
    }
  }
  ```
- **Output (422 Unprocessable Entity):** (Xem `messages` trong `AddressBookRequest` để biết chi tiết lỗi tiếng Việt)

</details>

<details>
<summary><strong>Xem chi tiết địa chỉ</strong></summary>

- **Endpoint:** `GET /api/address-books/{addressBook}`
- **Mô tả:** Lấy thông tin chi tiết của một địa chỉ cụ thể.
- **Phân quyền:** Người dùng đã đăng nhập (chỉ được xem địa chỉ của chính mình).
- **Tham số:**
  - `addressBook` (integer, required): ID của địa chỉ.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "user_id": 1,
      "name": "Haiduong Home",
      "phone": "0987654321",
      "address": "123 ABC Street",
      "province": "Hanoi",
      "district": "Cau Giay",
      "ward": "Dich Vong Hau",
      "is_default": true
    }
  }
  ```
- **Output (403 Forbidden):**
  ```json
  {
    "success": false,
    "message": "Forbidden"
  }
  ```

</details>

<details>
<summary><strong>Cập nhật địa chỉ</strong></summary>

- **Endpoint:** `PUT /api/address-books/{addressBook}`
- **Mô tả:** Cập nhật thông tin của một địa chỉ. Logic xử lý `is_default` tương tự như khi tạo mới.
- **Phân quyền:** Người dùng đã đăng nhập (chỉ được cập nhật địa chỉ của chính mình).
- **Tham số:**
  - `addressBook` (integer, required): ID của địa chỉ.
- **Input (JSON):** (Các trường tương tự như khi tạo mới)
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Địa chỉ đã được cập nhật thành công",
    "data": { ... } // Dữ liệu địa chỉ sau khi cập nhật
  }
  ```
- **Output (403 Forbidden):**
  ```json
  {
    "message": "Forbidden"
  }
  ```

</details>

<details>
<summary><strong>Xóa địa chỉ</strong></summary>

- **Endpoint:** `DELETE /api/address-books/{addressBook}`
- **Mô tả:** Xóa một địa chỉ. Không thể xóa nếu địa chỉ đang được dùng trong đơn hàng chưa hoàn thành. Nếu xóa địa chỉ mặc định, địa chỉ tiếp theo (nếu có) sẽ được tự động gán làm mặc định.
- **Phân quyền:** Người dùng đã đăng nhập (chỉ được xóa địa chỉ của chính mình).
- **Tham số:**
  - `addressBook` (integer, required): ID của địa chỉ.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Địa chỉ đã được xóa thành công"
  }
  ```
- **Output (403 Forbidden):**
  ```json
  {
    "success": false,
    "message": "Forbidden"
  }
  ```
- **Output (422 Unprocessable Entity):**
  ```json
  {
    "success": false,
    "message": "Không thể xóa địa chỉ đang được sử dụng trong đơn hàng chưa hoàn thành"
  }
  ```

</details>

<details>
<summary><strong>Đặt làm địa chỉ mặc định</strong></summary>

- **Endpoint:** `POST /api/address-books/{addressBook}/set-default`
- **Mô tả:** Đặt một địa chỉ làm địa chỉ giao hàng mặc định. Địa chỉ mặc định cũ sẽ bị bỏ trạng thái này.
- **Phân quyền:** Người dùng đã đăng nhập (chỉ được thao tác trên địa chỉ của chính mình).
- **Tham số:**
  - `addressBook` (integer, required): ID của địa chỉ muốn đặt làm mặc định.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Địa chỉ mặc định đã được cập nhật"
  }
  ```
- **Output (403 Forbidden):**
  ```json
  {
    "success": false,
    "message": "Forbidden"
  }
  ```

</details>

---

## 9. Orders - Quản lý đơn hàng

Các endpoint để người dùng tạo, xem, hủy và thống kê đơn hàng của mình.

**Yêu cầu chung:** Cần có `Authorization: Bearer <token>` trong header.

<details>
<summary><strong>Tạo đơn hàng mới</strong></summary>

- **Endpoint:** `POST /api/orders`
- **Mô tả:** Tạo một đơn hàng mới từ các sản phẩm trong giỏ hàng. Hệ thống sẽ kiểm tra số lượng sản phẩm, tính toán tổng tiền, áp dụng voucher và giảm số lượng sản phẩm trong kho.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Input (JSON):**
  ```json
  {
    "address_id": 1,
    "payment_method_id": 1,
    "voucher_id": 2,
    "comment": "Giao hàng cẩn thận nhé!",
    "items": [
      {
        "product_id": 10,
        "quantity": 2
      },
      {
        "product_id": 15,
        "quantity": 1
      }
    ]
  }
  ```
- **Validation (`OrderRequest`):**
  - `address_id`: `required|exists:address_books,id` (phải là địa chỉ của user)
  - `payment_method_id`: `required|exists:payment_methods,id`
  - `voucher_id`: `nullable|exists:vouchers,id`
  - `comment`: `nullable|string|max:500`
  - `items`: `required|array|min:1`
  - `items.*.product_id`: `required|exists:products,id`
  - `items.*.quantity`: `required|integer|min:1`
- **Output (201 Created):**
  ```json
  {
    "message": "Đặt hàng thành công",
    "data": {
      "id": 5,
      "user_id": 1,
      "address_id": 1,
      "payment_method_id": 1,
      "voucher_id": 2,
      "total_price": "2550000.00", // Giá sau khi đã trừ voucher
      "payment_status": "pending",
      "created_at": "2024-07-22T10:00:00.000000Z",
      "updated_at": "2024-07-22T10:00:00.000000Z",
      "address": { ... },
      "payment_method": { ... },
      "voucher": { ... },
      "order_details": [
        {
          "product_id": 10,
          "quantity": 2,
          "price": "1200000.00",
          "product": { ... }
        },
        {
          "product_id": 15,
          "quantity": 1,
          "price": "250000.00",
          "product": { ... }
        }
      ]
    }
  }
  ```
- **Output (400 Bad Request):**
  - `{"message": "Sản phẩm XYZ không đủ số lượng. Còn lại: 5"}`
  - `{"message": "Voucher đã hết hạn"}`
  - `{"message": "Voucher không tồn tại"}`
- **Output (403 Forbidden):**
  - `{"message": "Địa chỉ không thuộc về bạn"}`

</details>

<details>
<summary><strong>Lấy danh sách đơn hàng</strong></summary>

- **Endpoint:** `GET /api/orders`
- **Mô tả:** Lấy danh sách các đơn hàng của người dùng, có phân trang. Có thể lọc theo trạng thái thanh toán.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Query Params:**
  - `page` (integer, optional): Số trang (mặc định: 1).
  - `payment_status` (string, optional): Lọc theo trạng thái (`pending`, `paid`, `failed`).
- **Output (200 OK):** (Dữ liệu trả về theo cấu trúc của Laravel Paginator)
  ```json
  {
    "current_page": 1,
    "data": [
      { ... } // Chi tiết đơn hàng, tương tự output khi tạo mới
    ],
    "first_page_url": "/api/orders?page=1",
    "from": 1,
    "last_page": 3,
    "last_page_url": "/api/orders?page=3",
    "links": [ ... ],
    "next_page_url": "/api/orders?page=2",
    "path": "/api/orders",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 30
  }
  ```

</details>

<details>
<summary><strong>Xem chi tiết đơn hàng</strong></summary>

- **Endpoint:** `GET /api/orders/{order}`
- **Mô tả:** Lấy thông tin chi tiết của một đơn hàng cụ thể.
- **Phân quyền:** Người dùng đã đăng nhập (chỉ được xem đơn hàng của chính mình).
- **Tham số:**
  - `order` (integer, required): ID của đơn hàng.
- **Output (200 OK):**
  ```json
  {
    "data": { ... } // Chi tiết đơn hàng, tương tự output khi tạo mới
  }
  ```
- **Output (403 Forbidden):**
  ```json
  {
    "message": "Bạn không có quyền xem đơn hàng này"
  }
  ```

</details>

<details>
<summary><strong>Hủy đơn hàng</strong></summary>

- **Endpoint:** `POST /api/orders/{order}/cancel`
- **Mô tả:** Hủy một đơn hàng. Chỉ có thể hủy các đơn hàng có trạng thái là `pending`. Khi hủy, số lượng sản phẩm và voucher (nếu có) sẽ được hoàn trả.
- **Phân quyền:** Người dùng đã đăng nhập (chỉ được hủy đơn hàng của chính mình).
- **Tham số:**
  - `order` (integer, required): ID của đơn hàng.
- **Output (200 OK):**
  ```json
  {
    "message": "Hủy đơn hàng thành công"
  }
  ```
- **Output (400 Bad Request):**
  ```json
  {
    "message": "Chỉ có thể hủy đơn hàng đang chờ xử lý"
  }
  ```
- **Output (403 Forbidden):**
  ```json
  {
    "message": "Bạn không có quyền hủy đơn hàng này"
  }
  ```

</details>

<details>
<summary><strong>Lấy thống kê đơn hàng</strong></summary>

- **Endpoint:** `GET /api/orders-stats`
- **Mô tả:** Lấy thống kê về các đơn hàng của người dùng.
- **Phân quyền:** Người dùng đã đăng nhập.
- **Output (200 OK):**
  ```json
  {
    "data": {
      "total_orders": 15,
      "pending_orders": 2,
      "paid_orders": 12,
      "failed_orders": 1,
      "total_spent": "12500000.00"
    }
  }
  ```

</details>

### [Admin/Contributor] Quản lý đơn hàng

<details>
<summary><strong>Lấy danh sách tất cả đơn hàng (Admin)</strong></summary>

- **Endpoint:** `GET /api/admin/orders`
- **Mô tả:** Lấy danh sách tất cả các đơn hàng trong hệ thống với khả năng lọc và tìm kiếm.
- **Phân quyền:** `Admin` / `Contributor`.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **Query Params:**
  - `page` (integer, optional): Số trang (mặc định: 1).
  - `per_page` (integer, optional): Số mục mỗi trang (mặc định: 15).
  - `payment_status` (string, optional): Lọc theo trạng thái thanh toán (`pending`, `paid`, `failed`).
  - `user_id` (integer, optional): Lọc theo ID người dùng.
  - `search` (string, optional): Tìm kiếm theo tên người dùng hoặc email.
- **Output (200 OK):** (Dữ liệu Paginator tương tự user orders)

</details>

<details>
<summary><strong>Cập nhật trạng thái đơn hàng (Admin)</strong></summary>

- **Endpoint:** `PUT /api/orders/{order}/status`
- **Mô tả:** Cập nhật trạng thái thanh toán của một đơn hàng.
- **Phân quyền:** `Admin` / `Contributor`.
- **Headers:**
  - `Authorization: Bearer your_jwt_token`
- **URL Params:**
    - `order` (integer, required): ID của đơn hàng.
- **Input (JSON):**
  ```json
  {
    "payment_status": "paid"
  }
  ```
- **Validation:**
  - `payment_status`: `required|in:pending,paid,failed`
- **Output (200 OK):**
  ```json
  {
    "message": "Order status updated successfully",
    "data": {
      "id": 5,
      "payment_status": "paid",
      "updated_at": "2024-07-22T12:00:00.000000Z"
    }
  }
  ```

</details>

---

## 10. News - Tin tức

Các endpoint công khai để lấy thông tin về tin tức, bài viết.

<details>
<summary><strong>Lấy danh sách tin tức</strong></summary>

- **Endpoint:** `GET /api/news`
- **Mô tả:** Lấy danh sách tin tức, có phân trang và tìm kiếm theo tiêu đề.
- **Phân quyền:** Bất kỳ ai.
- **Query Params:**
  - `page` (integer, optional): Số trang (mặc định: 1).
  - `per_page` (integer, optional): Số mục mỗi trang (mặc định: 10).
  - `search` (string, optional): Từ khóa tìm kiếm trong tiêu đề tin tức.
- **Output (200 OK):** (Dữ liệu trả về theo cấu trúc của Laravel Paginator)
  ```json
  {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Chào hè rực rỡ - Sale up to 50%",
        "content": "Nội dung chi tiết của bài viết...",
        "image_url": "/images/news/sale-he.jpg",
        "created_at": "2024-07-20T10:00:00.000000Z"
      }
    ],
    "total": 5
    // ... các thông tin phân trang khác
  }
  ```

</details>

<details>
<summary><strong>Xem chi tiết tin tức</strong></summary>

- **Endpoint:** `GET /api/news/{news}`
- **Mô tả:** Lấy thông tin chi tiết của một bài viết.
- **Phân quyền:** Bất kỳ ai.
- **Tham số:**
  - `news` (integer, required): ID của bài viết.
- **Output (200 OK):**
```json
{
    "data": {
        "id": 1,
        "title": "Chào hè rực rỡ - Sale up to 50%",
        "content": "Nội dung chi tiết của bài viết...",
        "image_url": "/images/news/sale-he.jpg",
        "created_at": "2024-07-20T10:00:00.000000Z",
        "updated_at": "2024-07-20T10:00:00.000000Z"
    }
}
```

</details>

<details>
<summary><strong>Lấy tin tức mới nhất</strong></summary>

- **Endpoint:** `GET /api/news-latest`
- **Mô tả:** Lấy 6 bài viết mới nhất.
- **Phân quyền:** Bất kỳ ai.
- **Output (200 OK):**
  ```json
  {
    "data": [ ... ] // 6 bài viết mới nhất
  }
  ```

</details>

---

## 11. Contact - Liên hệ

Các endpoint để người dùng gửi liên hệ và admin quản lý.

<details>
<summary><strong>Gửi liên hệ mới</strong></summary>

- **Endpoint:** `POST /api/contacts`
- **Mô tả:** Cho phép bất kỳ ai gửi một tin nhắn liên hệ đến hệ thống.
- **Phân quyền:** Bất kỳ ai.
- **Input (JSON):**
  ```json
  {
    "fullname": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "message": "Tôi cần hỗ trợ về vấn đề ABC..."
  }
  ```
- **Validation:**
  - `fullname`: `required|string|max:255`
  - `email`: `required|email|max:255`
  - `message`: `required|string|min:10|max:1000`
- **Output (201 Created):**
  ```json
  {
    "success": true,
    "message": "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
    "data": {
      "id": 1,
      "fullname": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "message": "Tôi cần hỗ trợ về vấn đề ABC...",
      "status": "pending",
      "created_at": "2024-07-22T11:00:00.000000Z",
      "updated_at": "2024-07-22T11:00:00.000000Z"
    }
  }
  ```
- **Output (422 Unprocessable Entity):**
  ```json
  {
    "success": false,
    "message": "Validation errors",
    "errors": { ... }
  }
  ```

</details>

<details>
<summary><strong>[Admin] Lấy danh sách liên hệ</strong></summary>

- **Endpoint:** `GET /api/contacts`
- **Mô tả:** Lấy danh sách tất cả các liên hệ đã gửi, có phân trang, lọc và tìm kiếm.
- **Phân quyền:** `Admin` / `Contributor`.
- **Query Params:**
  - `page` (integer, optional): Số trang.
  - `per_page` (integer, optional): Số mục mỗi trang (mặc định: 15).
  - `status` (string, optional): Lọc theo trạng thái (`pending`, `replied`, `closed`).
  - `search` (string, optional): Tìm theo tên hoặc email.
- **Output (200 OK):** (Dữ liệu Paginator)

</details>

<details>
<summary><strong>[Admin] Xem chi tiết liên hệ</strong></summary>

- **Endpoint:** `GET /api/contacts/{contact}`
- **Mô tả:** Xem chi tiết một liên hệ.
- **Phân quyền:** `Admin` / `Contributor`.
- **Tham số:**
  - `contact` (integer, required): ID của liên hệ.
- **Output (200 OK):** (Dữ liệu chi tiết của contact)

</details>

---

## 12. Sale Campaigns - Chương trình khuyến mãi

Các endpoint để quản lý và hiển thị các chương trình khuyến mãi.

<details>
<summary><strong>Lấy danh sách chương trình khuyến mãi (Public & Admin)</strong></summary>

- **Endpoint:** `GET /api/sale-campaigns`
- **Mô tả:** Lấy danh sách các chương trình khuyến mãi với nhiều tùy chọn lọc và sắp xếp.
- **Phân quyền:** Bất kỳ ai (với bộ lọc public), Admin/Contributor (để xem tất cả và các trạng thái khác).
- **Query Params:**
  - `page`, `per_page`: Phân trang.
  - `status` (string, optional): Lọc theo trạng thái (`active`, `inactive`, `scheduled`).
  - `active` (boolean, optional): Chỉ lấy các chiến dịch đang hoạt động (`true`).
  - `featured` (boolean, optional): Chỉ lấy các chiến dịch nổi bật (`true`).
  - `search` (string, optional): Tìm theo tên chiến dịch.
  - `sort_by` (string, optional): Sắp xếp theo (`priority`, `start_date`, `end_date`). Mặc định: `priority`.
  - `sort_order` (string, optional): `asc` hoặc `desc`. Mặc định: `desc`.
- **Output (200 OK):** (Dữ liệu Paginator)
  ```json
  {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Siêu Sale Hè 2024",
        "description": "Giảm giá cực sốc cho các sản phẩm balo du lịch.",
        "start_date": "2024-07-01T00:00:00.000000Z",
        "end_date": "2024-07-31T23:59:59.000000Z",
        "status": "active",
        "is_featured": true,
        "priority": 10,
        "sale_products": [
          { ... } // danh sách sản phẩm trong campaign
        ]
      }
    ],
    // ... thông tin phân trang khác
  }
  ```

</details>

<details>
<summary><strong>Xem chi tiết chương trình khuyến mãi</strong></summary>

- **Endpoint:** `GET /api/sale-campaigns/{saleCampaign}`
- **Mô tả:** Lấy thông tin chi tiết của một chương trình, bao gồm danh sách sản phẩm được áp dụng.
- **Phân quyền:** Bất kỳ ai.
- **Tham số:**
  - `saleCampaign` (integer, required): ID của chương trình.
- **Output (200 OK):**
  ```json
  {
    "data": { ... } // Dữ liệu chi tiết của campaign, tương tự như trong danh sách
  }
  ```

</details>

<details>
<summary><strong>Lấy các chương trình đang hoạt động</strong></summary>

- **Endpoint:** `GET /api/sale-campaigns-active`
- **Mô tả:** Lấy danh sách tất cả các chương trình đang trong thời gian diễn ra và có trạng thái `active`.
- **Phân quyền:** Bất kỳ ai.
- **Output (200 OK):**
  ```json
  {
    "data": [ ... ] // Mảng các object campaign
  }
  ```

</details>

<details>
<summary><strong>Lấy các chương trình nổi bật</strong></summary>

- **Endpoint:** `GET /api/sale-campaigns-featured`
- **Mô tả:** Lấy tối đa 5 chương trình nổi bật (`is_featured = true`) và đang hoạt động.
- **Phân quyền:** Bất kỳ ai.
- **Output (200 OK):**
  ```json
  {
    "data": [ ... ] // Mảng các object campaign nổi bật
  }
  ```

</details>

<details>
<summary><strong>Lấy sản phẩm trong chương trình khuyến mãi</strong></summary>

- **Endpoint:** `GET /api/sale-campaigns/{saleCampaign}/products`
- **Mô tả:** Lấy danh sách các sản phẩm thuộc một chương trình khuyến mãi cụ thể, có phân trang và bộ lọc.
- **Phân quyền:** Bất kỳ ai.
- **Tham số:**
  - `saleCampaign` (integer, required): ID của chương trình.
- **Query Params:**
  - `page`, `per_page`: Phân trang (mặc định 12 sản phẩm/trang).
  - `category_id`, `brand_id`: Lọc theo danh mục, thương hiệu.
  - `search`: Tìm kiếm theo tên, mô tả sản phẩm.
  - `sort_by`: Sắp xếp (`discount` - theo % giảm giá, `name`).
- **Output (200 OK):** (Dữ liệu Paginator của sản phẩm)

</details>

<details>
<summary><strong>[Admin] Tạo chương trình khuyến mãi</strong></summary>

- **Endpoint:** `POST /api/sale-campaigns`
- **Mô tả:** Tạo một chương trình khuyến mãi mới.
- **Phân quyền:** `Admin` / `Contributor`.
- **Input (JSON) (`SaleCampaignRequest`):**
  ```json
  {
    "name": "Khuyến mãi 30/4",
    "description": "Mừng đại lễ, giảm giá toàn bộ cửa hàng.",
    "start_date": "2025-04-25T00:00:00",
    "end_date": "2025-05-02T23:59:59",
    "status": "scheduled",
    "is_featured": false,
    "priority": 5
  }
  ```
- **Output (201 Created):**
  ```json
  {
    "message": "Sale campaign created successfully",
    "data": { ... } // Dữ liệu campaign vừa tạo
  }
  ```

</details>

<details>
<summary><strong>[Admin] Cập nhật chương trình khuyến mãi</strong></summary>

- **Endpoint:** `PUT /api/sale-campaigns/{saleCampaign}`
- **Mô tả:** Cập nhật thông tin của chương trình.
- **Phân quyền:** `Admin` / `Contributor`.
- **Input (JSON):** (Tương tự khi tạo mới)
- **Output (200 OK):**
  ```json
  {
    "message": "Sale campaign updated successfully",
    "data": { ... } // Dữ liệu campaign sau khi cập nhật
  }
  ```

</details>

<details>
<summary><strong>[Admin] Xóa chương trình khuyến mãi</strong></summary>

- **Endpoint:** `DELETE /api/sale-campaigns/{saleCampaign}`
- **Mô tả:** Xóa một chương trình khuyến mãi. Các sản phẩm liên quan trong `sale_products` cũng sẽ bị xóa.
- **Phân quyền:** `Admin` / `Contributor`.
- **Output (200 OK):**
  ```json
  {
    "message": "Sale campaign deleted successfully"
  }
  ```

</details>

<details>
<summary><strong>[Admin] Thêm/Cập nhật sản phẩm vào chương trình</strong></summary>

- **Endpoint:** `POST /api/sale-campaigns/{saleCampaign}/add-products`
- **Mô tả:** Thêm một hoặc nhiều sản phẩm vào chương trình với giá sale cụ thể. Nếu sản phẩm đã tồn tại, thông tin sale sẽ được cập nhật.
- **Phân quyền:** `Admin` / `Contributor`.
- **Input (JSON):**
  ```json
  {
    "products": [
      {
        "product_id": 10,
        "sale_price": 999000,
        "discount_type": "fixed_amount", // or 'percentage'
        "max_quantity": 50 // số lượng tối đa được bán trong campaign
      },
      {
        "product_id": 12,
        "sale_price": 450000
      }
    ]
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "message": "Products added/updated in sale campaign successfully"
  }
  ```

</details>

<details>
<summary><strong>[Admin] Xóa sản phẩm khỏi chương trình</strong></summary>

- **Endpoint:** `DELETE /api/sale-campaigns/{saleCampaign}/remove-products`
- **Mô tả:** Xóa một hoặc nhiều sản phẩm khỏi chương trình khuyến mãi.
- **Phân quyền:** `Admin` / `Contributor`.
- **Input (JSON):**
  ```json
  {
    "product_ids": [10, 12]
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "message": "Products removed from sale campaign successfully"
  }
  ```

</details>

---

## 13. [Admin] Roles - Quản lý vai trò

Các endpoint để quản lý vai trò và phân quyền cho người dùng. Yêu cầu quyền `Admin`.

**Yêu cầu chung:** Cần có `Authorization: Bearer <token>` trong header.

<details>
<summary><strong>Lấy danh sách vai trò</strong></summary>

- **Endpoint:** `GET /api/admin/roles`
- **Mô tả:** Lấy danh sách tất cả các vai trò trong hệ thống và đếm số lượng người dùng thuộc mỗi vai trò.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "admin",
        "display_name": "Quản trị viên",
        "description": "Có toàn quyền truy cập hệ thống.",
        "users_count": 1
      },
      {
        "id": 2,
        "name": "contributor",
        "display_name": "Biên tập viên",
        "description": "Có quyền quản lý sản phẩm, bài viết.",
        "users_count": 5
      }
    ]
  }
  ```

</details>

<details>
<summary><strong>Tạo vai trò mới</strong></summary>

- **Endpoint:** `POST /api/admin/roles`
- **Mô tả:** Tạo một vai trò mới.
- **Input (JSON):**
  ```json
  {
    "name": "manager",
    "display_name": "Quản lý",
    "description": "Quản lý đơn hàng và khách hàng."
  }
  ```
- **Validation:**
  - `name`: `required|string|unique:roles,name`
- **Output (201 Created):**
  ```json
  {
    "success": true,
    "message": "Role created successfully",
    "data": { ... } // Dữ liệu vai trò vừa tạo
  }
  ```

</details>

<details>
<summary><strong>Cập nhật vai trò</strong></summary>

- **Endpoint:** `PUT /api/admin/roles/{id}`
- **Mô tả:** Cập nhật thông tin của một vai trò.
- **Input (JSON):** (Tương tự tạo mới)
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Role updated successfully",
    "data": { ... } // Dữ liệu vai trò sau khi cập nhật
  }
  ```

</details>

<details>
<summary><strong>Xóa vai trò</strong></summary>

- **Endpoint:** `DELETE /api/admin/roles/{id}`
- **Mô tả:** Xóa một vai trò. Không thể xóa nếu vai trò đang được gán cho bất kỳ người dùng nào.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Role deleted successfully"
  }
  ```
- **Output (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Cannot delete role that is assigned to users"
  }
  ```

</details>

<details>
<summary><strong>Gán vai trò cho người dùng</strong></summary>

- **Endpoint:** `POST /api/roles/assign`
- **Mô tả:** Gán một vai trò cho một người dùng.
- **Input (JSON):**
  ```json
  {
    "user_id": 10,
    "role_name": "contributor"
  }
  ```
- **Validation:**
  - `user_id`: `required|exists:users,id`
  - `role_name`: `required|exists:roles,name`
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Role assigned successfully"
  }
  ```

</details>

<details>
<summary><strong>Xóa vai trò khỏi người dùng</strong></summary>

- **Endpoint:** `POST /api/roles/remove`
- **Mô tả:** Xóa một vai trò khỏi một người dùng.
- **Input (JSON):**
  ```json
  {
    "user_id": 10,
    "role_name": "contributor"
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Role removed successfully"
  }
  ```

</details>

---

## 14. Payment Methods - Phương thức thanh toán

Các endpoint để quản lý phương thức thanh toán. Endpoint công khai cho phép frontend lấy danh sách các phương thức thanh toán khả dụng.

<details>
<summary><strong>Lấy danh sách tất cả phương thức thanh toán</strong></summary>

- **Endpoint:** `GET /api/payment-methods`
- **Mô tả:** Lấy danh sách tất cả các phương thức thanh toán trong hệ thống.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "cash_on_delivery",
        "display_name": "Thanh toán khi nhận hàng",
        "status": "active",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T12:00:00.000000Z"
      },
      {
        "id": 2,
        "name": "bank_transfer",
        "display_name": "Chuyển khoản ngân hàng",
        "status": "active",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T12:00:00.000000Z"
      },
      {
        "id": 3,
        "name": "credit_card",
        "display_name": "Thẻ tín dụng",
        "status": "inactive",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T12:00:00.000000Z"
      }
    ],
    "message": "Payment methods retrieved successfully"
  }
  ```

</details>

<details>
<summary><strong>Lấy danh sách phương thức thanh toán đang hoạt động</strong></summary>

- **Endpoint:** `GET /api/payment-methods-active`
- **Mô tả:** Lấy danh sách các phương thức thanh toán đang hoạt động (status = 'active'). Đây là endpoint quan trọng nhất cho frontend khi hiển thị các lựa chọn thanh toán cho khách hàng.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "cash_on_delivery",
        "display_name": "Thanh toán khi nhận hàng",
        "status": "active",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T12:00:00.000000Z"
      },
      {
        "id": 2,
        "name": "bank_transfer",
        "display_name": "Chuyển khoản ngân hàng",
        "status": "active",
        "created_at": "2025-07-04T12:00:00.000000Z",
        "updated_at": "2025-07-04T12:00:00.000000Z"
      }
    ],
    "message": "Active payment methods retrieved successfully"
  }
  ```

</details>

<details>
<summary><strong>Lấy thông tin chi tiết một phương thức thanh toán</strong></summary>

- **Endpoint:** `GET /api/payment-methods/{id}`
- **Mô tả:** Lấy thông tin chi tiết của một phương thức thanh toán cụ thể.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "cash_on_delivery",
      "display_name": "Thanh toán khi nhận hàng",
      "status": "active",
      "created_at": "2025-07-04T12:00:00.000000Z",
      "updated_at": "2025-07-04T12:00:00.000000Z"
    },
    "message": "Payment method retrieved successfully"
  }
  ```

</details>

### [Admin/Contributor] Quản lý phương thức thanh toán

Các endpoint sau yêu cầu quyền `Admin` hoặc `Contributor` và cần có `Authorization: Bearer <token>` trong header.

<details>
<summary><strong>Tạo phương thức thanh toán mới</strong></summary>

- **Endpoint:** `POST /api/payment-methods`
- **Mô tả:** Tạo một phương thức thanh toán mới.
- **Input (JSON):**
  ```json
  {
    "name": "e_wallet",
    "display_name": "Ví điện tử",
    "status": "active"
  }
  ```
- **Validation:**
  - `name`: `required|string|max:255|unique:payment_methods`
  - `display_name`: `required|string|max:255`
  - `status`: `required|in:active,inactive`
- **Output (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 4,
      "name": "e_wallet",
      "display_name": "Ví điện tử",
      "status": "active",
      "created_at": "2025-07-04T12:00:00.000000Z",
      "updated_at": "2025-07-04T12:00:00.000000Z"
    },
    "message": "Payment method created successfully"
  }
  ```

</details>

<details>
<summary><strong>Cập nhật phương thức thanh toán</strong></summary>

- **Endpoint:** `PUT /api/payment-methods/{id}`
- **Mô tả:** Cập nhật thông tin của một phương thức thanh toán.
- **Input (JSON):**
  ```json
  {
    "display_name": "Ví điện tử MoMo",
    "status": "inactive"
  }
  ```
- **Validation:**
  - `name`: `sometimes|required|string|max:255|unique:payment_methods,name,{id}`
  - `display_name`: `sometimes|required|string|max:255`
  - `status`: `sometimes|required|in:active,inactive`
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 4,
      "name": "e_wallet",
      "display_name": "Ví điện tử MoMo",
      "status": "inactive",
      "created_at": "2025-07-04T12:00:00.000000Z",
      "updated_at": "2025-07-04T12:00:00.000000Z"
    },
    "message": "Payment method updated successfully"
  }
  ```

</details>

<details>
<summary><strong>Xóa phương thức thanh toán</strong></summary>

- **Endpoint:** `DELETE /api/payment-methods/{id}`
- **Mô tả:** Xóa một phương thức thanh toán. Không thể xóa nếu phương thức thanh toán đang được sử dụng trong các đơn hàng.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Payment method deleted successfully"
  }
  ```
- **Output (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Cannot delete payment method that is being used in orders"
  }
  ```

</details>

---

## 15. [Admin] User Management - Quản lý người dùng

Các endpoint để quản lý người dùng trong hệ thống. Yêu cầu quyền `Admin`.

**Yêu cầu chung:** Cần có `Authorization: Bearer <token>` trong header.

<details>
<summary><strong>Lấy danh sách người dùng</strong></summary>

- **Endpoint:** `GET /api/admin/users`
- **Mô tả:** Lấy danh sách tất cả người dùng trong hệ thống với khả năng tìm kiếm và lọc.
- **Phân quyền:** `Admin`.
- **Query Params:**
  - `page` (integer, optional): Số trang (mặc định: 1).
  - `per_page` (integer, optional): Số mục mỗi trang (mặc định: 15).
  - `search` (string, optional): Tìm kiếm theo tên hoặc email.
  - `status` (string, optional): Lọc theo trạng thái (`active`, `inactive`).
- **Output (200 OK):** (Dữ liệu Paginator)
  ```json
  {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "phone": "0123456789",
        "status": "active",
        "created_at": "2024-01-01T00:00:00.000000Z",
        "roles": [
          {
            "id": 2,
            "name": "user",
            "display_name": "Người dùng"
          }
        ]
      }
    ]
  }
  ```

</details>

<details>
<summary><strong>Cập nhật thông tin người dùng</strong></summary>

- **Endpoint:** `PUT /api/admin/users/{user}`
- **Mô tả:** Cập nhật thông tin của một người dùng.
- **Phân quyền:** `Admin`.
- **URL Params:**
    - `user` (integer, required): ID của người dùng.
- **Input (JSON):**
  ```json
  {
    "name": "Tên mới",
    "email": "email_moi@example.com",
    "phone": "0987654321",
    "status": "inactive"
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": { ... } // Dữ liệu người dùng sau khi cập nhật
  }
  ```

</details>

<details>
<summary><strong>Xóa người dùng</strong></summary>

- **Endpoint:** `DELETE /api/admin/users/{user}`
- **Mô tả:** Xóa một người dùng khỏi hệ thống.
- **Phân quyền:** `Admin`.
- **URL Params:**
    - `user` (integer, required): ID của người dùng.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

</details>

<details>
<summary><strong>Chuyển đổi trạng thái người dùng</strong></summary>

- **Endpoint:** `POST /api/admin/users/{user}/toggle-status`
- **Mô tả:** Chuyển đổi trạng thái active/inactive của người dùng.
- **Phân quyền:** `Admin`.
- **URL Params:**
    - `user` (integer, required): ID của người dùng.
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "User status toggled successfully",
    "data": {
      "id": 1,
      "status": "inactive"
    }
  }
  ```

</details>

---

## 16. [Admin] Contact Management - Quản lý liên hệ

Các endpoint để quản lý các tin nhắn liên hệ từ khách hàng. Yêu cầu quyền `Admin` hoặc `Contributor`.

**Yêu cầu chung:** Cần có `Authorization: Bearer <token>` trong header.

<details>
<summary><strong>Lấy danh sách liên hệ (Admin)</strong></summary>

- **Endpoint:** `GET /api/admin/contacts`
- **Mô tả:** Lấy danh sách tất cả các tin nhắn liên hệ với khả năng tìm kiếm và lọc.
- **Phân quyền:** `Admin` / `Contributor`.
- **Query Params:**
  - `page` (integer, optional): Số trang (mặc định: 1).
  - `per_page` (integer, optional): Số mục mỗi trang (mặc định: 15).
  - `status` (string, optional): Lọc theo trạng thái (`pending`, `replied`, `closed`).
  - `search` (string, optional): Tìm kiếm theo tên hoặc email.
- **Output (200 OK):** (Dữ liệu Paginator)
  ```json
  {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "fullname": "Nguyễn Văn A",
        "email": "contact@example.com",
        "message": "Tôi cần hỗ trợ về sản phẩm...",
        "status": "pending",
        "created_at": "2024-07-22T11:00:00.000000Z"
      }
    ]
  }
  ```

</details>

---

## 17. Sale Campaign Product Management - Quản lý sản phẩm trong chương trình khuyến mãi

Các endpoint để quản lý sản phẩm trong chương trình khuyến mãi. Yêu cầu quyền `Admin` hoặc `Contributor`.

**Yêu cầu chung:** Cần có `Authorization: Bearer <token>` trong header.

<details>
<summary><strong>[Admin] Xóa sản phẩm cụ thể khỏi chương trình</strong></summary>

- **Endpoint:** `DELETE /api/sale-campaigns/{saleCampaign}/products/{product}`
- **Mô tả:** Xóa một sản phẩm cụ thể khỏi chương trình khuyến mãi.
- **Phân quyền:** `Admin` / `Contributor`.
- **URL Params:**
    - `saleCampaign` (integer, required): ID của chương trình khuyến mãi.
    - `product` (integer, required): ID của sản phẩm cần xóa.
- **Output (200 OK):**
  ```json
  {
    "message": "Product removed from sale campaign successfully"
  }
  ```

</details>

---

## Tổng kết và Lưu ý chung

### 1. Authentication
- Hầu hết các endpoint yêu cầu xác thực đều sử dụng JWT.
- Gửi token trong header `Authorization` với định dạng `Bearer your_jwt_token`.
- Token có thời hạn (ví dụ: 3600 giây), cần sử dụng endpoint `POST /api/auth/refresh` để làm mới khi hết hạn.

### 2. Phân quyền (Authorization)
- Hệ thống sử dụng các vai trò (roles) để kiểm soát quyền truy cập.
- Các vai trò chính: `admin`, `contributor`, `user`.
- Các endpoint yêu cầu quyền cụ thể sẽ trả về lỗi `403 Forbidden` nếu người dùng không có quyền.

### 3. Validation & Error Responses
- Lỗi xác thực dữ liệu đầu vào (validation) sẽ trả về HTTP status `422 Unprocessable Entity`.
- Body của response sẽ chứa danh sách các lỗi chi tiết.
  ```json
  {
      "success": false,
      "message": "Validation errors",
      "errors": {
          "email": [
              "The email has already been taken."
          ]
      }
  }
  ```
- Các lỗi chung khác:
  - `401 Unauthorized`: Chưa đăng nhập hoặc token không hợp lệ.
  - `403 Forbidden`: Không có quyền truy cập tài nguyên.
  - `404 Not Found`: Không tìm thấy tài nguyên (ví dụ: `GET /api/products/9999`).
  - `500 Internal Server Error`: Lỗi từ phía server.

### 4. Phân trang (Pagination)
- Các endpoint trả về danh sách (ví dụ: `GET /api/products`) đều hỗ trợ phân trang.
- Dữ liệu trả về sẽ có cấu trúc của Laravel Paginator, bao gồm `data`, `current_page`, `last_page`, `total`, `per_page`, `next_page_url`, v.v.
- Có thể tùy chỉnh số lượng item mỗi trang bằng query param `per_page`.

### 5. Định dạng ngày tháng
- Tất cả các trường ngày tháng (ví dụ: `created_at`, `end_at`) đều được trả về theo định dạng ISO 8601 (UTC), ví dụ: `2025-07-04T15:00:00.000000Z`.

