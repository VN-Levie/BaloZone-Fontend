<template>
    <div class="admin-layout d-flex">
        <!-- Mobile Overlay -->
        <div class="sidebar-overlay d-md-none" :class="{ 'show': showMobileSidebar }" @click="closeMobileSidebar"></div>

        <!-- Sidebar -->
        <nav id="sidebar" class="sidebar position-fixed h-100 shadow-lg" :class="{ 'collapsed': sidebarCollapsed, 'show': showMobileSidebar }">
            <div class="sidebar-header p-4">
                <div class="d-flex align-items-center">
                    <div class="sidebar-brand" v-show="!sidebarCollapsed">
                        <div class="d-flex align-items-center">
                            <div class="brand-icon me-3">
                                <i class="bi bi-bag-heart-fill"></i>
                            </div>
                            <div>
                                <h5 class="mb-0 fw-bold brand-text">BaloZone</h5>
                                <small class="brand-subtitle">Admin Dashboard</small>
                            </div>
                        </div>
                    </div>
                    <div class="sidebar-brand-icon" v-show="sidebarCollapsed">
                        <div class="brand-icon-collapsed">
                            <i class="bi bi-bag-heart-fill"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sidebar-content flex-grow-1 py-2">
                <ul class="nav nav-pills flex-column">
                    <!-- Dashboard -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/dashboard" class="nav-link d-flex align-items-center" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-speedometer2"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Dashboard</span>
                        </router-link>
                    </li>

                    <!-- Products Management -->
                    <li class="nav-item mb-1">
                        <div class="nav-link nav-dropdown d-flex align-items-center" @click="toggleDropdown('products')" :class="{ 'active': isActiveDropdown('products') }">
                            <div class="nav-icon">
                                <i class="bi bi-box-seam"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Sản phẩm</span>
                            <i class="bi bi-chevron-down nav-arrow" v-show="!sidebarCollapsed" :class="{ 'rotated': dropdowns.products }"></i>
                        </div>
                        <div class="nav-submenu" :class="{ 'show': dropdowns.products }" v-show="!sidebarCollapsed">
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <router-link to="/admin/products" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Danh sách</span>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/products/create" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Thêm mới</span>
                                    </router-link>
                                </li>
                                <!-- <li class="nav-item">
                                    <router-link to="/admin/products/trashed" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Thùng rác</span>
                                    </router-link>
                                </li> -->
                            </ul>
                        </div>
                    </li>

                    <!-- Categories Management -->
                    <li class="nav-item mb-1">
                        <div class="nav-link nav-dropdown d-flex align-items-center" @click="toggleDropdown('categories')" :class="{ 'active': isActiveDropdown('categories') }">
                            <div class="nav-icon">
                                <i class="bi bi-tags"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Danh mục</span>
                            <i class="bi bi-chevron-down nav-arrow" v-show="!sidebarCollapsed" :class="{ 'rotated': dropdowns.categories }"></i>
                        </div>
                        <div class="nav-submenu" :class="{ 'show': dropdowns.categories }" v-show="!sidebarCollapsed">
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <router-link to="/admin/categories" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Danh sách</span>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/categories/create" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Thêm mới</span>
                                    </router-link>
                                </li>
                                <!-- <li class="nav-item">
                                    <router-link to="/admin/categories/trashed" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Thùng rác</span>
                                    </router-link>
                                </li> -->
                            </ul>
                        </div>
                    </li>

                    <!-- Brands Management -->
                    <li class="nav-item mb-1">
                        <div class="nav-link nav-dropdown d-flex align-items-center" @click="toggleDropdown('brands')" :class="{ 'active': isActiveDropdown('brands') }">
                            <div class="nav-icon">
                                <i class="bi bi-award"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Thương hiệu</span>
                            <i class="bi bi-chevron-down nav-arrow" v-show="!sidebarCollapsed" :class="{ 'rotated': dropdowns.brands }"></i>
                        </div>
                        <div class="nav-submenu" :class="{ 'show': dropdowns.brands }" v-show="!sidebarCollapsed">
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <router-link to="/admin/brands" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Danh sách</span>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="/admin/brands/create" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Thêm mới</span>
                                    </router-link>
                                </li>
                                <!-- <li class="nav-item">
                                    <router-link to="/admin/brands/trashed" class="nav-link nav-sublink" active-class="active">
                                        <i class="bi bi-circle nav-dot"></i>
                                        <span>Thùng rác</span>
                                    </router-link>
                                </li> -->
                            </ul>
                        </div>
                    </li>

                    <!-- Orders Management -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/orders" class="nav-link d-flex align-items-center" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-cart-check"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Đơn hàng</span>
                        </router-link>
                    </li>

                    <!-- Users Management -->
                    <li class="nav-item mb-1" v-if="authStore.isAdmin">
                        <router-link to="/admin/users" class="nav-link d-flex align-items-center" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-people"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Người dùng</span>
                        </router-link>
                    </li>

                    <!-- Sales Campaigns -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/sale-campaigns" class="nav-link d-flex align-items-center" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-percent"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Khuyến mãi</span>
                        </router-link>
                    </li>

                    <!-- News Management -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/news" class="nav-link d-flex align-items-center" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-newspaper"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Tin tức</span>
                        </router-link>
                    </li>

                    <!-- Vouchers -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/vouchers" class="nav-link d-flex align-items-center" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-ticket-perforated"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Vouchers</span>
                        </router-link>
                    </li>

                    <!-- Contact Messages -->
                    <li class="nav-item mb-1">
                        <router-link to="/admin/contacts" class="nav-link d-flex align-items-center" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-envelope-heart"></i>
                            </div>
                            <span v-show="!sidebarCollapsed" class="nav-text">Liên hệ</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- User Info -->
            <div class="sidebar-footer p-4">
                <div class="user-profile">
                    <div class="d-flex align-items-center" v-show="!sidebarCollapsed">
                        <div class="user-avatar me-3">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="user-info flex-grow-1">
                            <div class="user-name">{{ authStore.user?.name }}</div>
                            <div class="user-email">{{ authStore.user?.email }}</div>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <router-link class="dropdown-item" to="/profile">
                                        <i class="bi bi-person me-2"></i>Hồ sơ
                                    </router-link>
                                </li>
                                <li>
                                    <router-link class="dropdown-item" to="/">
                                        <i class="bi bi-house me-2"></i>Home
                                    </router-link>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                                        <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                                    </a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="text-center" v-show="sidebarCollapsed">
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle fs-4"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <router-link class="dropdown-item" to="/profile">
                                        <i class="bi bi-person me-2"></i>Hồ sơ
                                    </router-link>
                                </li>
                                <li>
                                    <router-link class="dropdown-item" to="/">
                                        <i class="bi bi-home me-2"></i>Home
                                    </router-link>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                                        <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                                    </a></li>
                            </ul>
                        </div>
                    </div>
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
            <main class="content-wrapper">
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
        // Prevent body scroll when sidebar is open on mobile
        if (showMobileSidebar.value) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    } else {
        sidebarCollapsed.value = !sidebarCollapsed.value
        localStorage.setItem('admin-sidebar-collapsed', sidebarCollapsed.value.toString())
    }
}

const closeMobileSidebar = () => {
    showMobileSidebar.value = false
    // Enable body scroll
    document.body.style.overflow = ''
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
    height: 100vh;
    overflow: hidden;
}

.sidebar {
    width: 280px;
    z-index: 1000;
    transition: all 0.3s ease;
    overflow-y: auto;
    overflow-x: hidden;
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar.collapsed {
    width: 80px;
}

.sidebar.collapsed .sidebar-content {
    overflow: visible;
}

/* Sidebar Header */
.sidebar-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
}

.brand-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.brand-icon-collapsed {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    margin: 0 auto;
}

.brand-text {
    color: #f8fafc;
    font-size: 1.25rem;
    font-weight: 700;
}

.brand-subtitle {
    color: #94a3b8;
    font-size: 0.75rem;
    font-weight: 500;
}

/* Navigation */
.sidebar .nav-link {
    color: #cbd5e1;
    border-radius: 12px;
    margin: 0 16px;
    padding: 12px 16px;
    transition: all 0.2s ease;
    font-weight: 500;
    position: relative;
    overflow: hidden;
}

.sidebar .nav-link:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
}

.sidebar .nav-link.active {
    color: #ffffff;
    background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.sidebar .nav-dropdown {
    cursor: pointer;
    color: #cbd5e1;
    border-radius: 12px;
    margin: 0 16px;
    padding: 12px 16px;
    transition: all 0.2s ease;
    font-weight: 500;
}

.sidebar .nav-dropdown:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
}

.sidebar .nav-dropdown.active {
    color: #ffffff;
    background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.nav-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-size: 1rem;
}

.nav-text {
    flex: 1;
    font-size: 0.9rem;
}

.nav-arrow {
    margin-left: auto;
    transition: transform 0.2s ease;
    font-size: 0.8rem;
}

.nav-arrow.rotated {
    transform: rotate(180deg);
}

/* Submenu */
.nav-submenu {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin: 8px 16px 0 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
}

.nav-submenu.show {
    max-height: 200px;
}

.nav-sublink {
    color: #94a3b8;
    padding: 8px 16px;
    margin: 0;
    border-radius: 8px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
}

.nav-sublink:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.1);
}

.nav-sublink.active {
    color: #ff6b35;
    background: rgba(255, 107, 53, 0.1);
}

.nav-dot {
    width: 6px;
    height: 6px;
    margin-right: 12px;
    font-size: 0.5rem;
}

/* User Profile */
.sidebar-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
}

.user-profile {
    color: #f8fafc;
}

.user-avatar {
    font-size: 2rem;
    color: #ff6b35;
}

.user-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #f8fafc;
}

.user-email {
    font-size: 0.75rem;
    color: #94a3b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
}

.main-content {
    margin-left: 280px;
    transition: all 0.3s ease;
    width: calc(100% - 280px);
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.main-content.sidebar-collapsed {
    margin-left: 80px;
    width: calc(100% - 80px);
}

.content-wrapper {
    flex: 1;
    background-color: #f8f9fa;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem;
}

.navbar {
    height: 76px;
    flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .admin-layout {
        height: 100vh;
        position: relative;
    }

    .sidebar {
        width: 280px;
        transform: translateX(-100%);
        z-index: 1050;
        overflow-y: auto;
        overflow-x: hidden;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
    }

    .sidebar.show {
        transform: translateX(0);
    }

    .main-content {
        margin-left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
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
        overflow-y: auto;
        overflow-x: hidden;
    }
}

@media (max-width: 576px) {
    .sidebar {
        width: 100vw;
    }

    .navbar .breadcrumb {
        display: none !important;
    }

    .user-email {
        max-width: 120px;
    }
}

/* Custom scrollbar for sidebar */
.sidebar::-webkit-scrollbar {
    width: 4px;
}

.sidebar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #ff6b35 0%, #e55a2b 100%);
    border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #e55a2b 0%, #d44a21 100%);
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
    pointer-events: none;
}

.sidebar-overlay.show {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}
</style>
