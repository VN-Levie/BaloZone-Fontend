<template>
  <div class="profile-page" style="background:linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); min-height:100vh; padding: 2rem 0;">
    <div class="container-fluid px-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-4 mb-4">
          <ProfileSidebar :user="user" :activeTab="activeTab" @change-tab="activeTab = $event" />
        </div>
        <!-- Main Content -->
        <div class="col-lg-9 col-md-8">
          <ProfileInfoCard v-if="activeTab === 'profile'" :form="profileForm" :updating="updating" @update="updateProfile" @reset="loadProfile" />
          <!-- Address Book -->
          <div v-if="activeTab === 'addresses'" class="profile-content address-section">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 class="content-title mb-1">
                  <i class="bi bi-geo-alt-fill me-2"></i>
                  Sổ địa chỉ
                </h3>
                <p class="text-muted mb-0">Quản lý địa chỉ giao hàng của bạn</p>
              </div>
              <button class="btn btn-primary btn-add-address" @click="showAddAddressModal = true">
                <i class="bi bi-plus-circle me-2"></i>
                Thêm địa chỉ mới
              </button>
            </div>
            <div class="addresses-grid">
              <div v-for="address in addresses" :key="address.id" class="address-card">
                <div class="address-content">
                  <div class="address-header">
                    <span class="address-type">
                      <i class="bi bi-house-door me-1"></i>
                      {{ address.name }}
                    </span>
                    <span v-if="address.is_default" class="badge bg-success">
                      <i class="bi bi-check-circle me-1"></i>
                      Mặc định
                    </span>
                  </div>
                  <p class="address-text">{{ address.address }}</p>
                  <p class="address-details">
                    <i class="bi bi-geo me-1"></i>
                    {{ address.ward }}, {{ address.district }}, {{ address.province }}
                  </p>
                  <p class="address-details">
                    <i class="bi bi-telephone me-1"></i>
                    {{ address.phone }}
                  </p>
                </div>
                <div class="address-actions">
                  <button class="btn btn-sm btn-outline-primary" @click="openEditAddress(address)">
                    <i class="bi bi-pencil me-1"></i>
                    Sửa
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="() => handleDeleteAddress(address.id)">
                    <i class="bi bi-trash me-1"></i>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
            <AddressFormModal v-if="showAddAddressModal" :isEdit="false" @submit="handleAddAddress" @cancel="() => showAddAddressModal = false" :backendError="addAddressBackendError" />
            <AddressFormModal v-if="showEditAddressModal" :isEdit="true" :modelValue="editingAddress" @submit="handleEditAddress" @cancel="closeEditAddressModal" :backendError="editAddressBackendError" />
          </div>
          <!-- Change Password -->
          <div v-if="activeTab === 'password'" class="profile-content password-section">
            <div class="content-header mb-4">
              <h3 class="content-title">
                <i class="bi bi-shield-lock-fill me-2"></i>
                Đổi mật khẩu
              </h3>
              <p class="text-muted">Cập nhật mật khẩu để bảo mật tài khoản của bạn</p>
            </div>
            <form @submit.prevent="changePassword" class="password-form">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">
                  <i class="bi bi-lock me-1"></i>
                  Mật khẩu hiện tại *
                </label>
                <input id="currentPassword" v-model="passwordForm.currentPassword" type="password" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">
                  <i class="bi bi-key me-1"></i>
                  Mật khẩu mới *
                </label>
                <input id="newPassword" v-model="passwordForm.newPassword" type="password" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">
                  <i class="bi bi-check-circle me-1"></i>
                  Xác nhận mật khẩu mới *
                </label>
                <input id="confirmPassword" v-model="passwordForm.confirmPassword" type="password" class="form-control" required />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="changingPassword">
                  <span v-if="changingPassword" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
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
import ProfileSidebar from '@/components/ProfileSidebar.vue'
import ProfileInfoCard from '@/components/ProfileInfoCard.vue'
import AddressFormModal from '@/components/AddressFormModal.vue'

const { user, updateUser } = useAuth()

const activeTab = ref('profile')
const updating = ref(false)
const changingPassword = ref(false)
const showAddAddressModal = ref(false)
const editingAddress = ref<any | null>(null)
const showEditAddressModal = ref(false)

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const addresses = ref<any[]>([])
const addAddressBackendError = ref<any>(null)
const editAddressBackendError = ref<any>(null)

const loadProfile = async () => {
  try {
    const response = await userApi.getProfile()
    const userData = response.data

    profileForm.name = userData.name || ''
    profileForm.email = userData.email || ''
    profileForm.phone = userData.phone || ''
    profileForm.address = userData.address || ''
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
    const response = await userApi.updateProfile(profileForm)
    // Update user data in store
    if (response.data) {
      updateUser(response.data)
    }
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

function handleAddAddress(address: any) {
  addAddressBackendError.value = null
  addressBookApi.createAddress(address)
    .then(() => {
      showAddAddressModal.value = false
      loadAddresses()
    })
    .catch(async (err) => {
      try {
        const data = err instanceof Error && err.message ? JSON.parse(err.message.replace(/^HTTP \d+: /, '')) : null
        addAddressBackendError.value = data
      } catch { addAddressBackendError.value = { message: 'Lỗi không xác định' } }
    })
}

function handleEditAddress(address: any) {
  if (!editingAddress.value) return
  editAddressBackendError.value = null
  addressBookApi.updateAddress(editingAddress.value.id, address)
    .then(() => {
      showEditAddressModal.value = false
      editingAddress.value = null
      loadAddresses()
    })
    .catch(async (err) => {
      try {
        const data = err instanceof Error && err.message ? JSON.parse(err.message.replace(/^HTTP \d+: /, '')) : null
        editAddressBackendError.value = data
      } catch { editAddressBackendError.value = { message: 'Lỗi không xác định' } }
    })
}

function handleDeleteAddress(id: number) {
  if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return
  addressBookApi.deleteAddress(id)
    .then(() => loadAddresses())
    .catch(() => alert('Xóa địa chỉ thất bại!'))
}

// Sửa lại các sự kiện để dùng biến đúng kiểu ref
function openEditAddress(address: any) {
  editingAddress.value = address
  showEditAddressModal.value = true
}
function closeEditAddressModal() {
  showEditAddressModal.value = false
  editingAddress.value = null
}

onMounted(() => {
  loadProfile()
  loadAddresses()
})
</script>

<style scoped>
.profile-content {
  background: white;
  border-radius: 18px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.content-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.addresses-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.address-card {
  border: none;
  border-radius: 12px;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.address-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.address-type {
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
}

.address-text {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.address-details {
  color: #6c757d;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.address-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-add-address {
  background: white;
  color: #ff6b35;
  border: 2px solid white;
  border-radius: 12px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-add-address:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.password-section .form-control {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.password-section .form-control:focus {
  border-color: #ff6b35;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
}

.password-section .form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.password-section .btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  border-radius: 10px;
  padding: 0.75rem 2rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.password-section .btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
}

.address-section .content-header {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .addresses-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-content {
    padding: 1.5rem;
  }
  
  .btn-add-address {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
