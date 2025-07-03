<template>
  <div class="admin-dashboard">
    <div class="container-fluid mt-4">
      <h1 class="mb-4">Admin Dashboard</h1>
      
      <!-- Permission Check -->
      <div v-if="!canAccess" class="alert alert-danger">
        <h4>Access Denied</h4>
        <p>You don't have permission to access this page. Admin or contributor role required.</p>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Quick Stats -->
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{ stats.totalUsers || 0 }}</h4>
                    <p class="mb-0">Total Users</p>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-users fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{ stats.totalProducts || 0 }}</h4>
                    <p class="mb-0">Total Products</p>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-shopping-bag fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card bg-warning text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{ stats.totalOrders || 0 }}</h4>
                    <p class="mb-0">Total Orders</p>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-shopping-cart fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{ stats.totalNews || 0 }}</h4>
                    <p class="mb-0">Total News</p>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-newspaper fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Management Sections -->
        <div class="row">
          <!-- Products Management -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Products Management</h5>
                <button
                  v-if="canManageProducts"
                  @click="showCreateProduct = true"
                  class="btn btn-primary btn-sm"
                >
                  <i class="fas fa-plus"></i> Add Product
                </button>
              </div>
              <div class="card-body">
                <div v-if="loading.products" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="recentProducts.length === 0" class="text-muted text-center py-3">
                    No products found
                  </div>
                  <div v-else class="list-group list-group-flush">
                    <div
                      v-for="product in recentProducts"
                      :key="product.id"
                      class="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div class="me-auto">
                        <div class="fw-bold">{{ product.name }}</div>
                        <small class="text-muted">{{ formatPrice(product.price) }}</small>
                      </div>
                      <div>
                        <button
                          v-if="canManageProducts"
                          @click="editProduct(product)"
                          class="btn btn-outline-primary btn-sm me-1"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          v-if="canManageProducts"
                          @click="deleteProduct(product.id)"
                          class="btn btn-outline-danger btn-sm"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- News Management -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">News Management</h5>
                <button
                  v-if="canManageNews"
                  @click="showCreateNews = true"
                  class="btn btn-primary btn-sm"
                >
                  <i class="fas fa-plus"></i> Add News
                </button>
              </div>
              <div class="card-body">
                <div v-if="loading.news" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="recentNews.length === 0" class="text-muted text-center py-3">
                    No news found
                  </div>
                  <div v-else class="list-group list-group-flush">
                    <div
                      v-for="article in recentNews"
                      :key="article.id"
                      class="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div class="me-auto">
                        <div class="fw-bold">{{ article.title }}</div>
                        <small class="text-muted">{{ formatDate(article.created_at) }}</small>
                      </div>
                      <div>
                        <button
                          v-if="canManageNews"
                          @click="editNews(article)"
                          class="btn btn-outline-primary btn-sm me-1"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          v-if="canManageNews"
                          @click="deleteNews(article.id)"
                          class="btn btn-outline-danger btn-sm"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders and Users Management (Admin Only) -->
        <div v-if="isAdmin" class="row">
          <!-- Orders Management -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Recent Orders</h5>
              </div>
              <div class="card-body">
                <div v-if="loading.orders" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="recentOrders.length === 0" class="text-muted text-center py-3">
                    No recent orders
                  </div>
                  <div v-else class="list-group list-group-flush">
                    <div
                      v-for="order in recentOrders"
                      :key="order.id"
                      class="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div class="me-auto">
                        <div class="fw-bold">Order #{{ order.id }}</div>
                        <small class="text-muted">{{ formatPrice(order.total_price) }}</small>
                      </div>
                      <span :class="getOrderStatusBadgeClass(order.payment_status)">
                        {{ order.payment_status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Users Management -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Recent Users</h5>
              </div>
              <div class="card-body">
                <div v-if="loading.users" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="recentUsers.length === 0" class="text-muted text-center py-3">
                    No recent users
                  </div>
                  <div v-else class="list-group list-group-flush">
                    <div
                      v-for="user in recentUsers"
                      :key="user.id"
                      class="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div class="me-auto">
                        <div class="fw-bold">{{ user.name }}</div>
                        <small class="text-muted">{{ user.email }}</small>
                      </div>
                      <div>
                        <RoleBadge
                          v-for="role in user.roles"
                          :key="role.id"
                          :role="role"
                          class="me-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3 mb-2" v-if="canManageProducts">
                    <router-link to="/admin/products" class="btn btn-outline-primary w-100">
                      <i class="fas fa-box"></i> Manage Products
                    </router-link>
                  </div>
                  <div class="col-md-3 mb-2" v-if="canManageNews">
                    <router-link to="/admin/news" class="btn btn-outline-info w-100">
                      <i class="fas fa-newspaper"></i> Manage News
                    </router-link>
                  </div>
                  <div class="col-md-3 mb-2" v-if="isAdmin">
                    <router-link to="/admin/orders" class="btn btn-outline-warning w-100">
                      <i class="fas fa-shopping-cart"></i> Manage Orders
                    </router-link>
                  </div>
                  <div class="col-md-3 mb-2" v-if="isAdmin">
                    <router-link to="/admin/users" class="btn btn-outline-success w-100">
                      <i class="fas fa-users"></i> Manage Users
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRoles } from '../composables/useRoles'
import { useAdminManagement } from '../composables/useAdminManagement'
import { productsApi, newsApi, ordersApi, adminUserApi } from '../services/api'
import { formatPrice, formatDate } from '../utils'
import type { Product, News, Order, User } from '../types'
import RoleBadge from '../components/RoleBadge.vue'

const { user, isAdmin, isContributor } = useAuth()
const { 
  productManagement: { delete: deleteProductApi },
  newsManagement: { delete: deleteNewsApi }
} = useAdminManagement()

// Permission checks
const canAccess = computed(() => isAdmin.value || isContributor.value)
const canManageProducts = computed(() => isAdmin.value || isContributor.value)
const canManageNews = computed(() => isAdmin.value || isContributor.value)

// Data
const stats = ref({
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalNews: 0
})

const loading = ref({
  products: false,
  news: false,
  orders: false,
  users: false
})

const recentProducts = ref<Product[]>([])
const recentNews = ref<News[]>([])
const recentOrders = ref<Order[]>([])
const recentUsers = ref<User[]>([])

const showCreateProduct = ref(false)
const showCreateNews = ref(false)

// Methods
const loadDashboardData = async () => {
  if (!canAccess.value) return

  try {
    // Load products
    if (canManageProducts.value) {
      loading.value.products = true
      const productsResponse = await productsApi.getProducts({ limit: 5 })
      recentProducts.value = productsResponse.data || []
      stats.value.totalProducts = productsResponse.total || recentProducts.value.length
      loading.value.products = false
    }

    // Load news
    if (canManageNews.value) {
      loading.value.news = true
      const newsResponse = await newsApi.getNews({ per_page: 5 })
      recentNews.value = newsResponse.data || []
      stats.value.totalNews = newsResponse.total || recentNews.value.length
      loading.value.news = false
    }

    // Load orders (admin only)
    if (isAdmin.value) {
      loading.value.orders = true
      const ordersResponse = await ordersApi.getAdminOrders(1)
      recentOrders.value = ordersResponse.data || []
      stats.value.totalOrders = ordersResponse.total || recentOrders.value.length
      loading.value.orders = false
    }

    // Load users (admin only)
    if (isAdmin.value) {
      loading.value.users = true
      const usersResponse = await adminUserApi.getUsers(1)
      recentUsers.value = usersResponse.data || []
      stats.value.totalUsers = usersResponse.total || recentUsers.value.length
      loading.value.users = false
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

const editProduct = (product: Product) => {
  // TODO: Navigate to product edit page or open modal
  console.log('Edit product:', product)
}

const deleteProduct = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await deleteProductApi(id)
      recentProducts.value = recentProducts.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}

const editNews = (article: News) => {
  // TODO: Navigate to news edit page or open modal
  console.log('Edit news:', article)
}

const deleteNews = async (id: number) => {
  if (confirm('Are you sure you want to delete this news article?')) {
    try {
      await deleteNewsApi(id)
      recentNews.value = recentNews.value.filter(n => n.id !== id)
    } catch (error) {
      console.error('Failed to delete news:', error)
    }
  }
}

const getOrderStatusBadgeClass = (status: string) => {
  const classes = 'badge '
  switch (status) {
    case 'pending': return classes + 'bg-warning'
    case 'processing': return classes + 'bg-info'
    case 'completed': return classes + 'bg-success'
    case 'cancelled': return classes + 'bg-danger'
    default: return classes + 'bg-secondary'
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard .card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.admin-dashboard .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.admin-dashboard .list-group-item {
  border-left: none;
  border-right: none;
}

.admin-dashboard .list-group-item:first-child {
  border-top: none;
}

.admin-dashboard .list-group-item:last-child {
  border-bottom: none;
}
</style>
