<template>
    <div class="admin-layout d-flex">
        <!-- Sidebar -->
        <nav id="sidebar" class="sidebar bg-dark text-white position-fixed h-100 shadow-sm" :class="{ 'collapsed': sidebarCollapsed, 'show': showMobileSidebar }">
            <!-- Overlay for mobile -->
            <div class="sidebar-overlay d-md-none" :class="{ 'show': showMobileSidebar }" @click="closeMobileSidebar"></div>
            <div class="sidebar-header p-3 border-bottom border-secondary">
                <div class="d-flex align-items-center">
                    <div class="sidebar-brand" v-show="!sidebarCollapsed">
                        <h5 class="mb-0 fw-bold text-primary">BaloZone Admin</h5>
                    </div>
                    <div class="sidebar-brand-icon" v-show="sidebarCollapsed">
                        <i class="bi bi-bag-fill text-primary fs-4"></i>
                    </div>
                </div>
            </div>

            <div class="sidebar-content flex-grow-1 py-3">
                <ul class="nav nav-pills flex-column">
                    <!-- Dashboard -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/dashboard" class="nav-link d-flex align-items-center px-3 py-2" active-class="active">
                            <i class="bi bi-speedometer2 me-2"></i>
                            <span v-show="!sidebarCollapsed">Dashboard</span>
                        </router-link>
                    </li>

                    <!-- Products Management -->
                    <li class="nav-item mb-1">
                        <div class="nav-link d-flex align-items-center px-3 py-2 dropdown-toggle" @click="toggleDropdown('products')" :class="{ 'active': isActiveDropdown('products') }">
                            <i class="bi bi-box me-2"></i>
                            <span v-show="!sidebarCollapsed">Sản phẩm</span>
                            <i class="bi bi-chevron-down ms-auto" v-show="!sidebarCollapsed" :class="{ 'rotated': dropdowns.products }"></i>
                        </div>
                        <div class="collapse" :class="{ 'show': dropdowns.products }" v-show="!sidebarCollapsed">
                            <ul class="nav flex-column ms-3">
                                <li class="nav-item">
                                    <router-link to="/admin/products" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-list-ul me-2"></i>Danh sách
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/products/create" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-plus-circle me-2"></i>Thêm mới
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/products/trashed" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-trash me-2"></i>Thùng rác
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <!-- Categories Management -->
                    <li class="nav-item mb-1">
                        <div class="nav-link d-flex align-items-center px-3 py-2 dropdown-toggle" @click="toggleDropdown('categories')" :class="{ 'active': isActiveDropdown('categories') }">
                            <i class="bi bi-tags me-2"></i>
                            <span v-show="!sidebarCollapsed">Danh mục</span>
                            <i class="bi bi-chevron-down ms-auto" v-show="!sidebarCollapsed" :class="{ 'rotated': dropdowns.categories }"></i>
                        </div>
                        <div class="collapse" :class="{ 'show': dropdowns.categories }" v-show="!sidebarCollapsed">
                            <ul class="nav flex-column ms-3">
                                <li class="nav-item">
                                    <router-link to="/admin/categories" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-list-ul me-2"></i>Danh sách
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/categories/create" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-plus-circle me-2"></i>Thêm mới
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/categories/trashed" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-trash me-2"></i>Thùng rác
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <!-- Brands Management -->
                    <li class="nav-item mb-1">
                        <div class="nav-link d-flex align-items-center px-3 py-2 dropdown-toggle" @click="toggleDropdown('brands')" :class="{ 'active': isActiveDropdown('brands') }">
                            <i class="bi bi-award me-2"></i>
                            <span v-show="!sidebarCollapsed">Thương hiệu</span>
                            <i class="bi bi-chevron-down ms-auto" v-show="!sidebarCollapsed" :class="{ 'rotated': dropdowns.brands }"></i>
                        </div>
                        <div class="collapse" :class="{ 'show': dropdowns.brands }" v-show="!sidebarCollapsed">
                            <ul class="nav flex-column ms-3">
                                <li class="nav-item">
                                    <router-link to="/admin/brands" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-list-ul me-2"></i>Danh sách
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/brands/create" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-plus-circle me-2"></i>Thêm mới
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/brands/trashed" class="nav-link py-1 px-3" active-class="active">
                                        <i class="bi bi-trash me-2"></i>Thùng rác
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <!-- Orders Management -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/orders" class="nav-link d-flex align-items-center px-3 py-2" active-class="active">
                            <i class="bi bi-cart3 me-2"></i>
                            <span v-show="!sidebarCollapsed">Đơn hàng</span>
                        </router-link>
                    </li>

                    <!-- Users Management -->
                    <li class="nav-item mb-1" v-if="authStore.isAdmin">
                        <router-link to="/admin/users" class="nav-link d-flex align-items-center px-3 py-2" active-class="active">
                            <i class="bi bi-people me-2"></i>
                            <span v-show="!sidebarCollapsed">Người dùng</span>
                        </router-link>
                    </li>

                    <!-- Sales Campaigns -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/sale-campaigns" class="nav-link d-flex align-items-center px-3 py-2" active-class="active">
                            <i class="bi bi-percent me-2"></i>
                            <span v-show="!sidebarCollapsed">Khuyến mãi</span>
                        </router-link>
                    </li>

                    <!-- News Management -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/news" class="nav-link d-flex align-items-center px-3 py-2" active-class="active">
                            <i class="bi bi-newspaper me-2"></i>
                            <span v-show="!sidebarCollapsed">Tin tức</span>
                        </router-link>
                    </li>

                    <!-- Vouchers -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/vouchers" class="nav-link d-flex align-items-center px-3 py-2" active-class="active">
                            <i class="bi bi-ticket me-2"></i>
                            <span v-show="!sidebarCollapsed">Vouchers</span>
                        </router-link>
                    </li>

                    <!-- Contact Messages -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/contacts" class="nav-link d-flex align-items-center px-3 py-2" active-class="active">
                            <i class="bi bi-envelope me-2"></i>
                            <span v-show="!sidebarCollapsed">Liên hệ</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- User Info -->
            <div class="sidebar-footer border-top border-secondary p-3">
                <div class="dropdown dropup">
                    <a href="#" class="d-flex align-items-center text-decoration-none text-white dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">

                        <div v-show="!sidebarCollapsed">
                            <div class="fw-semibold">{{ authStore.user?.name }}</div>
                            <div class="small text-white">{{ authStore.user?.email }}</div>
                        </div>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li><router-link class="dropdown-item" to="/profile">
                                <i class="bi bi-person me-2"></i>Hồ sơ
                            </router-link></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="#" @click.prevent="logout">
                                <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                            </a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Main Content Area -->
        <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
            <!-- Top Navigation -->
            <header class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
                <div class="container-fluid">
                    <!-- Sidebar Toggle -->
                    <button class="btn btn-link d-lg-inline-block p-0 me-3" @click="toggleSidebar" type="button">
                        <i class="bi bi-list fs-4"></i>
                    </button>

                    <!-- Breadcrumb -->
                    <nav aria-label="breadcrumb" class="d-none d-md-block">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item">
                                <router-link to="/admin/dashboard" class="text-decoration-none">
                                    <i class="bi bi-house-door me-1"></i>Admin
                                </router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">{{ currentPageTitle }}</li>
                        </ol>
                    </nav>

                    <div class="ms-auto d-flex align-items-center">
                        <!-- Notifications -->
                        <div class="dropdown me-3">
                            <button class="btn btn-link position-relative p-2" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-bell fs-5"></i>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" v-if="notificationCount > 0">
                                    {{ notificationCount }}
                                </span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end p-0" style="width: 300px;">
                                <div class="dropdown-header border-bottom">
                                    <h6 class="mb-0">Thông báo</h6>
                                </div>
                                <div class="list-group list-group-flush">
                                    <div class="dropdown-item text-center py-3 text-muted" v-if="notificationCount === 0">
                                        Không có thông báo mới
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-plus-lg me-1"></i>
                                <span class="d-none d-md-inline">Thêm mới</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><router-link class="dropdown-item" to="/admin/products/create">
                                        <i class="bi bi-box me-2"></i>Sản phẩm
                                    </router-link></li>
                                <li><router-link class="dropdown-item" to="/admin/categories/create">
                                        <i class="bi bi-tags me-2"></i>Danh mục
                                    </router-link></li>
                                <li><router-link class="dropdown-item" to="/admin/brands/create">
                                        <i class="bi bi-award me-2"></i>Thương hiệu
                                    </router-link></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><router-link class="dropdown-item" to="/admin/sale-campaigns/create">
                                        <i class="bi bi-percent me-2"></i>Chiến dịch khuyến mãi
                                    </router-link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="content-wrapper p-4">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Sidebar state
const sidebarCollapsed = ref(false)
const showMobileSidebar = ref(false)

// Dropdown states
const dropdowns = ref({
    products: false,
    categories: false,
    brands: false
})

// Notifications
const notificationCount = ref(0)

// Computed properties
const currentPageTitle = computed(() => {
    const routeMeta = route.meta
    return routeMeta?.title || route.name || 'Dashboard'
})

// Methods
const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
        showMobileSidebar.value = !showMobileSidebar.value
    } else {
        sidebarCollapsed.value = !sidebarCollapsed.value
        localStorage.setItem('admin-sidebar-collapsed', sidebarCollapsed.value.toString())
    }
}

const closeMobileSidebar = () => {
    showMobileSidebar.value = false
}

const toggleDropdown = (name: keyof typeof dropdowns.value) => {
    if (sidebarCollapsed.value) return
    dropdowns.value[name] = !dropdowns.value[name]
}

const isActiveDropdown = (name: string) => {
    return route.path.includes(`/admin/${name}`)
}

const logout = async () => {
    try {
        await authStore.logout()
        router.push('/auth/login')
    } catch (error) {
        console.error('Logout failed:', error)
    }
}

// Lifecycle
onMounted(() => {
    // Restore sidebar state
    const savedState = localStorage.getItem('admin-sidebar-collapsed')
    if (savedState !== null) {
        sidebarCollapsed.value = savedState === 'true'
    }

    // Auto-open relevant dropdown based on current route
    if (route.path.includes('/admin/products')) {
        dropdowns.value.products = true
    } else if (route.path.includes('/admin/categories')) {
        dropdowns.value.categories = true
    } else if (route.path.includes('/admin/brands')) {
        dropdowns.value.brands = true
    }
})
</script>

<style scoped>
.admin-layout {
    min-height: 100vh;
}

.sidebar {
    width: 280px;
    z-index: 1000;
    transition: all 0.3s ease;
}

.sidebar.collapsed {
    width: 80px;
}

.sidebar.collapsed .sidebar-content {
    overflow: visible;
}

.main-content {
    margin-left: 280px;
    transition: all 0.3s ease;
    width: calc(100% - 280px);
}

.main-content.sidebar-collapsed {
    margin-left: 80px;
    width: calc(100% - 80px);
}

.sidebar .nav-link {
    color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    margin: 0 12px;
    transition: all 0.2s ease;
}

.sidebar .nav-link:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
}

.sidebar .nav-link.active {
    color: white;
    background-color: var(--bs-primary);
}

.sidebar .dropdown-toggle {
    cursor: pointer;
}

.sidebar .dropdown-toggle:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
}

.sidebar .bi-chevron-down {
    transition: transform 0.2s ease;
}

.sidebar .bi-chevron-down.rotated {
    transform: rotate(180deg);
}

.content-wrapper {
    min-height: calc(100vh - 76px);
    background-color: #f8f9fa;
}

.navbar {
    height: 76px;
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar {
        width: 280px;
        transform: translateX(-100%);
        z-index: 1050;
    }

    .sidebar.show {
        transform: translateX(0);
    }

    .main-content {
        margin-left: 0;
        width: 100%;
    }

    .main-content.sidebar-collapsed {
        margin-left: 0;
        width: 100%;
    }

    .navbar .btn-link {
        display: block !important;
    }

    .content-wrapper {
        padding: 1rem !important;
    }
}

@media (max-width: 576px) {
    .sidebar {
        width: 100vw;
    }

    .navbar .breadcrumb {
        display: none !important;
    }
}

/* Custom scrollbar for sidebar */
.sidebar::-webkit-scrollbar {
    width: 6px;
}

.sidebar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.sidebar-overlay.show {
    opacity: 1;
    visibility: visible;
}
</style>
