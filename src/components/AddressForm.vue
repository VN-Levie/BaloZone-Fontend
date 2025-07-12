<template>
  <div class="address-form">
    <div class="form-header">
      <h5 class="form-title">
        <i class="bi bi-geo-alt-fill me-2"></i>
        {{ isEdit ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới' }}
      </h5>
      <button type="button" class="btn-close" @click="onCancel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    
    <form @submit.prevent="onSubmit" class="address-form-content">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">
            <i class="bi bi-person me-1"></i>
            Tên người nhận *
          </label>
          <input 
            v-model="form.recipient_name" 
            class="form-control custom-input" 
            :class="{'is-invalid': errors.recipient_name || backendErrors.recipient_name}" 
            placeholder="Nhập tên người nhận"
            required 
          />
          <div v-if="errors.recipient_name" class="invalid-feedback">{{ errors.recipient_name }}</div>
          <div v-else-if="backendErrors.recipient_name" class="invalid-feedback">{{ backendErrors.recipient_name }}</div>
        </div>
        
        <div class="col-md-6">
          <label class="form-label">
            <i class="bi bi-telephone me-1"></i>
            Số điện thoại người nhận *
          </label>
          <input 
            v-model="form.recipient_phone" 
            class="form-control custom-input" 
            :class="{'is-invalid': errors.recipient_phone || backendErrors.recipient_phone}" 
            placeholder="Nhập số điện thoại người nhận"
            required 
          />
          <div v-if="errors.recipient_phone" class="invalid-feedback">{{ errors.recipient_phone }}</div>
          <div v-else-if="backendErrors.recipient_phone" class="invalid-feedback">{{ backendErrors.recipient_phone }}</div>
        </div>
        
        <div class="col-12">
          <label class="form-label">
            <i class="bi bi-house me-1"></i>
            Địa chỉ chi tiết *
          </label>
          <input 
            v-model="form.address" 
            class="form-control custom-input" 
            :class="{'is-invalid': errors.address || backendErrors.address}" 
            placeholder="Số nhà, tên đường..."
            required 
          />
          <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
          <div v-else-if="backendErrors.address" class="invalid-feedback">{{ backendErrors.address }}</div>
        </div>
        
        <div class="col-md-4">
          <label class="form-label">
            <i class="bi bi-geo me-1"></i>
            Tỉnh/Thành phố *
          </label>
          <select 
            v-model="form.province" 
            class="form-select custom-select" 
            :class="{'is-invalid': errors.province || backendErrors.province}" 
            required
          >
            <option value="" disabled>Chọn tỉnh/thành phố</option>
            <option v-for="p in provinces" :key="p.code" :value="p.name">{{ p.name }}</option>
          </select>
          <div v-if="errors.province" class="invalid-feedback">{{ errors.province }}</div>
          <div v-else-if="backendErrors.province" class="invalid-feedback">{{ backendErrors.province }}</div>
        </div>
        
        <div class="col-md-4">
          <label class="form-label">
            <i class="bi bi-geo me-1"></i>
            Quận/Huyện *
          </label>
          <select 
            v-model="form.district" 
            class="form-select custom-select" 
            :class="{'is-invalid': errors.district || backendErrors.district}" 
            required 
            :disabled="!form.province"
          >
            <option value="" disabled>Chọn quận/huyện</option>
            <option v-for="d in districts" :key="d.code" :value="d.name">{{ d.name }}</option>
          </select>
          <div v-if="errors.district" class="invalid-feedback">{{ errors.district }}</div>
          <div v-else-if="backendErrors.district" class="invalid-feedback">{{ backendErrors.district }}</div>
        </div>
        
        <div class="col-md-4">
          <label class="form-label">
            <i class="bi bi-geo me-1"></i>
            Phường/Xã *
          </label>
          <select 
            v-model="form.ward" 
            class="form-select custom-select" 
            :class="{'is-invalid': errors.ward || backendErrors.ward}" 
            required 
            :disabled="!form.district"
          >
            <option value="" disabled>Chọn phường/xã</option>
            <option v-for="w in wards" :key="w.code" :value="w.name">{{ w.name }}</option>
          </select>
          <div v-if="errors.ward" class="invalid-feedback">{{ errors.ward }}</div>
          <div v-else-if="backendErrors.ward" class="invalid-feedback">{{ backendErrors.ward }}</div>
        </div>
        
        <div class="col-md-6">
          <label class="form-label">
            <i class="bi bi-mailbox me-1"></i>
            Mã bưu điện
          </label>
          <input 
            v-model="form.postal_code" 
            class="form-control custom-input" 
            :class="{'is-invalid': errors.postal_code || backendErrors.postal_code}" 
            placeholder="Nhập mã bưu điện (tùy chọn)"
          />
          <div v-if="errors.postal_code" class="invalid-feedback">{{ errors.postal_code }}</div>
          <div v-else-if="backendErrors.postal_code" class="invalid-feedback">{{ backendErrors.postal_code }}</div>
        </div>
        
        <div class="col-12">
          <div class="form-check custom-checkbox">
            <input 
              class="form-check-input" 
              type="checkbox" 
              v-model="form.is_default" 
              id="isDefault" 
            />
            <label class="form-check-label" for="isDefault">
              <i class="bi bi-star me-1"></i>
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn btn-outline-secondary" @click="onCancel">
          <i class="bi bi-x-circle me-2"></i>
          Hủy bỏ
        </button>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-check-circle me-2"></i>
          {{ submitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Thêm mới') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { useVietnamAddress } from '@/composables/useVietnamAddress'

const props = defineProps({
  modelValue: Object,
  isEdit: Boolean,
  backendError: Object,
  submitting: Boolean
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const form = reactive({
  recipient_name: '',
  recipient_phone: '',
  address: '',
  ward: '',
  district: '',
  province: '',
  postal_code: '',
  is_default: false
})

const errors = reactive({
  recipient_name: '',
  recipient_phone: '',
  address: '',
  ward: '',
  district: '',
  province: '',
  postal_code: ''
})

type AddressField = 'recipient_name' | 'recipient_phone' | 'address' | 'ward' | 'district' | 'province' | 'postal_code'
const backendErrors: Record<AddressField, string> = reactive({
  recipient_name: '',
  recipient_phone: '',
  address: '',
  ward: '',
  district: '',
  province: '',
  postal_code: ''
})

const {
  provinces,
  districts,
  wards,
  fetchProvinces,
  fetchDistricts,
  fetchWards
} = useVietnamAddress()

onMounted(() => {
  fetchProvinces()
})

watch(() => props.modelValue, async (val) => {
  if (val) {
    Object.assign(form, val)
    // Khi edit, cần load districts và wards tương ứng
    if (val.province) {
      const province = provinces.value.find((p: any) => p.name === val.province)
      if (province) {
        await fetchDistricts(province.code)
        // Sau khi load districts, load wards nếu có district
        if (val.district) {
          const district = districts.value.find((d: any) => d.name === val.district)
          if (district) {
            await fetchWards(district.code)
          }
        }
      }
    }
  }
}, { immediate: true })

watch(() => form.province, async (provinceName) => {
  if (!provinceName) return
  const province = provinces.value.find((p: any) => p.name === provinceName)
  await fetchDistricts(province ? province.code : null)
  // Chỉ reset district và ward khi user thay đổi province, không phải khi load data từ edit
  if (!props.isEdit || !props.modelValue) {
    form.district = ''
    form.ward = ''
  }
})

watch(() => form.district, async (districtName) => {
  if (!districtName) return
  const district = districts.value.find((d: any) => d.name === districtName)
  await fetchWards(district ? district.code : null)
  // Chỉ reset ward khi user thay đổi district, không phải khi load data từ edit
  if (!props.isEdit || !props.modelValue) {
    form.ward = ''
  }
})

function setBackendErrors(errorObj: any) {
  (Object.keys(backendErrors) as AddressField[]).forEach(k => backendErrors[k] = '')
  if (errorObj && errorObj.errors) {
    for (const key in errorObj.errors) {
      if (Object.prototype.hasOwnProperty.call(backendErrors, key)) {
        backendErrors[key as AddressField] = errorObj.errors[key][0]
      }
    }
  }
}

watch(() => props.backendError, (val) => {
  setBackendErrors(val)
})

function validate() {
  let valid = true
  errors.recipient_name = ''
  errors.recipient_phone = ''
  errors.address = ''
  errors.province = ''
  errors.district = ''
  errors.ward = ''
  errors.postal_code = ''

  if (!form.recipient_name) {
    errors.recipient_name = 'Tên người nhận không được để trống'
    valid = false
  } else if (form.recipient_name.length < 2) {
    errors.recipient_name = 'Tên người nhận phải có ít nhất 2 ký tự'
    valid = false
  } else if (form.recipient_name.length > 100) {
    errors.recipient_name = 'Tên người nhận không được vượt quá 100 ký tự'
    valid = false
  }

  if (!form.recipient_phone) {
    errors.recipient_phone = 'Số điện thoại người nhận không được để trống'
    valid = false
  } else if (!/^[0-9+\-\s()]+$/.test(form.recipient_phone)) {
    errors.recipient_phone = 'Số điện thoại không đúng định dạng'
    valid = false
  } else if (form.recipient_phone.length > 15) {
    errors.recipient_phone = 'Số điện thoại không được vượt quá 15 ký tự'
    valid = false
  }

  if (!form.address) {
    errors.address = 'Địa chỉ chi tiết không được để trống'
    valid = false
  } else if (form.address.length < 10) {
    errors.address = 'Địa chỉ phải có ít nhất 10 ký tự'
    valid = false
  } else if (form.address.length > 500) {
    errors.address = 'Địa chỉ không được vượt quá 500 ký tự'
    valid = false
  }

  if (!form.province) {
    errors.province = 'Tỉnh/Thành phố không được để trống'
    valid = false
  } else if (form.province.length > 100) {
    errors.province = 'Tỉnh/Thành phố không được vượt quá 100 ký tự'
    valid = false
  }

  if (!form.district) {
    errors.district = 'Quận/Huyện không được để trống'
    valid = false
  } else if (form.district.length > 100) {
    errors.district = 'Quận/Huyện không được vượt quá 100 ký tự'
    valid = false
  }

  if (!form.ward) {
    errors.ward = 'Phường/Xã không được để trống'
    valid = false
  } else if (form.ward.length > 100) {
    errors.ward = 'Phường/Xã không được vượt quá 100 ký tự'
    valid = false
  }

  // postal_code is optional, only validate if provided
  if (form.postal_code && form.postal_code.length > 20) {
    errors.postal_code = 'Mã bưu điện không được vượt quá 20 ký tự'
    valid = false
  }

  return valid
}

function onSubmit() {
  if (!validate()) return
  emit('submit', { ...form })
}

function onCancel() {
  emit('cancel')
}
</script>

<style scoped>
.address-form {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 30px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 3px solid rgba(255, 107, 53, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
  animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.address-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #ff6b35 0%, #f7931e 25%, #ff6b35 50%, #f7931e 75%, #ff6b35 100%);
  background-size: 400% 100%;
  animation: gradientShift 4s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.form-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%);
  color: white;
  padding: 2rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.form-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
}

.form-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.form-title i {
  margin-right: 1rem;
  font-size: 1.6rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.btn-close {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  backdrop-filter: blur(10px);
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.address-form-content {
  padding: 2.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
}

.form-label {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-label i {
  color: #ff6b35;
  margin-right: 0.75rem;
  font-size: 1.1rem;
  filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3));
}

.custom-input,
.custom-select {
  border: 3px solid #e9ecef;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  font-size: 1.05rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  font-weight: 500;
}

.custom-input:focus,
.custom-select:focus {
  border-color: #ff6b35;
  box-shadow: 
    0 0 0 0.3rem rgba(255, 107, 53, 0.25),
    inset 0 2px 4px rgba(0, 0, 0, 0.06);
  background: white;
  transform: translateY(-2px);
}

.custom-input:disabled,
.custom-select:disabled {
  background: linear-gradient(135deg, #e9ecef 0%, #f1f3f4 100%);
  border-color: #dee2e6;
  color: #6c757d;
  cursor: not-allowed;
}

.custom-input.is-invalid,
.custom-select.is-invalid {
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  display: block;
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 0.25rem;
  font-weight: 500;
}

.custom-checkbox {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(247, 147, 30, 0.08) 100%);
  border: 2px solid rgba(255, 107, 53, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.custom-checkbox:hover {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.12) 0%, rgba(247, 147, 30, 0.12) 100%);
  border-color: rgba(255, 107, 53, 0.3);
  transform: translateY(-2px);
}

.custom-checkbox .form-check-input {
  border: 3px solid #ff6b35;
  border-radius: 6px;
  margin-top: 0.2rem;
  width: 1.2rem;
  height: 1.2rem;
  transition: all 0.3s ease;
}

.custom-checkbox .form-check-input:checked {
  background-color: #ff6b35;
  border-color: #ff6b35;
  transform: scale(1.1);
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
}

.custom-checkbox .form-check-label {
  font-weight: 700;
  color: #2c3e50;
  cursor: pointer;
  margin-left: 1rem;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-checkbox .form-check-label i {
  color: #ff6b35;
  margin-right: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  color: white;
  box-shadow: 
    0 6px 20px rgba(255, 107, 53, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 1rem 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #e55a2b 0%, #d6841a 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 12px 30px rgba(255, 107, 53, 0.4),
    0 4px 15px rgba(0, 0, 0, 0.15);
  color: white;
}

.btn-primary:disabled {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-outline-secondary {
  border: 3px solid #6c757d;
  color: #6c757d;
  background: white;
  border-radius: 16px;
  padding: 1rem 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-outline-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #6c757d;
  transition: left 0.4s;
  z-index: -1;
}

.btn-outline-secondary:hover::before {
  left: 0;
}

.btn-outline-secondary:hover {
  color: white;
  border-color: #6c757d;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(108, 117, 125, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-header {
    padding: 1rem 1.5rem;
  }
  
  .address-form-content {
    padding: 1.5rem;
  }
  
  .form-title {
    font-size: 1.1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .form-header {
    padding: 1rem;
  }
  
  .address-form-content {
    padding: 1rem;
  }
  
  .form-title {
    font-size: 1rem;
  }
}
</style>
