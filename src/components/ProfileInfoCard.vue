<template>
  <div class="profile-info-card gradient-bg-light p-4 mb-4">
    <div class="content-header mb-3">
      <h3 class="content-title">
        <i class="bi bi-person-circle me-2"></i>
        Thông tin cá nhân
      </h3>
      <p class="content-subtitle">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
    </div>
    <form @submit.prevent="onUpdate" class="profile-form">
      <div class="form-section">
        <h5 class="section-title">
          <i class="bi bi-info-circle me-2"></i>
          Thông tin cơ bản
        </h5>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="name" class="form-label">
              <i class="bi bi-person me-1"></i>
              Họ và tên *
            </label>
            <input id="name" v-model="form.name" type="text" class="form-control" placeholder="Nhập họ và tên" required />
          </div>
          <div class="col-md-6 mb-3">
            <label for="email" class="form-label">
              <i class="bi bi-envelope me-1"></i>
              Email *
            </label>
            <input id="email" v-model="form.email" type="email" class="form-control" placeholder="Nhập địa chỉ email" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="phone" class="form-label">
              <i class="bi bi-telephone me-1"></i>
              Số điện thoại
            </label>
            <input id="phone" v-model="form.phone" type="tel" class="form-control" placeholder="Nhập số điện thoại" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <h5 class="section-title">
          <i class="bi bi-geo-alt me-2"></i>
          Địa chỉ
        </h5>
        <div class="mb-3">
          <label for="address" class="form-label">
            <i class="bi bi-house me-1"></i>
            Địa chỉ
          </label>
          <textarea id="address" v-model="form.address" class="form-control" rows="3" placeholder="Nhập địa chỉ chi tiết"></textarea>
        </div>
      </div>
      <div class="form-actions mt-3">
        <button type="submit" class="btn btn-primary" :disabled="updating">
          <i class="bi bi-check-circle me-2"></i>
          <span v-if="updating">Đang cập nhật...</span>
          <span v-else>Cập nhật thông tin</span>
        </button>
        <button type="button" class="btn btn-outline-secondary ms-2" @click="onReset">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Làm mới
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const props = defineProps<{ form: any, updating: boolean }>()
const emit = defineEmits(['update', 'reset'])
const onUpdate = () => emit('update')
const onReset = () => emit('reset')
</script>

<style scoped>
.gradient-bg-light {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  position: relative;
  overflow: hidden;
}

.gradient-bg-light::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.08"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.12"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.profile-info-card .content-header {
  position: relative;
  z-index: 1;
}

.profile-info-card .form-label,
.profile-info-card .section-title {
  color: #fff;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.profile-info-card .section-title {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255,255,255,0.2);
}

.profile-info-card .form-control,
.profile-info-card textarea {
  background: rgba(255,255,255,0.9);
  color: #333;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.profile-info-card .form-control:focus,
.profile-info-card textarea:focus {
  background: #fff;
  color: #222;
  border-color: rgba(255,255,255,0.8);
  box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.profile-info-card .form-control::placeholder,
.profile-info-card textarea::placeholder {
  color: #6c757d;
}

.btn-primary {
  background: #fff;
  color: #ff6b35;
  border: 2px solid #fff;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  background: #fff;
  color: #ff6b35;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255,255,255,0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  transform: none;
}

.btn-outline-secondary {
  border-color: rgba(255,255,255,0.6);
  color: #fff;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background: #fff;
  color: #ff6b35;
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,255,255,0.2);
}

.form-section {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255,255,255,0.2);
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .gradient-bg-light {
    border-radius: 14px;
    padding: 1.5rem;
  }
  
  .btn-primary,
  .btn-outline-secondary {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
