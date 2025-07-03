<template>
  <div class="api-tester">
    <div class="container">
      <h2>API Connection Tester</h2>
      <p class="lead">Test các API endpoints để đảm bảo kết nối với backend</p>
      
      <!-- Auth Test -->
      <div class="test-section">
        <h3>🔐 Auth & Roles Test</h3>
        <div class="test-grid">
          <div class="test-item">
            <button @click="testLogin" :disabled="loading" class="btn btn-primary">
              {{ loading ? '⏳' : '🔑' }} Test Login
            </button>
            <div v-if="results.login" class="test-result" :class="results.login.success ? 'success' : 'error'">
              {{ results.login.message }}
            </div>
          </div>
          
          <div class="test-item">
            <button @click="testRoles" :disabled="loading" class="btn btn-secondary">
              {{ loading ? '⏳' : '👥' }} Test Roles API
            </button>
            <div v-if="results.roles" class="test-result" :class="results.roles.success ? 'success' : 'error'">
              {{ results.roles.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Public APIs Test -->
      <div class="test-section">
        <h3>🌐 Public APIs Test</h3>
        <div class="test-grid">
          <div class="test-item">
            <button @click="testProducts" :disabled="loading" class="btn btn-info">
              {{ loading ? '⏳' : '📦' }} Test Products
            </button>
            <div v-if="results.products" class="test-result" :class="results.products.success ? 'success' : 'error'">
              {{ results.products.message }}
            </div>
          </div>
          
          <div class="test-item">
            <button @click="testCategories" :disabled="loading" class="btn btn-info">
              {{ loading ? '⏳' : '📂' }} Test Categories
            </button>
            <div v-if="results.categories" class="test-result" :class="results.categories.success ? 'success' : 'error'">
              {{ results.categories.message }}
            </div>
          </div>
          
          <div class="test-item">
            <button @click="testBrands" :disabled="loading" class="btn btn-info">
              {{ loading ? '⏳' : '🏷️' }} Test Brands
            </button>
            <div v-if="results.brands" class="test-result" :class="results.brands.success ? 'success' : 'error'">
              {{ results.brands.message }}
            </div>
          </div>
          
          <div class="test-item">
            <button @click="testNews" :disabled="loading" class="btn btn-info">
              {{ loading ? '⏳' : '📰' }} Test News
            </button>
            <div v-if="results.news" class="test-result" :class="results.news.success ? 'success' : 'error'">
              {{ results.news.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Authenticated APIs Test -->
      <div class="test-section" v-if="isAuthenticated">
        <h3>🔒 Authenticated APIs Test</h3>
        <div class="test-grid">
          <div class="test-item">
            <button @click="testProfile" :disabled="loading" class="btn btn-warning">
              {{ loading ? '⏳' : '👤' }} Test Profile
            </button>
            <div v-if="results.profile" class="test-result" :class="results.profile.success ? 'success' : 'error'">
              {{ results.profile.message }}
            </div>
          </div>
          
          <div class="test-item">
            <button @click="testOrders" :disabled="loading" class="btn btn-warning">
              {{ loading ? '⏳' : '🛍️' }} Test Orders
            </button>
            <div v-if="results.orders" class="test-result" :class="results.orders.success ? 'success' : 'error'">
              {{ results.orders.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Admin APIs Test -->
      <div class="test-section" v-if="isAdmin">
        <h3>⚡ Admin APIs Test</h3>
        <div class="test-grid">
          <div class="test-item">
            <button @click="testAdminUsers" :disabled="loading" class="btn btn-danger">
              {{ loading ? '⏳' : '👥' }} Test Admin Users
            </button>
            <div v-if="results.adminUsers" class="test-result" :class="results.adminUsers.success ? 'success' : 'error'">
              {{ results.adminUsers.message }}
            </div>
          </div>
          
          <div class="test-item">
            <button @click="testAdminOrders" :disabled="loading" class="btn btn-danger">
              {{ loading ? '⏳' : '📋' }} Test Admin Orders
            </button>
            <div v-if="results.adminOrders" class="test-result" :class="results.adminOrders.success ? 'success' : 'error'">
              {{ results.adminOrders.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- Test All -->
      <div class="test-section">
        <button @click="testAll" :disabled="loading" class="btn btn-success btn-lg">
          {{ loading ? '⏳ Testing...' : '🚀 Test All APIs' }}
        </button>
        <button @click="clearResults" class="btn btn-outline-secondary btn-lg ms-2">
          🧹 Clear Results
        </button>
      </div>

      <!-- Summary -->
      <div v-if="Object.keys(results).length > 0" class="test-summary">
        <h3>📊 Test Summary</h3>
        <div class="summary-stats">
          <div class="stat success">
            <strong>{{ successCount }}</strong>
            <span>Successful</span>
          </div>
          <div class="stat error">
            <strong>{{ errorCount }}</strong>
            <span>Failed</span>
          </div>
          <div class="stat total">
            <strong>{{ totalTests }}</strong>
            <span>Total</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { 
  authApi, 
  rolesApi, 
  productsApi, 
  categoriesApi, 
  brandsApi, 
  newsApi, 
  userApi, 
  ordersApi, 
  adminUserApi 
} from '@/services/api'

const { isAuthenticated, isAdmin } = useAuth()

const loading = ref(false)
const results = ref<Record<string, { success: boolean; message: string; data?: any }>>({})

// Computed properties for summary
const successCount = computed(() => 
  Object.values(results.value).filter(r => r.success).length
)
const errorCount = computed(() => 
  Object.values(results.value).filter(r => !r.success).length
)
const totalTests = computed(() => Object.keys(results.value).length)

// Test functions
const testLogin = async () => {
  loading.value = true
  try {
    const response = await authApi.login({
      email: 'admin@balozone.com',
      password: 'admin123'
    })
    results.value.login = {
      success: true,
      message: `✅ Login successful. User: ${response.user.name}, Roles: ${response.user.roles?.map(r => r.name).join(', ')}`,
      data: response
    }
  } catch (error: any) {
    results.value.login = {
      success: false,
      message: `❌ Login failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testRoles = async () => {
  loading.value = true
  try {
    const response = await rolesApi.getRoles()
    results.value.roles = {
      success: true,
      message: `✅ Roles loaded: ${response.data.length} roles found (${response.data.map(r => r.name).join(', ')})`,
      data: response
    }
  } catch (error: any) {
    results.value.roles = {
      success: false,
      message: `❌ Roles failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testProducts = async () => {
  loading.value = true
  try {
    const response = await productsApi.getProducts()
    results.value.products = {
      success: true,
      message: `✅ Products loaded: ${response.data.length} products, ${response.total} total`,
      data: response
    }
  } catch (error: any) {
    results.value.products = {
      success: false,
      message: `❌ Products failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testCategories = async () => {
  loading.value = true
  try {
    const response = await categoriesApi.getCategories()
    results.value.categories = {
      success: true,
      message: `✅ Categories loaded: ${response.data.length} categories`,
      data: response
    }
  } catch (error: any) {
    results.value.categories = {
      success: false,
      message: `❌ Categories failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testBrands = async () => {
  loading.value = true
  try {
    const response = await brandsApi.getBrands()
    results.value.brands = {
      success: true,
      message: `✅ Brands loaded: ${response.data.length} brands`,
      data: response
    }
  } catch (error: any) {
    results.value.brands = {
      success: false,
      message: `❌ Brands failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testNews = async () => {
  loading.value = true
  try {
    const response = await newsApi.getNews()
    results.value.news = {
      success: true,
      message: `✅ News loaded: ${response.data.length} articles`,
      data: response
    }
  } catch (error: any) {
    results.value.news = {
      success: false,
      message: `❌ News failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testProfile = async () => {
  loading.value = true
  try {
    const response = await userApi.getProfile()
    results.value.profile = {
      success: true,
      message: `✅ Profile loaded: ${response.data.name} (${response.data.email})`,
      data: response
    }
  } catch (error: any) {
    results.value.profile = {
      success: false,
      message: `❌ Profile failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testOrders = async () => {
  loading.value = true
  try {
    const response = await ordersApi.getUserOrders()
    results.value.orders = {
      success: true,
      message: `✅ Orders loaded: ${response.data.length} orders`,
      data: response
    }
  } catch (error: any) {
    results.value.orders = {
      success: false,
      message: `❌ Orders failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testAdminUsers = async () => {
  loading.value = true
  try {
    const response = await adminUserApi.getUsers()
    results.value.adminUsers = {
      success: true,
      message: `✅ Admin Users loaded: ${response.data.length} users`,
      data: response
    }
  } catch (error: any) {
    results.value.adminUsers = {
      success: false,
      message: `❌ Admin Users failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testAdminOrders = async () => {
  loading.value = true
  try {
    const response = await ordersApi.getAdminOrders()
    results.value.adminOrders = {
      success: true,
      message: `✅ Admin Orders loaded: ${response.data.length} orders`,
      data: response
    }
  } catch (error: any) {
    results.value.adminOrders = {
      success: false,
      message: `❌ Admin Orders failed: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

const testAll = async () => {
  clearResults()
  
  // Test public APIs
  await testProducts()
  await testCategories()
  await testBrands()
  await testNews()
  
  // Test login
  await testLogin()
  await testRoles()
  
  // Test authenticated APIs if logged in
  if (isAuthenticated.value) {
    await testProfile()
    await testOrders()
    
    // Test admin APIs if admin
    if (isAdmin.value) {
      await testAdminUsers()
      await testAdminOrders()
    }
  }
}

const clearResults = () => {
  results.value = {}
}
</script>

<style scoped>
.api-tester {
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.test-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.test-item {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  background: #f8f9fa;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary { background-color: #007bff; color: white; }
.btn-secondary { background-color: #6c757d; color: white; }
.btn-info { background-color: #17a2b8; color: white; }
.btn-warning { background-color: #ffc107; color: #212529; }
.btn-danger { background-color: #dc3545; color: white; }
.btn-success { background-color: #28a745; color: white; }
.btn-outline-secondary { 
  background-color: transparent; 
  color: #6c757d; 
  border: 1px solid #6c757d; 
}

.test-result {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  word-break: break-word;
}

.test-result.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.test-result.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.test-summary {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.stat {
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  min-width: 100px;
}

.stat strong {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat.success {
  background-color: #d4edda;
  color: #155724;
}

.stat.error {
  background-color: #f8d7da;
  color: #721c24;
}

.stat.total {
  background-color: #d1ecf1;
  color: #0c5460;
}

h2, h3 {
  color: #333;
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.125rem;
  color: #6c757d;
  margin-bottom: 2rem;
}
</style>
