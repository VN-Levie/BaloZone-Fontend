# BaloZone Frontend

Ứng dụng frontend cho website bán balo, vali và túi xách được xây dựng với Vue.js 3, TypeScript và Bootstrap.

## 🚀 Tính năng

### Đã hoàn thiện
- ✅ **Trang chủ**: Hiển thị sản phẩm nổi bật, categories
- ✅ **Danh mục sản phẩm**: Lọc theo giá, thương hiệu, sắp xếp
- ✅ **Chi tiết sản phẩm**: Xem thông tin, thêm vào giỏ hàng
- ✅ **Tìm kiếm**: Tìm kiếm sản phẩm theo từ khóa
- ✅ **Giỏ hàng**: Quản lý sản phẩm trong giỏ
- ✅ **Wishlist**: Danh sách yêu thích
- ✅ **Xác thực**: Đăng nhập, đăng ký
- ✅ **Responsive**: Tương thích mobile

### API Endpoints
Ứng dụng được thiết kế để làm việc với các API endpoints sau:

#### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user

#### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/{id}` - Chi tiết sản phẩm
- `GET /api/products/category/{slug}` - Sản phẩm theo danh mục
- `GET /api/products-search` - Tìm kiếm sản phẩm
- `GET /api/products-featured` - Sản phẩm nổi bật

#### Categories
- `GET /api/categories` - Danh sách danh mục
- `GET /api/categories/slug/{slug}` - Chi tiết danh mục

#### Brands
- `GET /api/brands-active` - Thương hiệu đang hoạt động

#### Orders
- `GET /api/orders` - Danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới

## 🛠️ Công nghệ sử dụng

- **Vue.js 3** - Framework frontend
- **TypeScript** - Type safety
- **Vue Router** - Routing
- **Pinia** - State management
- **Bootstrap 5** - UI framework
- **Bootstrap Icons** - Icons
- **Vite** - Build tool

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## 🔧 Cấu hình

### API Base URL
Cập nhật `API_BASE_URL` trong `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://127.0.0.1:8000/api'
```

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Reusable components
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── ProductCard.vue
│   ├── LoadingSpinner.vue
│   └── Breadcrumb.vue
├── views/               # Page components
│   ├── HomeView.vue
│   ├── CategoryView.vue
│   ├── ProductDetailView.vue
│   ├── SearchView.vue
│   ├── CartView.vue
│   ├── WishlistView.vue
│   ├── LoginView.vue
│   └── RegisterView.vue
├── composables/         # Vue composables
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useWishlist.ts
├── services/            # API services
│   └── api.ts
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   └── index.ts
├── router/              # Route definitions
│   └── index.ts
└── assets/              # Static assets
```

## 🎨 Thiết kế

### Color Scheme
- **Primary**: #007bff (Blue)
- **Secondary**: #6c757d (Gray)
- **Success**: #28a745 (Green)
- **Danger**: #dc3545 (Red)

### Typography
- **Font Family**: 'Inter', sans-serif
- **Headings**: Font weight 600-700
- **Body**: Font weight 400-500

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Deploy to Static Hosting
Folder `dist/` chứa files để deploy lên:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## 🔐 Authentication

Ứng dụng sử dụng JWT token được lưu trong localStorage:
- `auth_token`: JWT access token
- `user`: Thông tin user (JSON)

## 🛒 State Management

### Cart Management
- Sử dụng `useCart()` composable
- Lưu trữ trong memory (có thể mở rộng với localStorage)
- Hỗ trợ thêm, xóa, cập nhật số lượng

### Wishlist Management
- Sử dụng `useWishlist()` composable
- Lưu trữ trong memory
- Hỗ trợ thêm/xóa sản phẩm yêu thích

## 📱 Responsive Design

- **Mobile First**: Thiết kế ưu tiên mobile
- **Breakpoints**: 
  - xs: 0px
  - sm: 576px
  - md: 768px
  - lg: 992px
  - xl: 1200px

## 🔧 Development

### Coding Standards
- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Vue SFC**: Single File Components

## 📞 Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi:
1. Kiểm tra console browser để xem lỗi
2. Đảm bảo backend API đang chạy
3. Kiểm tra network requests trong DevTools

## 📄 License

This project is licensed under the MIT License.
