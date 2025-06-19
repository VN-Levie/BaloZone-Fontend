<template>
  <div class="address-form-modal">
    <div class="modal-backdrop" @click="onCancel"></div>
    <div class="modal-content">
      <h4 class="mb-3">{{ isEdit ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới' }}</h4>
      <form @submit.prevent="onSubmit">
        <div class="mb-2">
          <label class="form-label">Họ và tên *</label>
          <input v-model="form.name" class="form-control" :class="{'is-invalid': errors.name || backendErrors.name}" required />
          <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
          <div v-else-if="backendErrors.name" class="invalid-feedback">{{ backendErrors.name }}</div>
        </div>
        <div class="mb-2">
          <label class="form-label">Số điện thoại *</label>
          <input v-model="form.phone" class="form-control" :class="{'is-invalid': errors.phone || backendErrors.phone}" required />
          <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
          <div v-else-if="backendErrors.phone" class="invalid-feedback">{{ backendErrors.phone }}</div>
        </div>
        <div class="mb-2">
          <label class="form-label">Địa chỉ *</label>
          <input v-model="form.address" class="form-control" :class="{'is-invalid': errors.address || backendErrors.address}" required />
          <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
          <div v-else-if="backendErrors.address" class="invalid-feedback">{{ backendErrors.address }}</div>
        </div>
        <div class="mb-2">
          <label class="form-label">Tỉnh/Thành phố *</label>
          <select v-model="form.province" class="form-control" :class="{'is-invalid': errors.province || backendErrors.province}" required>
            <option value="" disabled>Chọn tỉnh/thành phố</option>
            <option v-for="p in provinces" :key="p.code" :value="p.name">{{ p.name }}</option>
          </select>
          <div v-if="errors.province" class="invalid-feedback">{{ errors.province }}</div>
          <div v-else-if="backendErrors.province" class="invalid-feedback">{{ backendErrors.province }}</div>
        </div>
        <div class="mb-2">
          <label class="form-label">Quận/Huyện *</label>
          <select v-model="form.district" class="form-control" :class="{'is-invalid': errors.district || backendErrors.district}" required :disabled="!form.province">
            <option value="" disabled>Chọn quận/huyện</option>
            <option v-for="d in districts" :key="d.code" :value="d.name">{{ d.name }}</option>
          </select>
          <div v-if="errors.district" class="invalid-feedback">{{ errors.district }}</div>
          <div v-else-if="backendErrors.district" class="invalid-feedback">{{ backendErrors.district }}</div>
        </div>
        <div class="mb-2">
          <label class="form-label">Phường/Xã *</label>
          <select v-model="form.ward" class="form-control" :class="{'is-invalid': errors.ward || backendErrors.ward}" required :disabled="!form.district">
            <option value="" disabled>Chọn phường/xã</option>
            <option v-for="w in wards" :key="w.code" :value="w.name">{{ w.name }}</option>
          </select>
          <div v-if="errors.ward" class="invalid-feedback">{{ errors.ward }}</div>
          <div v-else-if="backendErrors.ward" class="invalid-feedback">{{ backendErrors.ward }}</div>
        </div>
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" v-model="form.is_default" id="isDefault" />
          <label class="form-check-label" for="isDefault">Đặt làm mặc định</label>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" @click="onCancel">Hủy</button>
          <button type="submit" class="btn btn-primary">{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { useVietnamAddress } from '@/composables/useVietnamAddress'

// Định nghĩa props ở đầu file, trước khi sử dụng
const props = defineProps({
  modelValue: Object,
  isEdit: Boolean,
  backendError: Object
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const form = reactive({
  name: '',
  phone: '',
  address: '',
  ward: '',
  district: '',
  province: '',
  is_default: false
})

const errors = reactive({
  name: '',
  phone: '',
  address: '',
  ward: '',
  district: '',
  province: ''
})

type AddressField = 'name' | 'phone' | 'address' | 'ward' | 'district' | 'province'
const backendErrors: Record<AddressField, string> = reactive({
  name: '',
  phone: '',
  address: '',
  ward: '',
  district: '',
  province: ''
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
  errors.name = ''
  errors.phone = ''
  errors.address = ''
  errors.province = ''
  errors.district = ''
  errors.ward = ''

  if (!form.name) {
    errors.name = 'Họ và tên không được để trống'
    valid = false
  } else if (form.name.length < 2) {
    errors.name = 'Họ và tên phải có ít nhất 2 ký tự'
    valid = false
  } else if (form.name.length > 100) {
    errors.name = 'Họ và tên không được vượt quá 100 ký tự'
    valid = false
  }

  if (!form.phone) {
    errors.phone = 'Số điện thoại không được để trống'
    valid = false
  } else if (!/^[0-9+\-\s()]+$/.test(form.phone)) {
    errors.phone = 'Số điện thoại không đúng định dạng'
    valid = false
  } else if (form.phone.length > 15) {
    errors.phone = 'Số điện thoại không được vượt quá 15 ký tự'
    valid = false
  }

  if (!form.address) {
    errors.address = 'Địa chỉ không được để trống'
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
.address-form-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 2000; /* tăng z-index để modal nổi trên mọi thành phần khác */
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1;
}
.modal-content {
  position: relative;
  z-index: 2;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  min-width: 350px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
</style>
