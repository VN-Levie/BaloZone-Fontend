<template>
  <UserLayout>
    <div class="contact-view">
      <div class="container mt-4">
        <Breadcrumb :items="breadcrumbItems" />

        <div class="row">
          <div class="col-12">
            <h1 class="mb-4">Contact Us</h1>
          </div>
        </div>

        <div class="row">
          <!-- Contact Information -->
          <div class="col-lg-4 mb-4">
            <div class="contact-info">
              <div class="card h-100">
                <div class="card-body">
                  <h4 class="card-title mb-4">Get in Touch</h4>

                  <div class="contact-item mb-4">
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-map-marker-alt text-primary me-3"></i>
                      <h6 class="mb-0">Address</h6>
                    </div>
                    <p class="ms-4 mb-0">
                      123 Business Street<br>
                      Ho Chi Minh City, Vietnam<br>
                      70000
                    </p>
                  </div>

                  <div class="contact-item mb-4">
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-phone text-primary me-3"></i>
                      <h6 class="mb-0">Phone</h6>
                    </div>
                    <p class="ms-4 mb-0">
                      <a href="tel:+84123456789" class="text-decoration-none">
                        +84 123 456 789
                      </a>
                    </p>
                  </div>

                  <div class="contact-item mb-4">
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-envelope text-primary me-3"></i>
                      <h6 class="mb-0">Email</h6>
                    </div>
                    <p class="ms-4 mb-0">
                      <a href="mailto:info@balozone.com" class="text-decoration-none">
                        info@balozone.com
                      </a>
                    </p>
                  </div>

                  <div class="contact-item mb-4">
                    <div class="d-flex align-items-center mb-2">
                      <i class="fas fa-clock text-primary me-3"></i>
                      <h6 class="mb-0">Business Hours</h6>
                    </div>
                    <div class="ms-4">
                      <p class="mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p class="mb-1">Saturday: 9:00 AM - 5:00 PM</p>
                      <p class="mb-0">Sunday: Closed</p>
                    </div>
                  </div>

                  <!-- Social Media -->
                  <div class="social-links">
                    <h6 class="mb-3">Follow Us</h6>
                    <div class="d-flex gap-2">
                      <a href="#" class="btn btn-outline-primary btn-sm">
                        <i class="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" class="btn btn-outline-info btn-sm">
                        <i class="fab fa-twitter"></i>
                      </a>
                      <a href="#" class="btn btn-outline-danger btn-sm">
                        <i class="fab fa-instagram"></i>
                      </a>
                      <a href="#" class="btn btn-outline-primary btn-sm">
                        <i class="fab fa-linkedin-in"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="col-lg-8">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title mb-4">Send us a Message</h4>

                <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
                  {{ successMessage }}
                  <button type="button" class="btn-close" @click="successMessage = ''"></button>
                </div>

                <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
                  {{ errorMessage }}
                  <button type="button" class="btn-close" @click="errorMessage = ''"></button>
                </div>

                <form @submit.prevent="submitForm" class="contact-form">
                  <div class="mb-3">
                    <label for="fullname" class="form-label">
                      Họ và tên <span class="text-danger">*</span>
                    </label>
                    <input
                      id="fullname"
                      v-model="form.fullname"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.fullname }"
                      required
                      placeholder="Nhập họ và tên của bạn"
                    >
                    <div v-if="errors.fullname" class="invalid-feedback">
                      {{ errors.fullname }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">
                      Email <span class="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      required
                      placeholder="Nhập địa chỉ email của bạn"
                    >
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email }}
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="message" class="form-label">
                      Tin nhắn <span class="text-danger">*</span>
                    </label>
                    <textarea
                      id="message"
                      v-model="form.message"
                      class="form-control"
                      :class="{ 'is-invalid': errors.message }"
                      rows="6"
                      placeholder="Vui lòng mô tả chi tiết câu hỏi hoặc yêu cầu của bạn..."
                      required
                    ></textarea>
                    <div v-if="errors.message" class="invalid-feedback">
                      {{ errors.message }}
                    </div>
                    <div class="form-text">
                      {{ form.message.length }}/1000 ký tự
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                      * Trường bắt buộc
                    </small>
                    <button type="submit" class="btn btn-primary" :disabled="submitting">
                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                      {{ submitting ? 'Đang gửi...' : 'Gửi tin nhắn' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="row mt-5">
          <div class="col-12">
            <h3 class="mb-4">Frequently Asked Questions</h3>

            <div class="accordion" id="faqAccordion">
              <div v-for="(faq, index) in faqs" :key="index" class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#faq${index}`">
                    {{ faq.question }}
                  </button>
                </h2>
                <div :id="`faq${index}`" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { contactApi } from '../services/api'
import { isValidEmail } from '../utils'
import Breadcrumb from '../components/Breadcrumb.vue'
import UserLayout from '@/components/layouts/UserLayout.vue'

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' }
]

const form = reactive({
  fullname: '',
  email: '',
  message: ''
})

const errors = reactive({
  fullname: '',
  email: '',
  message: ''
})

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const faqs = [
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unused items in their original packaging. Returns must be initiated within 30 days of purchase."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days. Express shipping is available and takes 1-2 business days."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within Vietnam. We are working on expanding our shipping to international locations."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking number via email. You can also track your order in your account dashboard."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash on delivery, bank transfers, and major credit cards including Visa and Mastercard."
  }
]

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Full name validation
  if (!form.fullname.trim()) {
    errors.fullname = 'Họ và tên là bắt buộc'
    isValid = false
  } else if (form.fullname.trim().length < 2) {
    errors.fullname = 'Họ và tên phải có ít nhất 2 ký tự'
    isValid = false
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email là bắt buộc'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Vui lòng nhập địa chỉ email hợp lệ'
    isValid = false
  }

  // Message validation
  if (!form.message.trim()) {
    errors.message = 'Tin nhắn là bắt buộc'
    isValid = false
  } else if (form.message.trim().length < 10) {
    errors.message = 'Tin nhắn phải có ít nhất 10 ký tự'
    isValid = false
  } else if (form.message.length > 1000) {
    errors.message = 'Tin nhắn không được vượt quá 1000 ký tự'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  try {
    submitting.value = true
    errorMessage.value = ''

    const contactData = {
      fullname: form.fullname.trim(),
      email: form.email.trim(),
      message: form.message.trim()
    }

    await contactApi.submitContact(contactData)

    successMessage.value = 'Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'

    // Reset form
    form.fullname = ''
    form.email = ''
    form.message = ''

  } catch (err: any) {
    console.error('Error submitting contact form:', err)

    if (err.response?.data?.errors) {
      // Handle validation errors from server
      const serverErrors = err.response.data.errors
      Object.keys(serverErrors).forEach(key => {
        if (key in errors) {
          errors[key as keyof typeof errors] = Array.isArray(serverErrors[key])
            ? serverErrors[key][0]
            : serverErrors[key]
        }
      })
    } else {
      errorMessage.value = err.response?.data?.message || 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.contact-info .card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.contact-item {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.contact-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.contact-item i {
  width: 20px;
  text-align: center;
}

.contact-form .card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.accordion-button:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.social-links .btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .contact-info {
    margin-bottom: 2rem;
  }

  .social-links .btn {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
}
</style>
