<template>
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
                <button 
                  type="button" 
                  class="btn-close" 
                  @click="successMessage = ''"
                ></button>
              </div>
              
              <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
                {{ errorMessage }}
                <button 
                  type="button" 
                  class="btn-close" 
                  @click="errorMessage = ''"
                ></button>
              </div>
              
              <form @submit.prevent="submitForm" class="contact-form">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">
                      First Name <span class="text-danger">*</span>
                    </label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.firstName }"
                      required
                    >
                    <div v-if="errors.firstName" class="invalid-feedback">
                      {{ errors.firstName }}
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">
                      Last Name <span class="text-danger">*</span>
                    </label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.lastName }"
                      required
                    >
                    <div v-if="errors.lastName" class="invalid-feedback">
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">
                      Email Address <span class="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      required
                    >
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email }}
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      class="form-control"
                      :class="{ 'is-invalid': errors.phone }"
                    >
                    <div v-if="errors.phone" class="invalid-feedback">
                      {{ errors.phone }}
                    </div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="subject" class="form-label">
                    Subject <span class="text-danger">*</span>
                  </label>
                  <select
                    id="subject"
                    v-model="form.subject"
                    class="form-select"
                    :class="{ 'is-invalid': errors.subject }"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="order">Order Support</option>
                    <option value="return">Return/Exchange</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                  </select>
                  <div v-if="errors.subject" class="invalid-feedback">
                    {{ errors.subject }}
                  </div>
                </div>
                
                <div class="mb-4">
                  <label for="message" class="form-label">
                    Message <span class="text-danger">*</span>
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    class="form-control"
                    :class="{ 'is-invalid': errors.message }"
                    rows="6"
                    placeholder="Please describe your inquiry in detail..."
                    required
                  ></textarea>
                  <div v-if="errors.message" class="invalid-feedback">
                    {{ errors.message }}
                  </div>
                  <div class="form-text">
                    {{ form.message.length }}/1000 characters
                  </div>
                </div>
                
                <div class="mb-3 form-check">
                  <input
                    id="newsletter"
                    v-model="form.newsletter"
                    type="checkbox"
                    class="form-check-input"
                  >
                  <label for="newsletter" class="form-check-label">
                    Subscribe to our newsletter for updates and promotions
                  </label>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    * Required fields
                  </small>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="submitting"
                  >
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ submitting ? 'Sending...' : 'Send Message' }}
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
            <div 
              v-for="(faq, index) in faqs" 
              :key="index"
              class="accordion-item"
            >
              <h2 class="accordion-header">
                <button 
                  class="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  :data-bs-target="`#faq${index}`"
                >
                  {{ faq.question }}
                </button>
              </h2>
              <div 
                :id="`faq${index}`" 
                class="accordion-collapse collapse" 
                data-bs-parent="#faqAccordion"
              >
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { contactApi } from '../services/api'
import { isValidEmail, isValidPhone } from '../utils'
import Breadcrumb from '../components/Breadcrumb.vue'

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' }
]

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  newsletter: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
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
  
  // First name validation
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }
  
  // Last name validation
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }
  
  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Phone validation (optional but must be valid if provided)
  if (form.phone.trim() && !isValidPhone(form.phone)) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }
  
  // Subject validation
  if (!form.subject) {
    errors.subject = 'Please select a subject'
    isValid = false
  }
  
  // Message validation
  if (!form.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  } else if (form.message.length > 1000) {
    errors.message = 'Message must be less than 1000 characters'
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
    
    await contactApi.submitContact({
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject,
      message: form.message,
      newsletter_subscription: form.newsletter
    })
    
    successMessage.value = 'Thank you for your message! We will get back to you within 24 hours.'
    
    // Reset form
    Object.keys(form).forEach(key => {
      if (key === 'newsletter') {
        (form as any)[key] = false
      } else {
        (form as any)[key] = ''
      }
    })
    
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to send message. Please try again.'
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
