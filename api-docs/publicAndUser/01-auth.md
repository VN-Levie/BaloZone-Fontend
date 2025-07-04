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
    "data": {
        "access_token": "your_jwt_token",
        "token_type": "bearer",
        "expires_in": 3600,
        "user": {
            "id": 1,
            "name": "Tên người dùng",
            "email": "admin@balozone.com",
            "phone": "admin123",
            "status": "active",
            "roles": [
                {
                    "id": 1,
                    "name": "admin",
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
- **Phân quyền:** Public
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

### 4. Làm mới Token

- **Endpoint:** `POST /api/auth/refresh`
- **Mô tả:** Làm mới token JWT đã hết hạn (yêu cầu token JWT).
- **Phân quyền:** Authenticated
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
- **Phân quyền:** Authenticated
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

## Error Responses

### 401 Unauthorized
```json
{
    "message": "Unauthenticated."
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

---

**Related Files:**
- Controller: `app/Http/Controllers/AuthController.php`
- Model: `app/Models/User.php`
- Middleware: JWT Authentication
