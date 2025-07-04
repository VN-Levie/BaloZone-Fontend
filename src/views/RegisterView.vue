<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="register-card position-relative">
            <FormLoading :visible="loading" message="Đang đăng ký..." />
            
            <div class="text-center mb-4">
              <h2 class="register-title">Đăng ký</h2>
              <p class="text-muted">Tạo tài khoản mới để bắt đầu mua sắm</p>
            </div>

            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label">Họ và tên</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Nhập họ và tên"
                  required
                />
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="Nhập email của bạn"
                  required
                />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <div class="input-group">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
                <div v-if="errors.confirmPassword" class="invalid-feedback">
                  {{ errors.confirmPassword }}
                </div>
              </div>

              <div class="mb-3 form-check">
                <input
                  id="terms"
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="form-check-input"
                  :class="{ 'is-invalid': errors.acceptTerms }"
                  required
                />
                <label for="terms" class="form-check-label">
                  Tôi đồng ý với <a href="#" class="link-primary">Điều khoản sử dụng</a>
                  và <a href="#" class="link-primary">Chính sách bảo mật</a>
                </label>
                <div v-if="errors.acceptTerms" class="invalid-feedback">
                  {{ errors.acceptTerms }}
                </div>
              </div>

              <AlertComponent
                v-if="generalError"
                type="error"
                :message="generalError"
                @close="generalError = ''"
              />

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <p class="mb-0">
                Đã có tài khoản?
                <router-link to="/login" class="link-primary">Đăng nhập ngay</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { parseAuthError } from '@/utils/errorHandler'
import AlertComponent from '@/components/AlertComponent.vue'
import FormLoading from '@/components/FormLoading.vue'

const router = useRouter()
const { register } = useAuth()
const { showSuccess } = useToast()

const loading = ref(false)
const showPassword = ref(false)
const generalError = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
})

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  if (!form.name.trim()) {
    errors.name = 'Họ và tên là bắt buộc'
    isValid = false
  }
  
  if (!form.email) {
    errors.email = 'Email là bắt buộc'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'Mật khẩu là bắt buộc'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    isValid = false
  }
  
  if (!form.acceptTerms) {
    errors.acceptTerms = 'Bạn phải đồng ý với điều khoản sử dụng'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  generalError.value = ''
  
  try {
    const response = await register(form.name, form.email, form.password)
    
    // Show success toast
    showSuccess(
      'Đăng ký thành công!',
      `Chào mừng ${response.data.user.name} đến với BaloZone!`
    )
    
    // Redirect to home
    router.push('/')
    
  } catch (error: any) {
    console.error('Registration failed:', error)
    generalError.value = parseAuthError(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.register-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #e9ecef;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-outline-secondary {
  border-color: #e9ecef;
}

.link-primary {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.link-primary:hover {
  text-decoration: underline;
}

.alert {
  border-radius: 8px;
  border: none;
}

.invalid-feedback {
  display: block;
}

.form-check-input.is-invalid {
  border-color: #dc3545;
}
</style>
