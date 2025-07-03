import { ref, computed } from 'vue'
import { 
  productsApi, 
  categoriesApi, 
  brandsApi, 
  newsApi, 
  vouchersApi, 
  saleCampaignsApi, 
  adminUserApi, 
  rolesApi, 
  contactApi, 
  ordersApi 
} from '@/services/api'
import { useToast } from './useToast'
import { useAuth } from './useAuth'
import type { 
  Product, 
  Category, 
  Brand, 
  News, 
  Voucher, 
  SaleCampaign, 
  User, 
  Role, 
  Contact, 
  Order 
} from '@/types'

export function useAdminManagement() {
  const { showSuccess, showError } = useToast()
  const { isAdmin, isContributor } = useAuth()
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Check permissions
  const canManageProducts = computed(() => isAdmin.value || isContributor.value)
  const canManageCategories = computed(() => isAdmin.value || isContributor.value)
  const canManageBrands = computed(() => isAdmin.value || isContributor.value)
  const canManageNews = computed(() => isAdmin.value || isContributor.value)
  const canManageVouchers = computed(() => isAdmin.value || isContributor.value)
  const canManageSaleCampaigns = computed(() => isAdmin.value || isContributor.value)
  const canManageOrders = computed(() => isAdmin.value || isContributor.value)
  const canManageContacts = computed(() => isAdmin.value || isContributor.value)
  const canManageUsers = computed(() => isAdmin.value)
  const canManageRoles = computed(() => isAdmin.value)

  // Generic CRUD operations
  const createEntity = async <T>(
    api: any,
    data: any,
    entityName: string
  ): Promise<T | null> => {
    if (!canPerformAction(entityName)) {
      showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api(data)
      showSuccess('Thành công', `Đã tạo ${entityName} thành công`)
      return response.data
    } catch (err: any) {
      error.value = err.message || `Lỗi khi tạo ${entityName}`
      showError('Lỗi', error.value || 'Lỗi không xác định')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateEntity = async <T>(
    api: any,
    id: number,
    data: any,
    entityName: string
  ): Promise<T | null> => {
    if (!canPerformAction(entityName)) {
      showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api(id, data)
      showSuccess('Thành công', `Đã cập nhật ${entityName} thành công`)
      return response.data
    } catch (err: any) {
      error.value = err.message || `Lỗi khi cập nhật ${entityName}`
      showError('Lỗi', error.value || 'Lỗi không xác định')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteEntity = async (
    api: any,
    id: number,
    entityName: string
  ): Promise<boolean> => {
    if (!canPerformAction(entityName)) {
      showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      await api(id)
      showSuccess('Thành công', `Đã xóa ${entityName} thành công`)
      return true
    } catch (err: any) {
      error.value = err.message || `Lỗi khi xóa ${entityName}`
      showError('Lỗi', error.value || 'Lỗi không xác định')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Permission checking helper
  const canPerformAction = (entityType: string): boolean => {
    switch (entityType) {
      case 'product':
      case 'sản phẩm':
        return canManageProducts.value
      case 'category':
      case 'danh mục':
        return canManageCategories.value
      case 'brand':
      case 'thương hiệu':
        return canManageBrands.value
      case 'news':
      case 'tin tức':
        return canManageNews.value
      case 'voucher':
      case 'mã giảm giá':
        return canManageVouchers.value
      case 'sale_campaign':
      case 'chiến dịch giảm giá':
        return canManageSaleCampaigns.value
      case 'order':
      case 'đơn hàng':
        return canManageOrders.value
      case 'contact':
      case 'liên hệ':
        return canManageContacts.value
      case 'user':
      case 'người dùng':
        return canManageUsers.value
      case 'role':
      case 'vai trò':
        return canManageRoles.value
      default:
        return false
    }
  }

  // Specific entity management functions
  const productManagement = {
    create: (data: any) => createEntity(productsApi.createProduct, data, 'sản phẩm'),
    update: (id: number, data: any) => updateEntity(productsApi.updateProduct, id, data, 'sản phẩm'),
    delete: (id: number) => deleteEntity(productsApi.deleteProduct, id, 'sản phẩm'),
  }

  const categoryManagement = {
    create: (data: any) => createEntity(categoriesApi.createCategory, data, 'danh mục'),
    update: (id: number, data: any) => updateEntity(categoriesApi.updateCategory, id, data, 'danh mục'),
    delete: (id: number) => deleteEntity(categoriesApi.deleteCategory, id, 'danh mục'),
  }

  const brandManagement = {
    create: (data: any) => createEntity(brandsApi.createBrand, data, 'thương hiệu'),
    update: (id: number, data: any) => updateEntity(brandsApi.updateBrand, id, data, 'thương hiệu'),
    delete: (id: number) => deleteEntity(brandsApi.deleteBrand, id, 'thương hiệu'),
  }

  const newsManagement = {
    create: (data: any) => createEntity(newsApi.createNews, data, 'tin tức'),
    update: (id: number, data: any) => updateEntity(newsApi.updateNews, id, data, 'tin tức'),
    delete: (id: number) => deleteEntity(newsApi.deleteNews, id, 'tin tức'),
  }

  const voucherManagement = {
    create: (data: any) => createEntity(vouchersApi.createVoucher, data, 'mã giảm giá'),
    update: (id: number, data: any) => updateEntity(vouchersApi.updateVoucher, id, data, 'mã giảm giá'),
    delete: (id: number) => deleteEntity(vouchersApi.deleteVoucher, id, 'mã giảm giá'),
  }

  const saleCampaignManagement = {
    create: (data: any) => createEntity(saleCampaignsApi.createSaleCampaign, data, 'chiến dịch giảm giá'),
    update: (id: number, data: any) => updateEntity(saleCampaignsApi.updateSaleCampaign, id, data, 'chiến dịch giảm giá'),
    delete: (id: number) => deleteEntity(saleCampaignsApi.deleteSaleCampaign, id, 'chiến dịch giảm giá'),
    addProducts: async (campaignId: number, productIds: number[]) => {
      if (!canManageSaleCampaigns.value) {
        showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
        return false
      }
      try {
        await saleCampaignsApi.addProductsToSaleCampaign(campaignId, productIds)
        showSuccess('Thành công', 'Đã thêm sản phẩm vào chiến dịch')
        return true
      } catch (err: any) {
        showError('Lỗi', err.message || 'Lỗi khi thêm sản phẩm')
        return false
      }
    },
    removeProduct: async (campaignId: number, productId: number) => {
      if (!canManageSaleCampaigns.value) {
        showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
        return false
      }
      try {
        await saleCampaignsApi.removeProductFromSaleCampaign(campaignId, productId)
        showSuccess('Thành công', 'Đã xóa sản phẩm khỏi chiến dịch')
        return true
      } catch (err: any) {
        showError('Lỗi', err.message || 'Lỗi khi xóa sản phẩm')
        return false
      }
    }
  }

  const userManagement = {
    update: (id: number, data: any) => updateEntity(adminUserApi.updateUser, id, data, 'người dùng'),
    delete: (id: number) => deleteEntity(adminUserApi.deleteUser, id, 'người dùng'),
    toggleStatus: async (id: number) => {
      if (!canManageUsers.value) {
        showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
        return null
      }
      try {
        const response = await adminUserApi.toggleUserStatus(id)
        showSuccess('Thành công', 'Đã thay đổi trạng thái người dùng')
        return response.data
      } catch (err: any) {
        showError('Lỗi', err.message || 'Lỗi khi thay đổi trạng thái')
        return null
      }
    }
  }

  const roleManagement = {
    create: (data: any) => createEntity(rolesApi.createRole, data, 'vai trò'),
    update: (id: number, data: any) => updateEntity(rolesApi.updateRole, id, data, 'vai trò'),
    delete: (id: number) => deleteEntity(rolesApi.deleteRole, id, 'vai trò'),
    assignRole: async (userId: number, roleId: number) => {
      if (!canManageRoles.value) {
        showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
        return false
      }
      try {
        await rolesApi.assignRole(userId, roleId)
        showSuccess('Thành công', 'Đã gán vai trò cho người dùng')
        return true
      } catch (err: any) {
        showError('Lỗi', err.message || 'Lỗi khi gán vai trò')
        return false
      }
    },
    removeRole: async (userId: number, roleId: number) => {
      if (!canManageRoles.value) {
        showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
        return false
      }
      try {
        await rolesApi.removeRole(userId, roleId)
        showSuccess('Thành công', 'Đã xóa vai trò khỏi người dùng')
        return true
      } catch (err: any) {
        showError('Lỗi', err.message || 'Lỗi khi xóa vai trò')
        return false
      }
    }
  }

  const orderManagement = {
    updateStatus: async (id: number, status: string) => {
      if (!canManageOrders.value) {
        showError('Lỗi', 'Bạn không có quyền thực hiện hành động này')
        return null
      }
      try {
        const response = await ordersApi.updateOrderStatus(id, status)
        showSuccess('Thành công', 'Đã cập nhật trạng thái đơn hàng')
        return response.data
      } catch (err: any) {
        showError('Lỗi', err.message || 'Lỗi khi cập nhật trạng thái')
        return null
      }
    }
  }

  const contactManagement = {
    update: (id: number, data: any) => updateEntity(contactApi.updateContact, id, data, 'liên hệ'),
    delete: (id: number) => deleteEntity(contactApi.deleteContact, id, 'liên hệ'),
  }

  return {
    // State
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Permissions
    canManageProducts,
    canManageCategories,
    canManageBrands,
    canManageNews,
    canManageVouchers,
    canManageSaleCampaigns,
    canManageOrders,
    canManageContacts,
    canManageUsers,
    canManageRoles,
    canPerformAction,
    
    // Management functions
    productManagement,
    categoryManagement,
    brandManagement,
    newsManagement,
    voucherManagement,
    saleCampaignManagement,
    userManagement,
    roleManagement,
    orderManagement,
    contactManagement,
  }
}
