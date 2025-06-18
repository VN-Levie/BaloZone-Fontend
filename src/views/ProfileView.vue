<template>
  <div class="profile-page">
    <div class="container-fluid px-4 py-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-4 mb-4">
          <div class="profile-sidebar">
            <div class="user-info">
              <div class="user-avatar">
                <i class="bi bi-person-circle"></i>
              </div>
              <h5 class="user-name">{{ user?.name || 'User' }}</h5>
              <p class="user-email">{{ user?.email }}</p>
            </div>
            
            <nav class="profile-nav">
              <ul class="nav-list">
                <li>
                  <a href="#profile" class="nav-link active" @click.prevent="activeTab = 'profile'">
                    <i class="bi bi-person"></i>
                    Thông tin cá nhân
                  </a>
                </li>
                <li>
                  <router-link to="/orders" class="nav-link">
                    <i class="bi bi-box"></i>
                    Đơn hàng của tôi
                  </router-link>
                </li>
                <li>
                  <a href="#addresses" class="nav-link" @click.prevent="activeTab = 'addresses'">
                    <i class="bi bi-geo-alt"></i>
                    Sổ địa chỉ
                  </a>
                </li>
                <li>
                  <a href="#password" class="nav-link" @click.prevent="activeTab = 'password'">
                    <i class="bi bi-shield-lock"></i>
                    Đổi mật khẩu
                  </a>
                </li>
                <li>
                  <router-link to="/wishlist" class="nav-link">
                    <i class="bi bi-heart"></i>
                    Danh sách yêu thích
                  </router-link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-lg-9 col-md-8">
          <!-- Profile Info -->
          <div v-if="activeTab === 'profile'" class="profile-content">
            <h3 class="content-title">Thông tin cá nhân</h3>
            
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="name" class="form-label">Họ và tên *</label>
                  <input
                    id="name"
                    v-model="profileForm.name"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    id="email"
                    v-model="profileForm.email"
                    type="email"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="phone" class="form-label">Số điện thoại</label>
                  <input
                    id="phone"
                    v-model="profileForm.phone"
                    type="tel"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="birthdate" class="form-label">Ngày sinh</label>
                  <input
                    id="birthdate"
                    v-model="profileForm.birthdate"
                    type="date"
                    class="form-control"
                  />
                </div>
              </div>
              
              <div class="mb-3">
                <label for="address" class="form-label">Địa chỉ</label>
                <textarea
                  id="address"
                  v-model="profileForm.address"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="updating">
                  <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
                  {{ updating ? 'Đang cập nhật...' : 'Cập nhật thông tin' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Address Book -->
          <div v-if="activeTab === 'addresses'" class="profile-content">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="content-title mb-0">Sổ địa chỉ</h3>
              <button class="btn btn-primary" @click="showAddAddressModal = true">
                <i class="bi bi-plus"></i>
                Thêm địa chỉ mới
              </button>
            </div>
            
            <div class="addresses-grid">
              <div 
                v-for="address in addresses" 
                :key="address.id"
                class="address-card"
              >
                <div class="address-content">
                  <div class="address-header">
                    <span class="address-type">{{ address.type || 'Địa chỉ' }}</span>
                    <span v-if="address.is_default" class="badge bg-primary">Mặc định</span>
                  </div>
                  <p class="address-text">{{ address.address }}</p>
                  <p class="address-details">{{ address.city }}, {{ address.postal_code }}</p>
                </div>
                <div class="address-actions">
                  <button class="btn btn-sm btn-outline-primary">Sửa</button>
                  <button class="btn btn-sm btn-outline-danger">Xóa</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Change Password -->
          <div v-if="activeTab === 'password'" class="profile-content">
            <h3 class="content-title">Đổi mật khẩu</h3>
            
            <form @submit.prevent="changePassword" class="password-form">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Mật khẩu hiện tại *</label>
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="newPassword" class="form-label">Mật khẩu mới *</label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới *</label>
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="changingPassword">
                  <span v-if="changingPassword" class="spinner-border spinner-border-sm me-2"></span>
                  {{ changingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { userApi, addressBookApi } from '@/services/api'

const { user } = useAuth()

const activeTab = ref('profile')
const updating = ref(false)
const changingPassword = ref(false)
const showAddAddressModal = ref(false)

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  birthdate: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const addresses = ref<any[]>([])

const loadProfile = async () => {
  try {
    const response = await userApi.getProfile()
    const userData = response.data
    
    profileForm.name = userData.name || ''
    profileForm.email = userData.email || ''
    profileForm.phone = userData.phone || ''
    profileForm.address = userData.address || ''
    profileForm.birthdate = userData.birthdate || ''
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

const loadAddresses = async () => {
  try {
    const response = await addressBookApi.getAddresses()
    addresses.value = response.data || []
  } catch (error) {
    console.error('Failed to load addresses:', error)
  }
}

const updateProfile = async () => {
  updating.value = true
  try {
    await userApi.updateProfile(profileForm)
    alert('Cập nhật thông tin thành công!')
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert('Cập nhật thông tin thất bại!')
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!')
    return
  }
  
  changingPassword.value = true
  try {
    await userApi.changePassword({
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword,
      new_password_confirmation: passwordForm.confirmPassword
    })
    alert('Đổi mật khẩu thành công!')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('Failed to change password:', error)
    alert('Đổi mật khẩu thất bại!')
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  loadProfile()
  loadAddresses()
})
</script>

<style scoped>
.profile-page {
  min-height: 80vh;
  background: #f8f9fa;
}

.profile-sidebar {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 2rem;
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.user-avatar i {
  font-size: 4rem;
  color: #6c757d;
}

.user-name {
  margin: 1rem 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.user-email {
  color: #6c757d;
  margin: 0;
}

.profile-nav .nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-nav .nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #6c757d;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.profile-nav .nav-link:hover,
.profile-nav .nav-link.active {
  background: #007bff;
  color: white;
}

.profile-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #333;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.addresses-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.address-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f8f9fa;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.address-type {
  font-weight: 600;
  color: #333;
}

.address-text {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.address-details {
  color: #6c757d;
  margin-bottom: 1rem;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .profile-sidebar {
    position: static;
    margin-bottom: 2rem;
  }
  
  .addresses-grid {
    grid-template-columns: 1fr;
  }
}
</style>
