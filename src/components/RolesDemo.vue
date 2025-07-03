<template>
  <div class="roles-demo">
    <h2>Roles & Permissions Demo</h2>
    
    <!-- Current User Info -->
    <div class="user-section" v-if="user">
      <h3>Thông tin người dùng hiện tại</h3>
      <div class="user-info">
        <p><strong>Tên:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Trạng thái:</strong> 
          <span class="badge badge-success">{{ user.status }}</span>
        </p>
        
        <!-- User Roles -->
        <div class="user-roles-section">
          <p><strong>Vai trò:</strong></p>
          <div class="roles-list">
            <RoleBadge 
              v-for="role in user.roles" 
              :key="role.id" 
              :role="role" 
              :show-icon="true"
            />
          </div>
        </div>

        <!-- Primary Role -->
        <p><strong>Vai trò chính:</strong> 
          <RoleBadge :role="primaryRole" size="small" />
        </p>
      </div>
    </div>

    <!-- Permission Checks -->
    <div class="permissions-section">
      <h3>Kiểm tra quyền</h3>
      <div class="permissions-grid">
        <div class="permission-item">
          <span class="permission-label">Quản trị hệ thống:</span>
          <span :class="['permission-status', isAdmin ? 'allowed' : 'denied']">
            {{ isAdmin ? '✅ Có quyền' : '❌ Không có quyền' }}
          </span>
        </div>
        
        <div class="permission-item">
          <span class="permission-label">Quản lý sản phẩm:</span>
          <span :class="['permission-status', canManageProductsComputed ? 'allowed' : 'denied']">
            {{ canManageProductsComputed ? '✅ Có quyền' : '❌ Không có quyền' }}
          </span>
        </div>
        
        <div class="permission-item">
          <span class="permission-label">Quản lý đơn hàng:</span>
          <span :class="['permission-status', canManageOrdersComputed ? 'allowed' : 'denied']">
            {{ canManageOrdersComputed ? '✅ Có quyền' : '❌ Không có quyền' }}
          </span>
        </div>
        
        <div class="permission-item">
          <span class="permission-label">Mua hàng:</span>
          <span class="permission-status allowed">✅ Có quyền (Tất cả user)</span>
        </div>
      </div>
    </div>

    <!-- All Roles -->
    <div class="all-roles-section">
      <h3>Tất cả vai trò trong hệ thống</h3>
      <button @click="loadRoles" class="btn btn-primary mb-3" :disabled="rolesLoading">
        {{ rolesLoading ? 'Đang tải...' : 'Tải danh sách vai trò' }}
      </button>
      
      <div v-if="roles.length > 0" class="roles-grid">
        <div v-for="role in roles" :key="role.id" class="role-card">
          <div class="role-header">
            <RoleBadge :role="role" size="large" />
            <span class="user-count">{{ role.users_count || 0 }} người dùng</span>
          </div>
          <p class="role-description">{{ role.description }}</p>
          <small class="role-meta">
            Tạo lúc: {{ new Date(role.created_at).toLocaleDateString('vi-VN') }}
          </small>
        </div>
      </div>
    </div>

    <!-- Actions based on roles -->
    <div class="actions-section">
      <h3>Hành động theo vai trò</h3>
      <div class="actions-grid">
        <button v-if="isAdmin" class="btn btn-danger">
          <i class="fas fa-crown"></i>
          Quản trị hệ thống
        </button>
        
        <button v-if="isAdmin || isContributor" class="btn btn-warning">
          <i class="fas fa-box"></i>
          Quản lý sản phẩm
        </button>
        
        <button v-if="isAdmin || isContributor" class="btn btn-info">
          <i class="fas fa-shopping-cart"></i>
          Quản lý đơn hàng
        </button>
        
        <button class="btn btn-success">
          <i class="fas fa-user"></i>
          Tài khoản cá nhân
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRoles } from '@/composables/useRoles'
import RoleBadge from '@/components/RoleBadge.vue'

const { 
  user, 
  isAdmin, 
  isContributor, 
  primaryRole 
} = useAuth()

const { 
  roles, 
  isLoading: rolesLoading, 
  fetchRoles,
  canManageProducts,
  canManageOrders
} = useRoles()

// Computed properties for permission checks
const canManageProductsComputed = computed(() => {
  if (!user.value?.roles) return false
  return canManageProducts(user.value.roles)
})

const canManageOrdersComputed = computed(() => {
  if (!user.value?.roles) return false
  return canManageOrders(user.value.roles)
})

const loadRoles = async () => {
  await fetchRoles()
}
</script>

<style scoped>
.roles-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.user-section, 
.permissions-section, 
.all-roles-section, 
.actions-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info p {
  margin-bottom: 0.5rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.user-roles-section {
  margin: 1rem 0;
}

.roles-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.permissions-grid {
  display: grid;
  gap: 1rem;
}

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.permission-label {
  font-weight: 500;
}

.permission-status.allowed {
  color: #28a745;
}

.permission-status.denied {
  color: #dc3545;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.role-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background: #f8f9fa;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-count {
  font-size: 0.875rem;
  color: #6c757d;
}

.role-description {
  margin: 0.5rem 0;
  color: #495057;
}

.role-meta {
  color: #6c757d;
}

.actions-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
