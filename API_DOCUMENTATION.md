# BaloZone Backend API Documentation

## 📊 Thống kê dữ liệu đã tạo
- **Users**: 22 (bao gồm admin và test users)
- **Categories**: 6 (Balo Học Sinh, Balo Du Lịch, Balo Laptop, etc.)
- **Brands**: 16 (Nike, Adidas, Samsonite, JanSport, The North Face, Herschel + 10 random)
- **Products**: 55 (bao gồm sản phẩm cụ thể và random)
- **Orders**: 30 đơn hàng với 72 chi tiết đơn hàng
- **Comments**: 100 bình luận
- **News**: 20 tin tức
- **Contacts**: 23 liên hệ
- **Payment Methods**: 6 phương thức thanh toán
- **Vouchers**: 6 voucher khuyến mãi
- **Address Books**: 46 địa chỉ

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
POST   /api/auth/logout             - User logout (protected)
POST   /api/auth/refresh            - Refresh JWT token (protected)
GET    /api/auth/me                 - Get current user info (protected)
```

### User Profile (Protected)
```
GET    /api/profile                 - Get user profile
PUT    /api/profile                 - Update user profile
POST   /api/change-password         - Change password
GET    /api/user-stats              - Get user statistics
DELETE /api/delete-account          - Delete user account
```

### Address Books (Protected)
```
GET    /api/address-books           - Get user addresses
POST   /api/address-books           - Create new address
GET    /api/address-books/{id}      - Get specific address
PUT    /api/address-books/{id}      - Update address
DELETE /api/address-books/{id}      - Delete address
```

### Brands
```
GET    /api/brands                  - List brands (search, filter, pagination)
POST   /api/brands                  - Create brand
GET    /api/brands/{id}             - Get brand details
PUT    /api/brands/{id}             - Update brand
DELETE /api/brands/{id}             - Delete brand
GET    /api/brands-active           - Get active brands for select
```

### Categories
```
GET    /api/categories              - List categories (search, pagination)
POST   /api/categories              - Create category
GET    /api/categories/{id}         - Get category details
PUT    /api/categories/{id}         - Update category
DELETE /api/categories/{id}         - Delete category
GET    /api/categories-with-products - Get categories with products
```

### Products
```
GET    /api/products                - List products (search, filter, sort, pagination)
POST   /api/products                - Create product  
GET    /api/products/{id}           - Get product details with comments
PUT    /api/products/{id}           - Update product
DELETE /api/products/{id}           - Delete product
GET    /api/products-featured       - Get featured products (8 items)
GET    /api/products/category/{slug} - Get products by category slug
GET    /api/products/brand/{slug}   - Get products by brand slug
GET    /api/products-search         - Search products
GET    /api/products-on-sale        - Get products currently on sale
GET    /api/products/{id}/sale-campaigns - Get sale campaigns for product
```

### Orders (Protected)
```
GET    /api/orders                  - Get user orders
POST   /api/orders                  - Create new order
GET    /api/orders/{id}             - Get order details
POST   /api/orders/{id}/cancel      - Cancel order
GET    /api/orders-stats            - Get order statistics
```

### Vouchers
```
GET    /api/vouchers                - List vouchers (admin)
POST   /api/vouchers                - Create voucher (admin)
GET    /api/vouchers/{id}           - Get voucher details (admin)
PUT    /api/vouchers/{id}           - Update voucher (admin)
DELETE /api/vouchers/{id}           - Delete voucher (admin)
POST   /api/vouchers/validate       - Validate voucher code
GET    /api/vouchers-active         - Get active vouchers
```

### Comments
```
GET    /api/comments                - List comments
POST   /api/comments                - Create comment (protected)
GET    /api/comments/{id}           - Get comment details
PUT    /api/comments/{id}           - Update comment (protected)
DELETE /api/comments/{id}           - Delete comment (protected)
GET    /api/comments/product/{id}   - Get product comments
GET    /api/my-comments             - Get user comments (protected)
```

### News
```
GET    /api/news                    - List news articles
GET    /api/news/{id}               - Get news details
GET    /api/news-latest             - Get latest news
```

### Contacts
```
POST   /api/contacts                - Send contact message
GET    /api/contacts                - List contacts (admin)
GET    /api/contacts/{id}           - Get contact details (admin)
```

**Note:** Contact creation requires `fullname` field, not `name`.

### Query Parameters cho Brands
- `search`: Tìm kiếm theo tên brand
- `status`: Lọc theo trạng thái (active/inactive)
- `per_page`: Số lượng items per page (default: 15)

## 📋 Database Schema

### Brands Table
```sql
- id (primary key)
- name (string, required)
- description (text, nullable)
- slug (string, unique, required)
- logo (string, nullable)
- status (enum: active/inactive, default: active)
- created_at, updated_at
```

### Products Table (đã cập nhật)
```sql
- id (primary key)
- category_id (foreign key to categories)
- brand_id (foreign key to brands, nullable)
- name (string, required)
- description (text, nullable)
- price (decimal, required)
- quantity (integer, default: 0)
- image (string, nullable)
- slug (string, unique, required)
- color (string, nullable)
- created_at, updated_at
```

### Address Books Table
```sql
- id (primary key)
- user_id (foreign key to users)
- name (string, required) - Họ và tên người nhận
- phone (string, required) - Số điện thoại người nhận
- address (text, required) - Địa chỉ chi tiết
- province (string, required) - Tỉnh/Thành phố
- district (string, required) - Quận/Huyện
- ward (string, required) - Phường/Xã
- is_default (boolean, default: false) - Địa chỉ mặc định
- created_at, updated_at
```

### Sale Campaigns Table (mới)
```sql
- id (primary key)
- name (string, required) - Tên chiến dịch
- slug (string, unique, required) - URL-friendly name
- description (text, nullable) - Mô tả chiến dịch
- banner_image (string, nullable) - Hình ảnh banner
- start_date (datetime, required) - Ngày bắt đầu sale
- end_date (datetime, required) - Ngày kết thúc sale
- status (enum: draft/active/expired/cancelled, default: draft)
- is_featured (boolean, default: false) - Chiến dịch nổi bật
- priority (integer, default: 0) - Độ ưu tiên hiển thị
- metadata (json, nullable) - Dữ liệu bổ sung
- created_at, updated_at
```

### Sale Products Table (mới)
```sql
- id (primary key)
- sale_campaign_id (foreign key to sale_campaigns)
- product_id (foreign key to products)
- original_price (decimal, required) - Giá gốc
- sale_price (decimal, required) - Giá sau khi giảm
- discount_percentage (decimal) - % giảm giá
- discount_amount (decimal) - Số tiền giảm
- discount_type (enum: percentage/fixed_amount)
- start_date (datetime, nullable) - Override ngày campaign
- end_date (datetime, nullable) - Override ngày campaign
- max_quantity (integer, nullable) - Giới hạn số lượng sale
- sold_quantity (integer, default: 0) - Đã bán
- is_active (boolean, default: true)
- created_at, updated_at
```

## � API Examples

### Address Books API

#### Create Address Book
**POST** `/api/address-books`

**Request Body:**
```json
{
  "name": "Nguyễn Văn An",
  "phone": "0901234567",
  "address": "123 Đường Nguyễn Huệ",
  "province": "TP. Hồ Chí Minh",
  "district": "Quận 1",
  "ward": "Phường Bến Nghé",
  "is_default": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Địa chỉ đã được tạo thành công",
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "Nguyễn Văn An",
    "phone": "0901234567",
    "address": "123 Đường Nguyễn Huệ",
    "province": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé",
    "is_default": true,
    "created_at": "2025-06-19T13:20:00.000000Z",
    "updated_at": "2025-06-19T13:20:00.000000Z"
  }
}
```

#### Get User Address Books
**GET** `/api/address-books`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Nguyễn Văn An",
      "phone": "0901234567",
      "address": "123 Đường Nguyễn Huệ",
      "province": "TP. Hồ Chí Minh",
      "district": "Quận 1",
      "ward": "Phường Bến Nghé",
      "is_default": true,
      "created_at": "2025-06-19T13:20:00.000000Z",
      "updated_at": "2025-06-19T13:20:00.000000Z"
    }
  ],
  "total": 1
}
```

## �👤 Test Accounts

### Admin Account
- **Email**: admin@balozone.com
- **Password**: admin123
- **Role**: Administrator

### Test Account
- **Email**: test@example.com
- **Password**: password
- **Role**: Regular User

### Sample Users
- **Email**: an.nguyen@gmail.com, binh.tran@gmail.com, etc.
- **Password**: password123

## 🎯 Sample Data Created

### Categories
1. **Balo Học Sinh** - Dành cho học sinh, sinh viên
2. **Balo Du Lịch** - Cho các chuyến du lịch, trekking
3. **Balo Laptop** - Chuyên dụng đựng laptop
4. **Balo Thể Thao** - Dành cho hoạt động thể thao
5. **Túi Xách** - Túi xách thời trang
6. **Balo Mini** - Balo nhỏ gọn dạo phố

### Brands
1. **Nike** - Thương hiệu thể thao hàng đầu
2. **Adidas** - Thương hiệu thể thao nổi tiếng
3. **Samsonite** - Hành lý và balo du lịch cao cấp
4. **JanSport** - Balo học sinh và du lịch
5. **The North Face** - Balo outdoor và leo núi
6. **Herschel** - Thiết kế vintage và hiện đại
+ 10 brands random khác

### Sample Products
- **Balo JanSport SuperBreak Classic** - 899,000 VND
- **Balo Nike Heritage 2.0** - 1,200,000 VND
- **Balo The North Face Borealis 28L** - 2,500,000 VND
- **Balo Samsonite Guardit 2.0** - 3,200,000 VND
- **Balo Laptop Herschel Pop Quiz** - 1,800,000 VND
+ 50 sản phẩm random khác

### Payment Methods
1. **COD** - Thanh toán khi nhận hàng
2. **Bank Transfer** - Chuyển khoản ngân hàng
3. **MoMo** - Ví điện tử MoMo
4. **ZaloPay** - Ví điện tử ZaloPay
5. **VNPay** - Cổng thanh toán VNPay
6. **Credit Card** - Thẻ tín dụng/Ghi nợ

### Vouchers
- **WELCOME10** - Giảm 50,000 VND (100 lượt)
- **STUDENT15** - Giảm 75,000 VND (200 lượt)
- **SUMMER20** - Giảm 100,000 VND (50 lượt)
- **NEWUSER** - Giảm 30,000 VND (500 lượt)
- **LOYAL25** - Giảm 150,000 VND (30 lượt)
- **FLASH50** - Giảm 200,000 VND (20 lượt)

## 🔄 Relationships

### Brand → Product (One to Many)
```php
// Brand model
public function products()
{
    return $this->hasMany(Product::class);
}

// Product model
public function brand()
{
    return $this->belongsTo(Brand::class);
}
```

### Category → Product (One to Many)
```php
// Category model
public function products()
{
    return $this->hasMany(Product::class);
}

// Product model
public function category()
{
    return $this->belongsTo(Category::class);
}
```

## 🧪 Testing API

### Test Brand API
```bash
# Lấy danh sách brands
curl -X GET "http://localhost:8000/api/brands"

# Tìm kiếm brand
curl -X GET "http://localhost:8000/api/brands?search=Nike"

# Lọc brand active
curl -X GET "http://localhost:8000/api/brands?status=active"

# Lấy brands active cho select
curl -X GET "http://localhost:8000/api/brands-active"
```

### Test với Postman
1. Import collection từ file postman (sẽ tạo riêng)
2. Set base URL: `http://localhost:8000/api`
3. Test các endpoint với sample data

## 🚀 Getting Started

1. **Chạy migration và seeder**:
   ```bash
   php artisan migrate:fresh --seed
   ```

2. **Start server**:
   ```bash
   php artisan serve
   ```

3. **Test API**:
   - Base URL: `http://localhost:8000/api`
   - Brands endpoint: `http://localhost:8000/api/brands`

## 📝 Notes

- Tất cả seeder đã được tạo với dữ liệu nhất quán
- Thứ tự chạy seeder đã được tối ưu để tránh lỗi foreign key
- Dữ liệu mẫu phù hợp với ngành kinh doanh balo/túi xách
- API responses đều trả về JSON format
- Đã implement pagination, search, filter cơ bản

---

**Created by**: BaloZone Development Team  
**Last Updated**: June 18, 2025
