
Chắc chắn rồi! Dựa trên tệp `api-doc.json` bạn cung cấp, tôi đã tạo một tài liệu `apidoc.md` rút gọn, dễ hiểu, tập trung vào những gì đội ngũ BA và Frontend cần nhất.

Tài liệu này được cấu trúc theo từng nhóm chức năng (Products, Categories, Auth, v.v.), giải thích rõ ràng từng endpoint, tham số cần thiết và cấu trúc dữ liệu trả về.

---

# Tài liệu API BaloZone

Đây là tài liệu API cho BaloZone, một nền tảng e-commerce cho balo và phụ kiện du lịch. Tài liệu này được thiết kế để đội ngũ Business Analyst (BA) và Frontend có thể dễ dàng nắm bắt và sử dụng.

- **URL Gốc (Base URL):** `http://localhost:8000/api`
- **Xác thực (Authentication):** API sử dụng **Bearer Token (JWT)** để xác thực cho các yêu cầu cần quyền truy cập.
  - Token được trả về sau khi người dùng **đăng nhập** (`/auth/login`) hoặc **đăng ký** (`/auth/register`).
  - Để xác thực, gửi token trong header của mỗi yêu cầu:
    ```
    Authorization: Bearer <your_jwt_token>
    ```

## Mục lục

1.  [Xác thực (Authentication)](#1-xác-thực-authentication)
2.  [Quản lý Người dùng (User Profile)](#2-quản-lý-người-dùng-user-profile)
3.  [Sản phẩm (Products)](#3-sản-phẩm-products)
4.  [Danh mục (Categories)](#4-danh-mục-categories)
5.  [Thương hiệu (Brands)](#5-thương-hiệu-brands)
6.  [Đơn hàng (Orders)](#6-đơn-hàng-orders)
7.  [Sổ địa chỉ (Address Book)](#7-sổ-địa-chỉ-address-book)
8.  [Bình luận (Comments)](#8-bình-luận-comments)
9.  [Voucher (Mã giảm giá)](#9-voucher-mã-giảm-giá)
10. [Tin tức (News)](#10-tin-tức-news)
11. [Liên hệ (Contact)](#11-liên-hệ-contact)
12. [Các Cấu trúc Dữ liệu Chính (Schemas)](#13-các-cấu-trúc-dữ-liệu-chính-schemas)

---

## 1. Xác thực (Authentication)

Nhóm API quản lý việc đăng nhập, đăng ký, đăng xuất và thông tin người dùng.

### `POST /auth/register`

Đăng ký tài khoản người dùng mới.

-   **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "password_confirmation": "password123",
      "phone": "0123456789"
    }
    ```
-   **Success Response (201 Created):** Trả về thông tin người dùng và `access_token`.
    ```json
    {
      "message": "Registration successful",
      "user": { "... (User Object)" },
      "access_token": "...",
      "token_type": "bearer"
    }
    ```

### `POST /auth/login`

Đăng nhập và nhận token xác thực.

-   **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
-   **Success Response (200 OK):** Tương tự như đăng ký.

### `POST /auth/logout`

Đăng xuất và vô hiệu hóa token.

-   **Yêu cầu xác thực:** Có (Bearer Token).
-   **Success Response (200 OK):**
    ```json
    {
      "message": "Successfully logged out"
    }
    ```

### `GET /auth/me`

Lấy thông tin người dùng đang đăng nhập.

-   **Yêu cầu xác thực:** Có (Bearer Token).
-   **Success Response (200 OK):**
    ```json
    {
      "data": {
        "... (User Object)"
      }
    }
    ```

---

## 2. Quản lý Người dùng (User Profile)

Nhóm API cho phép người dùng quản lý thông tin cá nhân.

### `GET /profile`

Lấy thông tin chi tiết của người dùng.

-   **Yêu cầu xác thực:** Có.
-   **Success Response (200 OK):** Trả về đối tượng `User`.

### `PUT /profile`

Cập nhật thông tin cá nhân (tên, điện thoại, địa chỉ).

-   **Yêu cầu xác thực:** Có.
-   **Request Body:**
    ```json
    {
      "name": "Johnathan Doe",
      "phone": "0987654321",
      "address": "123 New Street, City"
    }
    ```
-   **Success Response (200 OK):** Trả về thông báo và đối tượng `User` đã cập nhật.

### `PUT /change-password`

Thay đổi mật khẩu người dùng.

-   **Yêu cầu xác thực:** Có.
-   **Request Body:**
    ```json
    {
      "current_password": "password123",
      "new_password": "newpassword456",
      "new_password_confirmation": "newpassword456"
    }
    ```
-   **Success Response (200 OK):** `{ "message": "Password changed successfully" }`

---

## 3. Sản phẩm (Products)

API quản lý thông tin sản phẩm.

### `GET /products`

Lấy danh sách sản phẩm (có phân trang và bộ lọc).

-   **Query Parameters (Tùy chọn):**
    -   `search`: Tìm theo tên sản phẩm.
    -   `category_id`: Lọc theo ID danh mục.
    -   `brand_id`: Lọc theo ID thương hiệu.
    -   `min_price`, `max_price`: Lọc theo khoảng giá.
    -   `sort_by`: Sắp xếp theo `name`, `price`, `created_at`.
    -   `sort_order`: `asc` hoặc `desc`.
    -   `per_page`: Số sản phẩm mỗi trang.
-   **Success Response (200 OK):** Trả về danh sách sản phẩm có cấu trúc phân trang.
    ```json
    {
      "data": [ "... (danh sách Product Object)" ],
      "meta": { "... (thông tin phân trang)" },
      "links": { "... (link trang trước/sau)" }
    }
    ```

### `GET /products/{id}`

Lấy chi tiết một sản phẩm.

-   **Path Parameter:** `id` (ID của sản phẩm).
-   **Success Response (200 OK):**
    ```json
    {
      "data": {
        "... (Product Object, bao gồm cả category, brand, comments)"
      }
    }
    ```

### `GET /products-featured`

Lấy 8 sản phẩm nổi bật (còn hàng, mới nhất).

-   **Success Response (200 OK):**
    ```json
    {
      "data": [ "... (danh sách 8 Product Object)" ]
    }
    ```

### `GET /products/category/{categorySlug}`

Lấy danh sách sản phẩm theo `slug` của danh mục.

-   **Path Parameter:** `categorySlug` (ví dụ: `travel-backpacks`).
-   **Success Response (200 OK):** Trả về danh sách sản phẩm có phân trang.

---

## 4. Danh mục (Categories)

API quản lý danh mục sản phẩm.

### `GET /categories`

Lấy danh sách danh mục (có phân trang).

-   **Query Parameters (Tùy chọn):** `search`, `per_page`.
-   **Success Response (200 OK):** Trả về danh sách danh mục có phân trang.

### `GET /categories/{id}`

Lấy chi tiết một danh mục (bao gồm cả các sản phẩm thuộc danh mục đó).

-   **Path Parameter:** `id` (ID của danh mục).
-   **Success Response (200 OK):** Trả về đối tượng `Category`.

### `GET /categories-with-products`

Lấy danh sách danh mục cùng với các sản phẩm của chúng (dùng cho trang chủ).

-   **Success Response (200 OK):**
    ```json
    {
      "data": [ "... (danh sách Category Object, mỗi category có list products)" ]
    }
    ```

---

## 5. Thương hiệu (Brands)

API quản lý thương hiệu.

### `GET /brands`

Lấy danh sách thương hiệu (có phân trang và bộ lọc).

-   **Query Parameters (Tùy chọn):** `search`, `status` (`active`/`inactive`), `per_page`.
-   **Success Response (200 OK):** Trả về danh sách thương hiệu có phân trang.

### `GET /brands-active`

Lấy tất cả các thương hiệu đang hoạt động.

-   **Success Response (200 OK):**
    ```json
    {
      "data": [ "... (danh sách Brand Object)" ]
    }
    ```

---

## 6. Đơn hàng (Orders)

API quản lý đơn hàng của người dùng.

### `POST /orders`

Tạo một đơn hàng mới.

-   **Yêu cầu xác thực:** Có.
-   **Request Body:**
    ```json
    {
      "address_id": 1,
      "payment_method_id": 1,
      "voucher_id": null, // hoặc 1, 2, ...
      "comment": "Giao hàng vào buổi chiều.",
      "items": [
        { "product_id": 1, "quantity": 2 },
        { "product_id": 5, "quantity": 1 }
      ]
    }
    ```
-   **Success Response (201 Created):** Trả về thông báo và chi tiết đơn hàng vừa tạo.

### `GET /orders`

Lấy lịch sử đơn hàng của người dùng (có phân trang).

-   **Yêu cầu xác thực:** Có.
-   **Query Parameters (Tùy chọn):** `payment_status` (`pending`, `paid`, `failed`).
-   **Success Response (200 OK):** Trả về danh sách đơn hàng có phân trang.

### `GET /orders/{id}`

Lấy chi tiết một đơn hàng.

-   **Yêu cầu xác thực:** Có.
-   **Path Parameter:** `id` (ID của đơn hàng).
-   **Success Response (200 OK):** Trả về đối tượng `OrderEntity` chi tiết.

### `POST /orders/{id}/cancel`

Hủy một đơn hàng (chỉ hủy được đơn hàng có trạng thái `pending`).

-   **Yêu cầu xác thực:** Có.
-   **Path Parameter:** `id` (ID của đơn hàng).
-   **Success Response (200 OK):** `{ "message": "Hủy đơn hàng thành công" }`

---

## 7. Sổ địa chỉ (Address Book)

API quản lý địa chỉ giao hàng của người dùng.

### `GET /address-books`

Lấy tất cả địa chỉ trong sổ địa chỉ của người dùng.

-   **Yêu cầu xác thực:** Có.
-   **Success Response (200 OK):** Trả về một mảng các đối tượng `AddressBook`.

### `POST /address-books`

Thêm một địa chỉ mới.

-   **Yêu cầu xác thực:** Có.
-   **Request Body:**
    ```json
    {
      "name": "John Doe",
      "phone": "0123456789",
      "address": "123 Main Street",
      "ward": "Phường 1",
      "district": "Quận 1",
      "province": "TP. Hồ Chí Minh",
      "is_default": true
    }
    ```
-   **Success Response (201 Created):** Trả về thông báo và đối tượng `AddressBook` vừa tạo.

### `PUT /address-books/{id}`

Cập nhật một địa chỉ.

-   **Yêu cầu xác thực:** Có.
-   **Path Parameter:** `id` (ID của địa chỉ).
-   **Request Body:** Tương tự như `POST`.

### `DELETE /address-books/{id}`

Xóa một địa chỉ.

-   **Yêu cầu xác thực:** Có.
-   **Path Parameter:** `id` (ID của địa chỉ).

---

## 8. Bình luận (Comments)

API quản lý bình luận, đánh giá sản phẩm.

### `GET /comments/product/{productId}`

Lấy danh sách bình luận của một sản phẩm (có phân trang).

-   **Path Parameter:** `productId` (ID của sản phẩm).
-   **Success Response (200 OK):** Trả về danh sách bình luận có phân trang.

### `POST /comments`

Thêm một bình luận mới cho sản phẩm.

-   **Điều kiện:** Người dùng phải mua sản phẩm này rồi mới được bình luận.
-   **Yêu cầu xác thực:** Có.
-   **Request Body:**
    ```json
    {
      "product_id": 1,
      "comment": "Sản phẩm rất tốt, chất lượng vượt mong đợi!"
    }
    ```
-   **Success Response (201 Created):** Trả về thông báo và đối tượng `Comment` vừa tạo.

### `GET /my-comments`

Lấy danh sách các bình luận của người dùng đang đăng nhập.

-   **Yêu cầu xác thực:** Có.
-   **Success Response (200 OK):** Trả về danh sách bình luận có phân trang.

---

## 9. Voucher (Mã giảm giá)

API quản lý và áp dụng voucher.

### `GET /vouchers-active`

Lấy danh sách các voucher còn hiệu lực và còn số lượng.

-   **Success Response (200 OK):** Trả về một mảng các đối tượng `Voucher`.

### `POST /vouchers/validate`

Kiểm tra tính hợp lệ của một mã voucher.

-   **Request Body:**
    ```json
    {
      "code": "WELCOME10"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "valid": true,
      "message": "Mã voucher hợp lệ",
      "data": {
        "id": 1,
        "code": "WELCOME10",
        "discount": 50000,
        // ... các thông tin khác
      }
    }
    ```
-   **Error Response (404 Not Found):** Nếu mã không hợp lệ, hết hạn hoặc hết lượt sử dụng.

---

## 10. Tin tức (News)

API quản lý tin tức, bài viết.

### `GET /news`

Lấy danh sách tin tức (có phân trang).

-   **Query Parameters (Tùy chọn):** `search`, `per_page`.
-   **Success Response (200 OK):** Trả về danh sách tin tức có phân trang.

### `GET /news/{id}`

Lấy chi tiết một bài viết.

-   **Path Parameter:** `id` (ID bài viết).
-   **Success Response (200 OK):** Trả về đối tượng `News`.

### `GET /news-latest`

Lấy 6 bài viết mới nhất.

-   **Success Response (200 OK):** Trả về một mảng 6 đối tượng `News`.

---

## 11. Liên hệ (Contact)

API cho phép người dùng gửi tin nhắn liên hệ.

### `POST /contacts`

Gửi một tin nhắn liên hệ.

-   **Request Body:**
    ```json
    {
      "fullname": "Jane Smith",
      "email": "jane@example.com",
      "message": "Tôi muốn hỏi về chính sách bảo hành sản phẩm."
    }
    ```
-   **Success Response (201 Created):** Trả về thông báo và dữ liệu đã gửi.

---

## 12. Các Cấu trúc Dữ liệu Chính (Schemas)

Đây là mô tả các đối tượng dữ liệu (object) chính được sử dụng trong API.

### `Product`

| Thuộc tính  | Kiểu dữ liệu | Mô tả                               |
| :---------- | :----------- | :---------------------------------- |
| `id`        | integer      | ID duy nhất của sản phẩm            |
| `name`      | string       | Tên sản phẩm                        |
| `price`     | number       | Giá sản phẩm                        |
| `quantity`  | integer      | Số lượng tồn kho                    |
| `description` | string       | Mô tả chi tiết                      |
| `image`     | string       | Đường dẫn ảnh sản phẩm              |
| `slug`      | string       | Chuỗi định danh thân thiện với URL |
| `color`     | string       | Màu sắc                             |
| `category`  | object       | Đối tượng `Category` của sản phẩm   |
| `brand`     | object       | Đối tượng `Brand` của sản phẩm      |
| `comments`  | array        | Mảng các đối tượng `Comment`        |

### `Category`

| Thuộc tính       | Kiểu dữ liệu | Mô tả                               |
| :--------------- | :----------- | :---------------------------------- |
| `id`             | integer      | ID duy nhất của danh mục            |
| `name`           | string       | Tên danh mục                        |
| `slug`           | string       | Chuỗi định danh thân thiện với URL |
| `image`          | string       | Đường dẫn ảnh danh mục              |
| `products_count` | integer      | Số lượng sản phẩm trong danh mục    |

### `User`

| Thuộc tính | Kiểu dữ liệu | Mô tả                               |
| :--------- | :----------- | :---------------------------------- |
| `id`       | integer      | ID duy nhất của người dùng          |
| `name`     | string       | Tên người dùng                      |
| `email`    | string       | Địa chỉ email                       |
| `phone`    | string       | Số điện thoại                       |
| `address`  | string       | Địa chỉ                             |
| `role`     | string       | Vai trò (`admin` hoặc `user`)       |

### `OrderEntity`

| Thuộc tính        | Kiểu dữ liệu | Mô tả                               |
| :---------------- | :----------- | :---------------------------------- |
| `id`              | integer      | ID duy nhất của đơn hàng            |
| `total_price`     | number       | Tổng giá trị đơn hàng               |
| `payment_status`  | string       | Trạng thái thanh toán (`pending`, `paid`, `failed`) |
| `created_at`      | string       | Thời gian tạo đơn                   |
| `user`            | object       | Thông tin người đặt hàng (`User`)   |
| `address`         | object       | Địa chỉ giao hàng (`AddressBook`)   |
| `voucher`         | object       | Voucher đã áp dụng (`Voucher`)      |
| `order_details`   | array        | Mảng chi tiết các sản phẩm trong đơn |
