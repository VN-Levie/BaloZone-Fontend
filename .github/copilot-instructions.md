
# Hướng dẫn cho GitHub Copilot - Dự án BaloZone Frontend

Chào Copilot, bạn đang hỗ trợ phát triển frontend cho dự án BaloZone, một trang web thương mại điện tử. Vui lòng tuân thủ các hướng dẫn dưới đây để đảm bảo code được viết ra nhất quán và chính xác.

## 1. Tổng quan về Ứng dụng

- **Nền tảng:** Vue.js 3
- **Ngôn ngữ:** TypeScript
- **State Management:** Pinia
- **Routing:** Vue Router
- **UI Framework:** Bootstrap 5 và Bootstrap-Vue-Next
- **Cấu trúc:** Sử dụng Composition API với `<script setup lang="ts">`.
- **Mục tiêu:** Xây dựng giao diện người dùng (public-facing) và trang quản trị (admin dashboard) cho hệ thống BaloZone.

## 2. Thông tin về Backend API

Toàn bộ tương tác dữ liệu đều thông qua BaloZone-Backend API.

### 2.1. Thông tin chung

- **Base URL:** `http://localhost:8000/api`
- **Authentication:** Sử dụng JWT. Token phải được gửi trong header của mỗi request yêu cầu xác thực.
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Content-Type:** Tất cả request body phải là `application/json`.
- **Cấu trúc Response chuẩn:**
  ```json
  {
    "success": true,
    "data": { /* Dữ liệu trả về */ },
    "message": "Thông điệp thành công"
  }
  ```
- **Cấu trúc Response lỗi:**
  ```json
  {
    "success": false,
    "message": "Thông điệp lỗi chính",
    "errors": {
      "field_name": ["Thông điệp lỗi chi tiết"]
    }
  }
  ```
- **Cấu trúc Phân trang (Pagination):** Dữ liệu phân trang nằm trong `data` object.
  ```json
  {
    "success": true,
    "data": {
      "current_page": 1,
      "data": [ /* Mảng các items */ ],
      "total": 100,
      "per_page": 10,
      // ... các thông tin khác
    },
    "message": "..."
  }
  ```

### 2.2. Lớp API Service (`src/api.ts`)

**QUY TẮC VÀNG: LUÔN LUÔN sử dụng các hàm đã được định nghĩa sẵn trong `src/api.ts` để gọi API.** **KHÔNG** sử dụng `fetch` hay `axios` trực tiếp trong components hoặc stores.

File `src/api.ts` đã đóng gói tất cả các lời gọi API và tự động đính kèm token xác thực.

- **Ví dụ:**
  - Để lấy danh sách sản phẩm: `productsApi.getProducts()`
  - Để đăng nhập: `authApi.login({ email, password })`
  - Để lấy danh sách danh mục cho admin: `adminCategoriesApi.getCategories()`
  - Để tạo sản phẩm (admin): `adminProductsApi.createProduct(formData)`

### 2.3. Phân quyền và Vai trò

API được chia thành 3 nhóm chính:

1.  **Public (`/api/*`):** Không cần xác thực.
    - `GET /api/products`, `GET /api/categories`, `GET /api/brands`, `GET /api/news`, `POST /api/contact`...

2.  **User Authenticated (`/api/*`):** Cần xác thực với vai trò `user` hoặc cao hơn.
    - `GET /api/profile`, `GET /api/orders`, `POST /api/orders`, `GET /api/addresses`, `POST /api/comments`...

3.  **Admin & Contributor (`/api/dashboard/*`):** Cần xác thực với vai trò `admin` hoặc `contributor`.
    - **Admin-only:** Quản lý người dùng (`/users`), vai trò (`/roles`), và xem thống kê (`/stats`, `/revenue`).
    - **Admin & Contributor:** Quản lý sản phẩm (`/products`), danh mục (`/categories`), thương hiệu (`/brands`), đơn hàng (`/orders`), tin tức (`/news`), vouchers (`/vouchers`), etc.
    - Luôn kiểm tra file tài liệu API (`README.md`) để biết endpoint nào yêu cầu quyền gì.

## 3. Quy tắc cho Frontend

### 3.1. State Management (Pinia)

- **Store xác thực:** Trạng thái đăng nhập của người dùng (token, user info, roles, isAuthenticated) được quản lý trong `useAuthStore` tại `src/stores/auth.ts`.
- **Sử dụng store:** Khi cần truy cập thông tin người dùng hoặc trạng thái đăng nhập, hãy inject và sử dụng `useAuthStore`.
- **Các store khác:** Tạo các store Pinia mới cho các state global khác (ví dụ: `useCartStore`, `useProductStore`) khi cần thiết.

### 3.2. Routing (Vue Router)

- **Route Guards:** Sử dụng `beforeEnter` hoặc navigation guards toàn cục để bảo vệ các route.
  - Các route như `/profile`, `/orders`, `/checkout` cần kiểm tra `authStore.isAuthenticated`.
  - Các route trong khu vực admin (`/admin/dashboard`, `/admin/products`, ...) cần kiểm tra `authStore.isAuthenticated` VÀ `authStore.user.roles` (ví dụ: `authStore.isAdmin` hoặc `authStore.isContributor`).
- **Định nghĩa route:** Các route được định nghĩa trong `src/router/index.ts`.

### 3.3. Components và Giao diện

- **Composition API:** Luôn sử dụng `<script setup lang="ts">` cho tất cả các component.
- **Bootstrap 5:** Giao diện được xây dựng trên Bootstrap 5. Hãy sử dụng các class của Bootstrap (`.container`, `.row`, `.col`, `.btn`, `.card`, ...) để dàn layout và styling.
- **Bootstrap-Vue-Next:** Tận dụng các component từ `bootstrap-vue-next` (ví dụ: `BContainer`, `BRow`, `BButton`, `BModal`, `BFormInput`) để tăng tốc độ phát triển và đảm bảo tính nhất quán.
- **Icons:** Sử dụng `bootstrap-icons`. Ví dụ: `<i class="bi bi-trash"></i>`.

### 3.4. Quản lý Form

- Khi làm việc với form (đặc biệt là trong trang Admin), hãy sử dụng các component form của `bootstrap-vue-next` (ví dụ: `BForm`, `BFormGroup`, `BFormInput`).
- Đối với các form có upload file (như tạo/sửa sản phẩm, danh mục), phải sử dụng `FormData`. File `api.ts` đã có các hàm hỗ trợ việc này (ví dụ: `adminProductsApi.createProduct(formData)`).

### 3.5. Kiểu dữ liệu (TypeScript)

- Tất cả các kiểu dữ liệu cho API response và các model (Product, User, Order, ...) nên được định nghĩa trong `/src/types/index.ts`.
- Luôn sử dụng các kiểu đã định nghĩa để đảm bảo type safety.

## 4. Ví dụ và Tóm tắt quy tắc

- **Lấy và hiển thị danh sách sản phẩm trong một component:**
  ```vue
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { productsApi } from '@/api'
  import type { Product } from '@/types'

  const products = ref<Product[]>([])
  const isLoading = ref(true)

  onMounted(async () => {
    try {
      const response = await productsApi.getProducts({ per_page: 10 });
      products.value = response.data.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      isLoading.value = false;
    }
  });
  </script>
  ```

- **Tóm tắt các quy tắc quan trọng:**
  1.  **Sử dụng `src/sevices/api.ts`:** Không bao giờ gọi API trực tiếp.
  2.  **Sử dụng Pinia:** Quản lý state toàn cục bằng `useAuthStore` và các store khác.
  3.  **Sử dụng Bootstrap:** Dùng class và component của Bootstrap/Bootstrap-Vue-Next.
  4.  **Sử dụng `<script setup lang="ts">`:** Viết code theo Composition API.
  5.  **Sử dụng Types:** Tận dụng các kiểu dữ liệu trong `src/types.ts`.
  6.  **Kiểm tra quyền:** Chú ý đến phân quyền khi tạo các tính năng cho trang quản trị.


- **Chú ý quan trọng:**
  - Luôn kiểm tra tài liệu API để biết endpoint nào yêu cầu xác thực và phân quyền.
  - Luôn kiểm tra tài liệu cùa từng endpoint liên quan trong thư mục `api-doc` để đảm báo cấu trúc dữ liệu chính xác.
  - Nếu các class định nghĩa trong `/src/types/index.ts` sai so với tài liệu api hãy sửa lại chúng cho khớp với tài liệu api
  - Đảm bảo code được viết rõ ràng, dễ hiểu và tuân thủ các quy tắc đã đề ra.
  - Nếu có bất kỳ câu hỏi nào, hãy tham khảo tài liệu hoặc hỏi người quản lý dự án.