# Authentication (Xác thực)

Các endpoint để quản lý xác thực người dùng sử dụng JWT (JSON Web Token).

## Base URL
```
/api/auth/
```

## Endpoints

### 1. Đăng nhập

- **Endpoint:** `POST /api/auth/login`
- **Mô tả:** Đăng nhập người dùng và trả về một token JWT.
- **Phân quyền:** Public
- **Input (JSON):**
```json
{
    "email": "admin@balozone.com",
    "password": "admin123"
}
```
- **Output thành công (JSON):**
```json
{
    "success": true,
    "message": "Đăng nhập thành công",
    "user": {
        "id": 1,
        "name": "Admin BaloZone",
        "email": "admin@balozone.com",
        "email_verified_at": null,
        "phone": "0901234567",
        "status": "active",
        "created_at": "2025-07-12T17:24:35.000000Z",
        "updated_at": "2025-07-12T17:24:35.000000Z",
        "deleted_at": null,
        "roles": [
            {
                "id": 1,
                "name": "admin",
                "display_name": "Admin",
                "description": "Quản trị viên hệ thống - có quyền truy cập toàn bộ hệ thống",
                "created_at": "2025-07-12T17:24:34.000000Z",
                "updated_at": "2025-07-12T17:24:34.000000Z",
                "deleted_at": null,
                "pivot": {
                    "user_id": 1,
                    "role_id": 1
                }
            }
        ]
    },
    "authorization": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTIzNTE2MjgsImV4cCI6MTc1MjM1NTIyOCwibmJmIjoxNzUyMzUxNjI4LCJqdGkiOiJKY0s3QU9vSVA3dmU5OFN1Iiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.E8e_4phWOBbzlzNwwaXwU471DU35IUumQqEa7MeSj8o",
        "type": "bearer",
        "expires_in": 3600
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
- **Phân quyền:** Public
- **Input (JSON):**

```json
{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "0987654321"
}
```

- **Validation:**
  - `name`: required|string|max:255
  - `email`: required|email|unique:users
  - `password`: required|string|min:6|confirmed
  - `phone`: nullable|string|max:20

- **Output thành công (JSON):**

```json
{
    "success": true,
    "message": "Đăng ký thành công",
    "user": {
        "name": "Test User",
        "email": "testuser@example.com",
        "phone": "0987654321",
        "status": "active",
        "updated_at": "2025-07-12T20:21:06.000000Z",
        "created_at": "2025-07-12T20:21:06.000000Z",
        "id": 24,
        "roles": [
            {
                "id": 2,
                "name": "user",
                "display_name": "User",
                "description": "Người dùng thông thường - có thể mua hàng và sử dụng các tính năng cơ bản",
                "created_at": "2025-07-12T17:24:34.000000Z",
                "updated_at": "2025-07-12T17:24:34.000000Z",
                "deleted_at": null,
                "pivot": {
                    "user_id": 24,
                    "role_id": 2
                }
            }
        ]
    },
    "authorization": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvcmVnaXN0ZXIiLCJpYXQiOjE3NTIzNTE2NjYsImV4cCI6MTc1MjM1NTI2NiwibmJmIjoxNzUyMzUxNjY2LCJqdGkiOiJaY3Z0WWdXN0F2dFZPQ05BIiwic3ViIjoiMjQiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.S26WY8McIEDhyZjgaPwn8nGNPIRrDfPK9Svb4r6vYOM",
        "type": "bearer",
        "expires_in": 3600
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
- **Phân quyền:** Authenticated
- **Headers:**
  - `Authorization: Bearer your_jwt_token`

- **Output thành công (JSON):**

```json
{
    "success": true,
    "message": "Đăng xuất thành công"
}
```

- **Output thất bại (Token invalid):**

```json
{
    "success": false,
    "message": "Token không hợp lệ hoặc đã hết hạn",
    "data": null
}
```

### 4. Làm mới Token

- **Endpoint:** `POST /api/auth/refresh`
- **Mô tả:** Làm mới token JWT đã hết hạn (yêu cầu token JWT).
- **Phân quyền:** Authenticated
- **Headers:**
  - `Authorization: Bearer your_jwt_token`

- **Output thành công (JSON):**

```json
{
    "success": true,
    "message": "Đăng nhập thành công",
    "user": {
        "id": 1,
        "name": "Admin BaloZone",
        "email": "admin@balozone.com",
        "email_verified_at": null,
        "phone": "0901234567",
        "status": "active",
        "created_at": "2025-07-12T17:24:35.000000Z",
        "updated_at": "2025-07-12T17:24:35.000000Z",
        "deleted_at": null,
        "roles": [
            {
                "id": 1,
                "name": "admin",
                "display_name": "Admin",
                "description": "Quản trị viên hệ thống - có quyền truy cập toàn bộ hệ thống",
                "created_at": "2025-07-12T17:24:34.000000Z",
                "updated_at": "2025-07-12T17:24:34.000000Z",
                "deleted_at": null,
                "pivot": {
                    "user_id": 1,
                    "role_id": 1
                }
            }
        ]
    },
    "authorization": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvcmVmcmVzaCIsImlhdCI6MTc1MjM1MTYyOCwiZXhwIjoxNzUyMzU1MjU5LCJuYmYiOjE3NTIzNTE2NTksImp0aSI6InFBbDkxT1NJQlRQRG1OcGoiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.0UjRteJBCzk19DrBbJKiGvYP9K68IVF4mj_89w08QCE",
        "type": "bearer",
        "expires_in": 3600
    }
}
```

### 5. Lấy thông tin người dùng

- **Endpoint:** `GET /api/auth/me`
- **Mô tả:** Lấy thông tin của người dùng đang đăng nhập (yêu cầu token JWT).
- **Phân quyền:** Authenticated
- **Headers:**
  - `Authorization: Bearer your_jwt_token`

- **Output thành công (JSON):**

```json
{
    "success": true,
    "user": {
        "id": 1,
        "name": "Admin BaloZone",
        "email": "admin@balozone.com",
        "email_verified_at": null,
        "phone": "0901234567",
        "status": "active",
        "created_at": "2025-07-12T17:24:35.000000Z",
        "updated_at": "2025-07-12T17:24:35.000000Z",
        "deleted_at": null,
        "address_books": [
            {
                "id": 55,
                "user_id": 1,
                "address": "Địa chỉ chi tiết",
                "province": "Tỉnh Phú Thọ",
                "postal_code": null,
                "district": "Huyện Tân Sơn",
                "ward": "Xã Kim Thượng",
                "recipient_name": "Họ và tên",
                "recipient_phone": "0111111111",
                "is_default": false,
                "created_at": "2025-07-12T17:40:33.000000Z",
                "updated_at": "2025-07-12T17:44:23.000000Z",
                "deleted_at": null
            }
        ],
        "orders": [
            {
                "id": 16,
                "order_number": "ORD-2025-000016",
                "status": "processing",
                "total_amount": "9324927.00",
                "shipping_fee": "38683.00",
                "voucher_discount": "50000.00",
                "final_amount": "9313610.00",
                "payment_method": "vnpay",
                "payment_status": "paid",
                "created_at": "2025-07-12T17:24:38.000000Z",
                "updated_at": "2025-07-12T17:24:38.000000Z"
            }
        ],
        "roles": [
            {
                "id": 1,
                "name": "admin",
                "display_name": "Admin",
                "description": "Quản trị viên hệ thống - có quyền truy cập toàn bộ hệ thống",
                "created_at": "2025-07-12T17:24:34.000000Z",
                "updated_at": "2025-07-12T17:24:34.000000Z",
                "deleted_at": null,
                "pivot": {
                    "user_id": 1,
                    "role_id": 1
                }
            }
        ]
    }
}
```

## Error Responses

### 401 Unauthorized

```json
{
    "success": false,
    "message": "Token không hợp lệ hoặc đã hết hạn",
    "data": null
}
```

### 422 Unprocessable Entity

```json
{
    "success": false,
    "message": "Validation errors",
    "errors": {
        "field_name": [
            "Error message"
        ]
    }
}
```

## Notes

- Token có thời hạn 3600 giây (1 giờ)
- Sau khi đăng ký thành công, người dùng sẽ được tự động gán role "user"
- Sử dụng endpoint refresh để gia hạn token trước khi hết hạn
- Tất cả token sẽ bị vô hiệu hóa sau khi logout
- Response `/api/auth/me` bao gồm cả thông tin address_books và orders của user

## cURL Examples

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@balozone.com","password":"admin123"}'
```

### Register
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123","phone":"0987654321"}'
```

### Get User Info
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### Refresh Token
```bash
curl -X POST "http://localhost:8000/api/auth/refresh" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### Logout
```bash
curl -X POST "http://localhost:8000/api/auth/logout" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

---

**Related Files:**
- Controller: `app/Http/Controllers/AuthController.php`
- Model: `app/Models/User.php`
- Middleware: JWT Authentication
