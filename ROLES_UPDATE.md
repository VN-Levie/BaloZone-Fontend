# Cập nhật Hệ thống Auth & Roles

## Tổng quan

Đã cập nhật frontend để hỗ trợ hệ thống roles và permissions mới từ backend, dựa trên dữ liệu mẫu từ API.

## Các thay đổi chính

### 1. Types & Interfaces

**Tạo mới:**
- `Role` interface: Định nghĩa cấu trúc role
- `RolesResponse` interface: Response từ API roles

**Cập nhật:**
- `User` interface: Thêm support cho multiple roles, email_verified_at, status
- `AuthResponse` interface: Giữ nguyên cấu trúc hiện tại

### 2. API Services

**Thêm mới:**
- `rolesApi.getRoles()`: Lấy danh sách tất cả roles
- `rolesApi.getRole(id)`: Lấy thông tin chi tiết 1 role

### 3. Auth Store Enhancements

**Getters mới:**
- `userRoles`: Danh sách roles của user hiện tại
- `isAdmin`: Kiểm tra user có role admin
- `isUser`: Kiểm tra user có role user  
- `isContributor`: Kiểm tra user có role contributor
- `primaryRole`: Lấy role chính (role đầu tiên)

**Utilities mới:**
- `hasRole(roleName)`: Kiểm tra user có role cụ thể
- `checkPermission(requiredRole)`: Kiểm tra quyền (admin có tất cả quyền)
- `getRoleDisplayName(roleName)`: Lấy tên hiển thị của role

### 4. Composables

**useAuth.ts cập nhật:**
- Thêm tất cả role-based getters và utilities từ store

**useRoles.ts (mới):**
- Quản lý danh sách roles từ API
- Cung cấp role options cho dropdown/select
- Permission checking utilities
- Caching và error handling

### 5. Components

**RoleBadge.vue (mới):**
- Component hiển thị role badge với icon và color
- Support multiple sizes: small, medium, large
- Icon tự động dựa trên role type
- Tooltip với description

**ProfileSidebar.vue cập nhật:**
- Hiển thị roles của user dưới dạng badges
- Style phù hợp với gradient background

**AppHeader.vue cập nhật:**
- User dropdown hiển thị roles
- Menu "Quản trị" cho admin/contributor
- Responsive role badges

### 6. Views

**RolesDemoView.vue (mới):**
- Demo page hiển thị đầy đủ tính năng roles
- Thông tin user hiện tại và roles
- Permission checks
- Danh sách tất cả roles trong hệ thống
- Actions dựa trên roles

**LoginView.vue cập nhật:**
- Thêm thông tin demo accounts
- Quick login buttons cho admin/user
- Link đến demo page

### 7. Router

**Route mới:**
- `/roles-demo`: Demo roles & permissions (yêu cầu đăng nhập)

## Sử dụng

### 1. Demo Accounts

```bash
# Admin account
Email: admin@balozone.com
Password: admin123
Roles: [admin]

# User account  
Email: test@example.com
Password: password
Roles: [user]
```

### 2. Kiểm tra Roles trong Component

```vue
<template>
  <!-- Hiển thị cho admin -->
  <div v-if="isAdmin">
    Admin only content
  </div>
  
  <!-- Hiển thị cho contributor hoặc admin -->
  <div v-if="isAdmin || isContributor">
    Management features
  </div>
  
  <!-- Role badge -->
  <RoleBadge :role="primaryRole" />
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import RoleBadge from '@/components/RoleBadge.vue'

const { isAdmin, isContributor, primaryRole } = useAuth()
</script>
```

### 3. Permission Checking

```javascript
// Trong component
const { checkPermission, hasRole } = useAuth()

// Kiểm tra quyền cụ thể
if (checkPermission('manage_products')) {
  // User có quyền quản lý sản phẩm
}

// Kiểm tra role cụ thể
if (hasRole('admin')) {
  // User là admin
}
```

### 4. Sử dụng useRoles

```javascript
import { useRoles } from '@/composables/useRoles'

const { 
  roles, 
  roleOptions, 
  fetchRoles,
  canManageProducts,
  hasPermission 
} = useRoles()

// Load roles
await fetchRoles()

// Kiểm tra permissions
const userCanManage = canManageProducts(user.roles)
```

## Tính năng

### Role Types

1. **Admin** 👑
   - Quyền: Tất cả
   - Màu: Vàng/Cam
   - Icon: Crown

2. **Contributor** 🛠️
   - Quyền: Quản lý sản phẩm, đơn hàng
   - Màu: Xanh dương
   - Icon: User-cog

3. **User** 👤
   - Quyền: Mua hàng, sử dụng tính năng cơ bản
   - Màu: Xám
   - Icon: User

### Permissions

- `manage_products`: Quản lý sản phẩm (Admin, Contributor)
- `manage_orders`: Quản lý đơn hàng (Admin, Contributor)  
- `manage_users`: Quản lý người dùng (Admin only)
- `system_admin`: Quản trị hệ thống (Admin only)

## Testing

1. Đăng nhập với account admin để test admin features
2. Đăng nhập với account user để test user restrictions
3. Truy cập `/roles-demo` để xem demo đầy đủ
4. Kiểm tra header dropdown để xem role badges
5. Vào profile để xem roles trong sidebar

## Notes

- Backward compatible với role system cũ
- Admin luôn có tất cả permissions
- Role badges responsive và có tooltip
- API endpoints được cache để tối ưu performance
- Error handling cho tất cả role operations
