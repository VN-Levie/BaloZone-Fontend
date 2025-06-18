<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="login-card position-relative">
            <FormLoading :visible="loading" message="Đang đăng nhập..." />
            
            <div class="text-center mb-4">
              <h2 class="login-title">Đăng nhập</h2>
              <p class="text-muted">Chào mừng bạn quay trở lại!</p>
              
              <!-- Demo account info -->
              <div class="demo-info">
                <small class="text-info">
                  <i class="bi bi-info-circle"></i>
                  Demo: test@example.com / password
                </small>
              </div>
            </div>

            <form @submit.prevent="handleLogin">
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

              <div class="mb-3 form-check">
                <input
                  id="remember"
                  v-model="form.remember"
                  type="checkbox"
                  class="form-check-input"
                />
                <label for="remember" class="form-check-label">
                  Ghi nhớ đăng nhập
                </label>
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
                {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <p class="mb-0">
                Chưa có tài khoản?
                <router-link to="/register" class="link-primary">Đăng ký ngay</router-link>
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
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { parseAuthError } from '@/utils/errorHandler'
import AlertComponent from '@/components/AlertComponent.vue'
import FormLoading from '@/components/FormLoading.vue'
import type { LoginCredentials } from '@/types'

const router = useRouter()
const route = useRoute()
const { login, refreshUser } = useAuth()
const { showLoginSuccess } = useToast()

const loading = ref(false)
const showPassword = ref(false)
const generalError = ref('')

const form = reactive<LoginCredentials & { remember: boolean }>({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const validateForm = (): boolean => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'Email là bắt buộc'
    return false
  }
  
  if (!form.password) {
    errors.password = 'Mật khẩu là bắt buộc'
    return false
  }
  
  if (form.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  generalError.value = ''
  
  try {
    const response = await login(form.email, form.password)
    
    // Đảm bảo user state luôn mới nhất
    await refreshUser()
    
    // Show success toast
    showLoginSuccess(response.user.name || 'User')
    
    // Redirect to intended page or home
    const redirectTo = (route.query.redirect as string) || '/'
    router.push(redirectTo)
    
  } catch (error: any) {
    console.error('Login failed:', error)
    generalError.value = parseAuthError(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.demo-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e3f2fd;
  border-radius: 8px;
  border: 1px solid #bbdefb;
}

.demo-info small {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
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
</style>
