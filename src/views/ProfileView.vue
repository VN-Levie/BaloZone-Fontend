<template>
  <UserLayout>
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
              <div class="address-header-section">
                <div class="header-content">
                  <h3 class="content-title mb-1">
                    <i class="bi bi-geo-alt-fill me-2"></i>
                    Sổ địa chỉ
                  </h3>
                  <p class="text-muted mb-0">Quản lý địa chỉ giao hàng của bạn</p>
                </div>
                <button v-if="!showAddForm && !showEditForm" class="btn btn-primary btn-add-address" @click="showAddForm = true">
                  <i class="bi bi-plus-circle me-2"></i>
                  Thêm địa chỉ mới
                </button>
              </div>

              <!-- Add Address Form -->
              <AddressForm v-if="showAddForm" :isEdit="false" :submitting="addingAddress" :backendError="addAddressBackendError" @submit="handleAddAddress" @cancel="cancelAddAddress" />

              <!-- Edit Address Form -->
              <AddressForm v-if="showEditForm" :isEdit="true" :modelValue="editingAddress" :submitting="editingAddressLoading" :backendError="editAddressBackendError" @submit="handleEditAddress" @cancel="cancelEditAddress" />

              <!-- Addresses List -->
              <div v-if="!showAddForm && !showEditForm" class="addresses-section">
                <div v-if="addresses.length === 0" class="no-addresses">
                  <div class="no-addresses-content">
                    <i class="bi bi-geo-alt text-muted"></i>
                    <h5>Chưa có địa chỉ nào</h5>
                    <p class="text-muted">Thêm địa chỉ đầu tiên để bắt đầu mua sắm</p>
                    <button class="btn btn-primary" @click="showAddForm = true">
                      <i class="bi bi-plus-circle me-2"></i>
                      Thêm địa chỉ ngay
                    </button>
                  </div>
                </div>

                <div v-else class="addresses-grid">
                  <div v-for="address in addresses" :key="address.id" class="address-card">
                    <div class="address-content">
                      <div class="address-header">
                        <span class="address-type">
                          <i class="bi bi-house-door me-1"></i>
                          {{ address.recipient_name }}
                        </span>
                        <span v-if="address.is_default" class="badge bg-success default-badge">
                          <i class="bi bi-star-fill me-1"></i>
                          Mặc định
                        </span>
                      </div>
                      <div class="address-info">
                        <p class="address-text">
                          <i class="bi bi-geo me-1"></i>
                          {{ address.address }}
                        </p>
                        <p class="address-details">
                          <i class="bi bi-map me-1"></i>
                          {{ address.ward }}, {{ address.district }}, {{ address.province }}
                        </p>
                        <p class="address-details">
                          <i class="bi bi-telephone me-1"></i>
                          {{ address.recipient_phone }}
                        </p>
                        <p v-if="address.postal_code" class="address-details">
                          <i class="bi bi-mailbox me-1"></i>
                          {{ address.postal_code }}
                        </p>
                      </div>
                    </div>
                    <div class="address-actions">
                      <button class="btn btn-sm btn-edit" @click="openEditAddress(address)">
                        <i class="bi bi-pencil me-1"></i>
                        Sửa
                      </button>
                      <button v-if="!address.is_default" class="btn btn-sm btn-default" @click="setAsDefault(address.id)">
                        <i class="bi bi-star me-1"></i>
                        Mặc định
                      </button>
                      <button class="btn btn-sm btn-delete" @click="() => handleDeleteAddress(address.id)">
                        <i class="bi bi-trash me-1"></i>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
        <div class="delete-modal" @click.stop>
          <div class="modal-header">
            <div class="modal-icon">
              <i class="bi bi-exclamation-triangle"></i>
            </div>
            <h4 class="modal-title">Xác nhận xóa địa chỉ</h4>
          </div>
          <div class="modal-body">
            <p class="modal-message">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
            <div v-if="addressToDelete" class="address-preview">
              <div class="preview-header">
                <i class="bi bi-house-door me-2"></i>
                {{ addressToDelete.recipient_name }}
              </div>
              <div class="preview-info">
                {{ addressToDelete.address }}<br>
                {{ addressToDelete.ward }}, {{ addressToDelete.district }}, {{ addressToDelete.province }}
              </div>
            </div>
            <p class="warning-text">
              <i class="bi bi-info-circle me-2"></i>
              Hành động này không thể hoàn tác
            </p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-cancel" @click="cancelDelete">
              <i class="bi bi-x-circle me-2"></i>
              Hủy bỏ
            </button>
            <button class="btn btn-confirm-delete" @click="confirmDelete" :disabled="deletingAddress">
              <span v-if="deletingAddress" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-trash me-2"></i>
              {{ deletingAddress ? 'Đang xóa...' : 'Xác nhận xóa' }}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { userApi, addressBookApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import ProfileSidebar from '@/components/ProfileSidebar.vue'
import ProfileInfoCard from '@/components/ProfileInfoCard.vue'
import AddressForm from '@/components/AddressForm.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import UserLayout from '@/components/layouts/UserLayout.vue'

const { user, updateUser } = useAuth()
const { showToast } = useToast()

const activeTab = ref('profile')
const updating = ref(false)
const changingPassword = ref(false)
const showAddForm = ref(false)
const showEditForm = ref(false)
const editingAddress = ref<any | null>(null)
const addingAddress = ref(false)
const editingAddressLoading = ref(false)

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

// Delete modal states
const showDeleteModal = ref(false)
const addressToDelete = ref<any | null>(null)
const deletingAddress = ref(false)

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
    showToast('Cập nhật thông tin thành công!', 'success')
  } catch (error) {
    console.error('Failed to update profile:', error)
    showToast('Cập nhật thông tin thất bại!', 'error')
  } finally {
    updating.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showToast('Mật khẩu xác nhận không khớp!', 'error')
    return
  }

  changingPassword.value = true
  try {
    await userApi.changePassword({
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword,
      new_password_confirmation: passwordForm.confirmPassword
    })
    showToast('Đổi mật khẩu thành công!', 'success')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('Failed to change password:', error)
    showToast('Đổi mật khẩu thất bại!', 'error')
  } finally {
    changingPassword.value = false
  }
}

function handleAddAddress(address: any) {
  addingAddress.value = true
  addAddressBackendError.value = null
  addressBookApi.createAddress(address)
    .then(() => {
      showAddForm.value = false
      loadAddresses()
      showToast('Thêm địa chỉ thành công!', 'success')
    })
    .catch(async (err) => {
      try {
        const data = err instanceof Error && err.message ? JSON.parse(err.message.replace(/^HTTP \d+: /, '')) : null
        addAddressBackendError.value = data
        showToast('Thêm địa chỉ thất bại!', 'error')
      } catch {
        addAddressBackendError.value = { message: 'Lỗi không xác định' }
        showToast('Lỗi không xác định khi thêm địa chỉ!', 'error')
      }
    })
    .finally(() => {
      addingAddress.value = false
    })
}

function handleEditAddress(address: any) {
  if (!editingAddress.value) return
  editingAddressLoading.value = true
  editAddressBackendError.value = null
  addressBookApi.updateAddress(editingAddress.value.id, address)
    .then(() => {
      showEditForm.value = false
      editingAddress.value = null
      loadAddresses()
      showToast('Cập nhật địa chỉ thành công!', 'success')
    })
    .catch(async (err) => {
      try {
        const data = err instanceof Error && err.message ? JSON.parse(err.message.replace(/^HTTP \d+: /, '')) : null
        editAddressBackendError.value = data
        showToast('Cập nhật địa chỉ thất bại!', 'error')
      } catch {
        editAddressBackendError.value = { message: 'Lỗi không xác định' }
        showToast('Lỗi không xác định khi cập nhật địa chỉ!', 'error')
      }
    })
    .finally(() => {
      editingAddressLoading.value = false
    })
}

function handleDeleteAddress(addressId: number) {
  const address = addresses.value.find(addr => addr.id === addressId)
  if (address) {
    addressToDelete.value = address
    showDeleteModal.value = true
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  addressToDelete.value = null
}

function confirmDelete() {
  if (!addressToDelete.value) return

  deletingAddress.value = true
  addressBookApi.deleteAddress(addressToDelete.value.id)
    .then(() => {
      loadAddresses()
      showToast('Xóa địa chỉ thành công!', 'success')
      showDeleteModal.value = false
      addressToDelete.value = null
    })
    .catch((error) => {
      const msg = error.message ? (error.message.replace(/^HTTP \d+: /, '')) : null;
      console.error('Delete address error:', msg)
      showToast(msg, 'error', 'Xóa địa chỉ thất bại!')
    })
    .finally(() => {
      deletingAddress.value = false
    })
}

function openEditAddress(address: any) {
  editingAddress.value = { ...address }
  showEditForm.value = true
}

function cancelAddAddress() {
  showAddForm.value = false
  addAddressBackendError.value = null
}

function cancelEditAddress() {
  showEditForm.value = false
  editingAddress.value = null
  editAddressBackendError.value = null
}

function setAsDefault(addressId: number) {
  addressBookApi.setDefaultAddress(addressId)
    .then(() => {
      loadAddresses()
      showToast('Đặt địa chỉ mặc định thành công!', 'success')
    })
    .catch((error) => {
      console.error('Set default address error:', error)
      showToast('Đặt địa chỉ mặc định thất bại!', 'error')
    })
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

/* Address Section Styles */
.address-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 107, 53, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.header-content h3 {
  color: #2c3e50;
  font-weight: 700;
}

.header-content .text-muted {
  color: #6c757d !important;
  font-size: 0.95rem;
}

.btn-add-address {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0.875rem 2rem;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 6px 20px rgba(255, 107, 53, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  overflow: hidden;
  font-size: 0.95rem;
}

.btn-add-address::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.btn-add-address:hover::before {
  left: 100%;
}

.btn-add-address:hover {
  background: linear-gradient(135deg, #e55a2b 0%, #d6841a 100%);
  color: white;
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 12px 30px rgba(255, 107, 53, 0.4),
    0 4px 15px rgba(0, 0, 0, 0.15);
}

.addresses-section {
  margin-top: 1rem;
}

.no-addresses {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 2px dashed #dee2e6;
}

.no-addresses-content i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.no-addresses-content h5 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1rem;
}

.no-addresses-content p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.no-addresses .btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
}

.no-addresses .btn-primary:hover {
  background: linear-gradient(135deg, #e55a2b 0%, #d6841a 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.addresses-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.address-card {
  border: none;
  border-radius: 20px;
  padding: 0;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 1px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 2px solid transparent;
  position: relative;
}

.address-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {

  0%,
  100% {
    background-position: 200% 0;
  }

  50% {
    background-position: -200% 0;
  }
}

.address-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 20px 60px rgba(255, 107, 53, 0.2),
    0 8px 30px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 107, 53, 0.3);
}

.address-content {
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 107, 53, 0.1);
  position: relative;
}

.address-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
  border-radius: 2px;
}

.address-type {
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.address-type i {
  color: #ff6b35;
  font-size: 1.4rem;
  margin-right: 0.75rem;
  filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3));
}

.default-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
  border: none;
  border-radius: 12px;
  padding: 0.4rem 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.address-info {
  margin-bottom: 1.5rem;
}

.address-text {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.05rem;
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(247, 147, 30, 0.05) 100%);
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #ff6b35;
}

.address-text i {
  color: #ff6b35;
  margin-top: 0.2rem;
  flex-shrink: 0;
  font-size: 1.1rem;
}

.address-details {
  color: #6c757d;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.address-details:hover {
  color: #495057;
  transform: translateX(4px);
}

.address-details i {
  color: #ff6b35;
  width: 20px;
  flex-shrink: 0;
  font-size: 1rem;
  margin-right: 0.75rem;
  text-align: center;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f4 100%);
  border-top: 1px solid rgba(255, 107, 53, 0.1);
  flex-wrap: wrap;
  justify-content: center;
}

.btn-edit {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-edit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.btn-edit:hover::before {
  left: 100%;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  color: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
}

.btn-default {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #212529;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-default::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.btn-default:hover::before {
  left: 100%;
}

.btn-default:hover {
  background: linear-gradient(135deg, #e0a800 0%, #d39e00 100%);
  color: #212529;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-delete::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.btn-delete:hover::before {
  left: 100%;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
  color: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
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

  .address-header-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .btn-add-address {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
    width: 100%;
  }

  .address-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-edit,
  .btn-default,
  .btn-delete {
    width: 100%;
    min-width: auto;
  }

  .no-addresses {
    padding: 3rem 1.5rem;
  }

  .no-addresses-content i {
    font-size: 3rem;
  }

  .address-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .address-header-section {
    padding: 1rem;
  }

  .address-content {
    padding: 1rem;
  }

  .address-actions {
    padding: 1rem;
  }

  .no-addresses {
    padding: 2rem 1rem;
  }

  .addresses-grid {
    gap: 1rem;
  }
}

/* Delete Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.delete-modal {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.25),
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  max-width: 500px;
  width: 90%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-30px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.delete-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #dc3545 0%, #c82333 50%, #dc3545 100%);
  background-size: 200% 100%;
  animation: shimmerRed 3s ease-in-out infinite;
}

@keyframes shimmerRed {

  0%,
  100% {
    background-position: 200% 0;
  }

  50% {
    background-position: -200% 0;
  }
}

.modal-header {
  text-align: center;
  padding: 2.5rem 2rem 1rem;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.modal-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 10px 30px rgba(220, 53, 69, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  position: relative;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 10px 30px rgba(220, 53, 69, 0.3),
      0 4px 15px rgba(0, 0, 0, 0.1),
      inset 0 2px 4px rgba(255, 255, 255, 0.2);
  }

  50% {
    transform: scale(1.05);
    box-shadow:
      0 15px 40px rgba(220, 53, 69, 0.4),
      0 6px 20px rgba(0, 0, 0, 0.15),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  }
}

.modal-icon i {
  font-size: 2.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.modal-body {
  padding: 0 2rem 1.5rem;
}

.modal-message {
  font-size: 1.15rem;
  color: #495057;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-weight: 500;
}

.address-preview {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%);
  border: 2px solid rgba(220, 53, 69, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  position: relative;
  overflow: hidden;
}

.address-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #dc3545 0%, #c82333 100%);
}

.preview-header {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.preview-header i {
  color: #dc3545;
  font-size: 1.3rem;
}

.preview-info {
  color: #6c757d;
  line-height: 1.6;
  font-size: 1rem;
}

.warning-text {
  color: #856404;
  font-size: 0.95rem;
  text-align: center;
  margin: 1.5rem 0 0;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 235, 59, 0.05) 100%);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warning-text i {
  color: #ffc107;
  font-size: 1.1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem 2.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.btn-cancel {
  flex: 1;
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-cancel::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.btn-cancel:hover::before {
  left: 100%;
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  color: white;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 30px rgba(108, 117, 125, 0.4);
}

.btn-confirm-delete {
  flex: 1;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-confirm-delete::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.btn-confirm-delete:hover::before {
  left: 100%;
}

.btn-confirm-delete:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
  color: white;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 30px rgba(220, 53, 69, 0.4);
}

.btn-confirm-delete:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 576px) {
  .delete-modal {
    width: 95%;
    margin: 1rem;
  }

  .modal-header {
    padding: 2rem 1.5rem 1rem;
  }

  .modal-body {
    padding: 0 1.5rem 1rem;
  }

  .modal-actions {
    padding: 1rem 1.5rem 2rem;
    flex-direction: column;
  }

  .modal-icon {
    width: 70px;
    height: 70px;
  }

  .modal-icon i {
    font-size: 2rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }
}
</style>
