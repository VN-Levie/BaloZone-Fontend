import { ref, computed } from 'vue'

export interface NewsFormData {
  title: string
  description: string
  thumbnail?: string
}

export interface ValidationError {
  field: string
  message: string
}

export function useNewsValidation() {
  const errors = ref<Record<string, string[]>>({})

  // Validation rules
  const validateTitle = (title: string): string | null => {
    if (!title || title.trim().length === 0) {
      return 'Tiêu đề là bắt buộc'
    }
    if (title.length > 255) {
      return 'Tiêu đề không được vượt quá 255 ký tự'
    }
    return null
  }

  const validateDescription = (description: string): string | null => {
    if (!description || description.trim().length === 0) {
      return 'Mô tả là bắt buộc'
    }
    if (description.length > 5000) {
      return 'Mô tả không được vượt quá 5000 ký tự'
    }
    return null
  }

  const validateThumbnail = (thumbnail?: string): string | null => {
    if (!thumbnail) return null

    if (thumbnail.length > 255) {
      return 'URL thumbnail không được vượt quá 255 ký tự'
    }

    // Basic URL validation
    try {
      new URL(thumbnail)
      return null
    } catch {
      return 'URL thumbnail không hợp lệ'
    }
  }

  // Validate entire form
  const validateForm = (formData: NewsFormData): boolean => {
    const newErrors: Record<string, string[]> = {}

    const titleError = validateTitle(formData.title)
    if (titleError) {
      newErrors.title = [titleError]
    }

    const descriptionError = validateDescription(formData.description)
    if (descriptionError) {
      newErrors.description = [descriptionError]
    }

    const thumbnailError = validateThumbnail(formData.thumbnail)
    if (thumbnailError) {
      newErrors.thumbnail = [thumbnailError]
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  // Real-time validation
  const validateField = (field: keyof NewsFormData, value: any): boolean => {
    let error: string | null = null

    switch (field) {
      case 'title':
        error = validateTitle(value)
        break
      case 'description':
        error = validateDescription(value)
        break
      case 'thumbnail':
        error = validateThumbnail(value)
        break
    }

    if (error) {
      errors.value = { ...errors.value, [field]: [error] }
      return false
    } else {
      const newErrors = { ...errors.value }
      delete newErrors[field]
      errors.value = newErrors
      return true
    }
  }

  // Clear errors
  const clearErrors = () => {
    errors.value = {}
  }

  const clearFieldError = (field: string) => {
    const newErrors = { ...errors.value }
    delete newErrors[field]
    errors.value = newErrors
  }

  // Computed
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  const isValidForm = computed(() => !hasErrors.value)

  const getFieldError = (field: string) => {
    return errors.value[field]?.[0] || null
  }

  const getFieldState = (field: string) => {
    if (errors.value[field]) return false
    return null
  }

  return {
    errors,
    hasErrors,
    isValidForm,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
    getFieldError,
    getFieldState
  }
}
