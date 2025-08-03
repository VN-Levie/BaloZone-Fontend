# Hệ thống Quản lý Tin tức (Admin News Management)

## Tổng quan

Hệ thống quản lý tin tức cho admin được xây dựng để quản lý các bài tin tức trên website BaloZone. Hệ thống hỗ trợ đầy đủ các chức năng CRUD (Create, Read, Update, Delete) với giao diện thân thiện và hiện đại.

## Tính năng chính

### 1. Quản lý Tin tức
- ✅ Xem danh sách tin tức với phân trang
- ✅ Tìm kiếm tin tức theo tiêu đề
- ✅ Tạo tin tức mới
- ✅ Chỉnh sửa tin tức
- ✅ Xóa tin tức (soft delete)
- ✅ Xem chi tiết tin tức
- ✅ Hiển thị ảnh thumbnail

### 2. Giao diện
- ✅ Chế độ xem bảng (Table View)
- ✅ Chế độ xem lưới (Grid View)
- ✅ Responsive design
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling

### 3. Validation
- ✅ Validation form tạo/sửa tin tức
- ✅ Kiểm tra URL ảnh thumbnail
- ✅ Hiển thị lỗi validation
- ✅ Preview ảnh thumbnail

## Cấu trúc File

```
src/
├── services/
│   └── api.ts                      # API admin news
├── composables/
│   ├── useAdminNews.ts            # Logic quản lý tin tức
│   └── useNewsValidation.ts       # Validation form
├── components/
│   └── admin/
│       └── AdminNewsCard.vue      # Component card tin tức
├── views/
│   └── admin/
│       ├── AdminNewsView.vue      # View bảng tin tức
│       └── AdminNewsGridView.vue  # View lưới tin tức
├── utils/
│   └── newsHelpers.ts            # Utilities cho tin tức
└── types/
    └── index.ts                  # Type definitions
```

## API Endpoints

Tất cả endpoints sử dụng prefix `/api/dashboard/news` và yêu cầu authentication với role Admin hoặc Contributor.

### 1. Lấy danh sách tin tức
```typescript
GET /api/dashboard/news
Query params: search, page, per_page
```

### 2. Lấy chi tiết tin tức
```typescript
GET /api/dashboard/news/{id}
```

### 3. Tạo tin tức mới
```typescript
POST /api/dashboard/news
Body: { title, description, thumbnail? }
```

### 4. Cập nhật tin tức
```typescript
PUT /api/dashboard/news/{id}
Body: { title?, description?, thumbnail? }
```

### 5. Xóa tin tức
```typescript
DELETE /api/dashboard/news/{id}
```

## Cách sử dụng

### 1. Truy cập trang quản lý tin tức
```
/admin/news        # Chế độ bảng
/admin/news/grid   # Chế độ lưới
```

### 2. Sử dụng Composable
```typescript
import { useAdminNews } from '@/composables/useAdminNews'

const {
  news,
  loading,
  loadNews,
  createNews,
  updateNews,
  deleteNews
} = useAdminNews()
```

### 3. Sử dụng Validation
```typescript
import { useNewsValidation } from '@/composables/useNewsValidation'

const {
  errors,
  validateForm,
  validateField,
  clearErrors
} = useNewsValidation()
```

### 4. Sử dụng Utilities
```typescript
import { newsUtils } from '@/utils/newsHelpers'

// Format ngày tháng
const formattedDate = newsUtils.formatDate(news.created_at)

// Cắt ngắn text
const shortDesc = newsUtils.truncateText(news.description, 100)

// Validate URL ảnh
const isValidImage = await newsUtils.validateImageUrl(url)
```

## Validation Rules

### Tiêu đề (title)
- Bắt buộc
- Tối đa 255 ký tự

### Mô tả (description)
- Bắt buộc
- Tối đa 5000 ký tự

### Thumbnail
- Không bắt buộc
- Phải là URL hợp lệ
- Tối đa 255 ký tự

## Error Handling

Hệ thống xử lý các loại lỗi sau:

1. **Network Errors**: Hiển thị toast notification
2. **Validation Errors**: Hiển thị dưới form field
3. **API Errors**: Parse và hiển thị message từ server
4. **Image Load Errors**: Hiển thị placeholder hoặc error message

## States Management

### Loading States
- `loading`: Đang tải danh sách tin tức
- `submitting`: Đang submit form (create/update)
- `deleting`: Đang xóa tin tức

### UI States
- `showCreateModal`: Hiển thị modal tạo/sửa
- `showDeleteModal`: Hiển thị modal xác nhận xóa
- `showViewModal`: Hiển thị modal xem chi tiết

## Responsive Design

- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 1024px)**: 2 columns grid
- **Desktop (> 1024px)**: 3 columns grid

## Keyboard Shortcuts

- `Ctrl/Cmd + N`: Tạo tin tức mới (khi focus trong trang)
- `Escape`: Đóng modal
- `Enter`: Submit form (khi focus trong form)

## Performance Optimization

1. **Lazy Loading**: Views được lazy load
2. **Debounced Search**: Tìm kiếm có debounce 500ms
3. **Image Optimization**: Lazy load ảnh thumbnail
4. **Pagination**: Giới hạn số lượng tin tức mỗi trang

## Customization

### Thay đổi số lượng tin tức mỗi trang
```typescript
const perPageOptions = [
  { value: 5, text: '5 tin tức' },
  { value: 10, text: '10 tin tức' },
  { value: 25, text: '25 tin tức' }
]
```

### Thêm trường mới
1. Update type `News` trong `types/index.ts`
2. Update API calls trong `adminNewsApi`
3. Update form trong views
4. Update validation rules

## Troubleshooting

### Lỗi thường gặp

1. **Cannot load news**: Kiểm tra authentication token
2. **Image not loading**: Kiểm tra URL thumbnail hợp lệ
3. **Form validation failed**: Kiểm tra required fields
4. **Permission denied**: Kiểm tra role Admin/Contributor

### Debug

1. Mở DevTools → Network tab để xem API calls
2. Kiểm tra Console cho các error logs
3. Kiểm tra Redux DevTools cho state changes (nếu có)

## Contribution

Khi thêm tính năng mới:

1. Tạo branch từ `main`
2. Implement feature với tests
3. Update documentation
4. Tạo Pull Request

## License

Hệ thống này là một phần của dự án BaloZone Frontend.
