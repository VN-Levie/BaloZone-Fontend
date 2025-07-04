import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Nếu người dùng dùng nút back/forward thì khôi phục vị trí cũ
    if (savedPosition) {
      return savedPosition
    }
    // Nếu có hash thì cuộn đến element đó
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Mặc định cuộn lên đầu trang
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/category/:category',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../views/WishlistView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: () => import('../views/NewsDetailView.vue'),
    },
    {
      path: '/sale-campaigns',
      name: 'sale-campaigns',
      component: () => import('../views/SaleCampaignsView.vue'),
    },
    {
      path: '/sale-campaigns/:id',
      name: 'sale-campaign-detail',
      component: () => import('../views/SaleCampaignDetailView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/roles-demo',
      name: 'roles-demo',
      component: () => import('../views/RolesDemoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/AdminProductsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/products/create',
      name: 'admin-create-product',
      component: () => import('../views/AdminCreateProductView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/products/:id/edit',
      name: 'admin-edit-product',
      component: () => import('../views/AdminEditProductView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/api-tester',
      name: 'api-tester',
      component: () => import('../views/ApiTesterView.vue'),
    },
    // Static pages
    {
      path: '/warranty-policy',
      name: 'warranty-policy',
      component: () => import('../views/WarrantyPolicyView.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
    },
    {
      path: '/suitcase-lock-guide',
      name: 'suitcase-lock-guide',
      component: () => import('../views/SuitcaseLockGuideView.vue'),
    },
    {
      path: '/payment-methods',
      name: 'payment-methods',
      component: () => import('../views/PaymentMethodsView.vue'),
    },
    {
      path: '/about-balozone',
      name: 'about-balozone',
      component: () => import('../views/AboutBaloZoneView.vue'),
    },
    {
      path: '/voucher-guide',
      name: 'voucher-guide',
      component: () => import('../views/VoucherGuideView.vue'),
    },
    {
      path: '/luggage-tips',
      name: 'luggage-tips',
      component: () => import('../views/LuggageTipsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  // Import here to avoid circular dependency
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
