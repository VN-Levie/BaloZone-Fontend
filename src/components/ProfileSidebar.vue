<template>
  <div class="profile-sidebar gradient-bg">
    <div class="user-info">
      <div class="user-avatar">
        <div class="avatar-circle">
          <i class="bi bi-person-fill"></i>
        </div>
      </div>
      <h5 class="user-name">{{ user?.name || 'User' }}</h5>
      <p class="user-email">{{ user?.email }}</p>
      <div class="user-status">
        <span class="status-badge status-active">
          <i class="bi bi-check-circle-fill"></i>
          Đã xác thực
        </span>
      </div>
    </div>
    <nav class="profile-nav">
      <ul class="nav-list">
        <li>
          <a href="#profile" class="nav-link" :class="{ active: activeTab === 'profile' }" @click.prevent="$emit('change-tab', 'profile')">
            <i class="bi bi-person"></i>
            <span>Thông tin cá nhân</span>
            <i class="bi bi-chevron-right ms-auto"></i>
          </a>
        </li>
        <li>
          <router-link to="/orders" class="nav-link">
            <i class="bi bi-box-seam"></i>
            <span>Đơn hàng của tôi</span>
            <i class="bi bi-chevron-right ms-auto"></i>
          </router-link>
        </li>
        <li>
          <a href="#addresses" class="nav-link" :class="{ active: activeTab === 'addresses' }" @click.prevent="$emit('change-tab', 'addresses')">
            <i class="bi bi-geo-alt"></i>
            <span>Sổ địa chỉ</span>
            <i class="bi bi-chevron-right ms-auto"></i>
          </a>
        </li>
        <li>
          <a href="#password" class="nav-link" :class="{ active: activeTab === 'password' }" @click.prevent="$emit('change-tab', 'password')">
            <i class="bi bi-shield-lock"></i>
            <span>Đổi mật khẩu</span>
            <i class="bi bi-chevron-right ms-auto"></i>
          </a>
        </li>
        <li>
          <router-link to="/wishlist" class="nav-link">
            <i class="bi bi-heart"></i>
            <span>Danh sách yêu thích</span>
            <i class="bi bi-chevron-right ms-auto"></i>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ user: any, activeTab: string }>()
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: #fff;
  border-radius: 18px;
  padding: 2rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  overflow: hidden;
  position: relative;
}

.gradient-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  pointer-events: none;
}

.user-info {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(255,255,255,0.2);
}

.user-avatar .avatar-circle {
  background: #fff;
  color: #ff6b35;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1rem auto;
  box-shadow: 0 4px 20px rgba(255,255,255,0.3);
  transition: all 0.3s ease;
}

.user-avatar .avatar-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(255,255,255,0.4);
}

.user-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.user-email {
  opacity: 0.9;
  font-size: 0.95rem;
}

.status-badge {
  background: rgba(255,255,255,0.25);
  border-radius: 20px;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
}

.profile-nav {
  margin-top: 2rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) transparent;
  position: relative;
  z-index: 1;
}

.profile-nav .nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.profile-nav .nav-link {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
}

.profile-nav .nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.profile-nav .nav-link:hover::before {
  left: 100%;
}

.profile-nav .nav-link.active, 
.profile-nav .nav-link:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.profile-nav .nav-link i {
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

@media (max-width: 991px) {
  .gradient-bg {
    padding: 1.2rem 1rem;
  }
  
  .user-avatar .avatar-circle {
    width: 64px;
    height: 64px;
    font-size: 2rem;
  }
  
  .profile-nav .nav-list {
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 0.5rem;
    justify-content: flex-start;
    padding-bottom: 0.5rem;
  }
  
  .profile-nav .nav-link {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .user-name {
    font-size: 1.1rem;
  }
  
  .user-email {
    font-size: 0.9rem;
  }
  
  .profile-nav .nav-link span {
    display: none;
  }
  
  .profile-nav .nav-link {
    padding: 0.75rem;
    min-width: 48px;
    justify-content: center;
  }
  
  .profile-nav .nav-link i {
    margin-right: 0;
    font-size: 1.2rem;
  }
}
</style>
