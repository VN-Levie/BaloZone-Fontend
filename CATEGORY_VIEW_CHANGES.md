# Cập nhật CategoryView để Hỗ trợ Phân trang Backend

## Thay đổi chính

### 1. **API Service Updates**
- Cập nhật `categoriesApi.getCategoryBySlug()` để hỗ trợ query parameters
- Thêm support cho `page` và `per_page` parameters
- URL example: `/api/categories/slug/balo-hoc-sinh?page=1&per_page=12`

### 2. **Pagination Logic Changes**
- **Trước**: Frontend tự xử lý phân trang với `computed` properties
- **Sau**: Backend xử lý phân trang, frontend chỉ hiển thị kết quả

#### Thay đổi trong State Management:
```typescript
// TRƯỚC
const totalPages = computed(() => Math.ceil(categoryProducts.value.length / itemsPerPage.value))
const paginatedProducts = computed(() => categoryProducts.value.slice(start, end))

// SAU  
const totalPages = ref(1)           // Lấy từ backend response
const totalProducts = ref(0)        // Lấy từ backend response
const displayedProducts = computed(() => categoryProducts.value) // Products đã phân trang sẵn
```

### 3. **API Response Structure**
Backend response hiện tại:
```json
{
  "category": { /* category info */ },
  "products": {
    "current_page": 1,
    "data": [ /* products array */ ],
    "total": 39,
    "per_page": 12,
    "last_page": 4,
    // ... pagination metadata
  }
}
```

### 4. **Updated Functions**

#### `fetchCategoryAndProducts()`
- Nhận thêm parameters: `page` và `perPage`
- Cập nhật pagination state từ backend response
- Call API với query parameters

#### `goToPage()`
- Gọi `fetchCategoryAndProducts()` với page mới
- Backend sẽ trả về products cho page đó

#### Watch Logic
- `itemsPerPage` changes → Gọi API với `per_page` mới
- `categorySlug` changes → Gọi API với page = 1
- Filters → Áp dụng local filtering (có thể di chuyển lên backend sau)

### 5. **Template Changes**
- `paginatedProducts` → `displayedProducts`
- Pagination info hiển thị data từ backend
- Maintain tất cả UI/UX features

## Benefits

### ✅ **Performance**
- Giảm tải cho frontend (không cần xử lý large datasets)
- Faster page loads với pagination từ server
- Reduced memory usage

### ✅ **Scalability**  
- Có thể handle hàng nghìn products mà không lag
- Backend có thể optimize queries với indexing
- Support cho advanced filtering trong tương lai

### ✅ **User Experience**
- Faster page switching
- Smooth scrolling maintained
- All existing features work seamlessly

## Future Enhancements

### 1. **Move Filtering to Backend**
```typescript
// Có thể implement sau
const filters = {
  sort: selectedSort.value,
  price_min: priceRange.min,
  price_max: priceRange.max,
  brand_slug: selectedBrand.value
}
fetchCategoryAndProducts(slug, page, perPage, filters)
```

### 2. **URL Sync**
- Sync current page với URL parameters
- Bookmark-able pages
- SEO benefits

### 3. **Advanced Features**
- Infinite scroll option
- Pre-loading next page
- Search integration

## Testing Checklist

- [x] ✅ Pagination works with backend API
- [x] ✅ Page navigation updates correctly  
- [x] ✅ Items per page selection works
- [x] ✅ Filters apply to current page
- [x] ✅ Category switching resets to page 1
- [x] ✅ Loading states display properly
- [x] ✅ Empty states work correctly
- [x] ✅ Responsive design maintained
- [x] ✅ No TypeScript errors

## Files Modified

1. **`src/services/api.ts`** - Updated getCategoryBySlug API function
2. **`src/views/CategoryView.vue`** - Complete pagination logic overhaul
3. **`CATEGORY_VIEW_CHANGES.md`** - This documentation

---

**Note**: Tất cả thay đổi backward compatible và maintain existing UI/UX patterns.
