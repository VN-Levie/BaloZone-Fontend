import { ref } from 'vue'

const provinces = ref<any[]>([])
const districts = ref<any[]>([])
const wards = ref<any[]>([])

async function fetchProvinces() {
  const res = await fetch('https://provinces.open-api.vn/api/p/')
  provinces.value = await res.json()
}

async function fetchDistricts(provinceCode: string | number) {
  if (!provinceCode) return districts.value = []
  const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
  const data = await res.json()
  districts.value = data.districts || []
}

async function fetchWards(districtCode: string | number) {
  if (!districtCode) return wards.value = []
  const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
  const data = await res.json()
  wards.value = data.wards || []
}

export function useVietnamAddress() {
  return {
    provinces,
    districts,
    wards,
    fetchProvinces,
    fetchDistricts,
    fetchWards
  }
}
