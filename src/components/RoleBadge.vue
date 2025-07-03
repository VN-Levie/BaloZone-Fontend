<template>
  <span 
    class="role-badge"
    :class="[
      `role-badge--${roleType}`,
      {
        'role-badge--small': size === 'small',
        'role-badge--large': size === 'large'
      }
    ]"
    :title="description"
  >
    <i :class="iconClass" v-if="showIcon"></i>
    {{ displayName }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Role } from '@/types'

interface Props {
  role: Role | string
  size?: 'small' | 'medium' | 'large'
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showIcon: true
})

const roleData = computed(() => {
  if (typeof props.role === 'string') {
    return {
      name: props.role,
      display_name: getRoleDisplayName(props.role),
      description: getRoleDescription(props.role)
    }
  }
  return props.role
})

const roleType = computed(() => roleData.value.name)

const displayName = computed(() => roleData.value.display_name)

const description = computed(() => roleData.value.description)

const iconClass = computed(() => {
  switch (roleType.value) {
    case 'admin':
      return 'fas fa-crown'
    case 'contributor':
      return 'fas fa-user-cog'
    case 'user':
      return 'fas fa-user'
    default:
      return 'fas fa-user'
  }
})

function getRoleDisplayName(roleName: string): string {
  switch (roleName) {
    case 'admin':
      return 'Admin'
    case 'contributor':
      return 'Cộng tác viên'
    case 'user':
      return 'User'
    default:
      return roleName
  }
}

function getRoleDescription(roleName: string): string {
  switch (roleName) {
    case 'admin':
      return 'Quản trị viên hệ thống - có quyền truy cập toàn bộ hệ thống'
    case 'contributor':
      return 'Cộng tác viên - có thể quản lý sản phẩm và đơn hàng'
    case 'user':
      return 'Người dùng thông thường - có thể mua hàng và sử dụng các tính năng cơ bản'
    default:
      return 'Vai trò người dùng'
  }
}
</script>

<style scoped>
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;
}

.role-badge--small {
  padding: 0.125rem 0.375rem;
  font-size: 0.625rem;
}

.role-badge--large {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.role-badge--admin {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}

.role-badge--contributor {
  background-color: #dbeafe;
  color: #1e40af;
  border: 1px solid #60a5fa;
}

.role-badge--user {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.role-badge i {
  font-size: 0.875em;
}
</style>
