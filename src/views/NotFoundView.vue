<template>
  <div class="not-found-page">
    <!-- Animated background -->
    <div class="stars">
      <div class="star" v-for="n in 50" :key="n" :style="getStarStyle(n)"></div>
    </div>
    
    <div class="container text-center py-5">
      <div class="error-content">
        <!-- Floating traveler -->
        <div class="traveler-container">
          <div class="traveler">🧭</div>
        </div>
        
        <!-- Glitch effect 404 -->
        <h1 class="error-code glitch" data-text="404">404</h1>
        
        <!-- Mountain decoration -->
        <div class="mountain">🏔️</div>
        
        <h2 class="error-title fade-in">Oops! Bạn đã lạc đường trong hành trình</h2>
        <p class="error-message fade-in">
          Trang bạn đang tìm kiếm như một con đường mòn đã bị che khuất. Đừng lo, hãy cùng BaloZone tìm lại hướng đi! 😉
        </p>
        
        <!-- Animated buttons -->
        <div class="error-actions fade-in">
          <router-link to="/" class="btn btn-primary adventure-btn">
            <i class="bi bi-house"></i>
            <span>Về Base Camp</span>
            <div class="btn-glow"></div>
          </router-link>
          <button class="btn btn-outline-primary adventure-btn" @click="goBack">
            <i class="bi bi-arrow-left-circle"></i>
            <span>Quay lại tuyến cũ</span>
            <div class="btn-glow"></div>
          </button>
          <router-link to="/search" class="btn btn-success adventure-btn">
            <i class="bi bi-search"></i>
            <span>Tìm balo mơ ước</span>
            <div class="btn-glow"></div>
          </router-link>
        </div>
        
        <!-- Floating elements -->
        <div class="floating-elements">
          <div class="floating-item" style="--delay: 0s; --duration: 3s;">🎒</div>
          <div class="floating-item" style="--delay: 1s; --duration: 4s;">🗺️</div>
          <div class="floating-item" style="--delay: 2s; --duration: 3.5s;">⛰️</div>
          <div class="floating-item" style="--delay: 0.5s; --duration: 2.8s;">🧭</div>
          <div class="floating-item" style="--delay: 1.5s; --duration: 3.2s;">🥾</div>
          <div class="floating-item" style="--delay: 2.5s; --duration: 4.2s;">🏕️</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// Generate random star positions and animations
const getStarStyle = (index: number) => {
  const random = (min: number, max: number) => Math.random() * (max - min) + min
  
  return {
    left: `${random(0, 100)}%`,
    top: `${random(0, 100)}%`,
    animationDelay: `${random(0, 3)}s`,
    animationDuration: `${random(2, 5)}s`
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #FFB347 50%, #FFA500 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animated background stars */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Error content container */
.error-content {
  position: relative;
  z-index: 10;
}

/* Floating traveler */
.traveler-container {
  position: absolute;
  top: -100px;
  right: 10%;
  z-index: 5;
}

.traveler {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(5deg); }
  75% { transform: translateY(-10px) rotate(-5deg); }
}

/* Glitch effect for 404 */
.error-code {
  font-size: 8rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 107, 53, 0.6);
  position: relative;
}

.glitch {
  animation: glitch 2s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  animation: glitch-1 0.5s infinite;
  color: #FF6B35;
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 0.5s infinite;
  color: #F7931E;
  z-index: -2;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  10% { transform: translate(-2px, -2px); }
  20% { transform: translate(2px, 2px); }
  30% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  05% { transform: translate(2px, 2px); }
  15% { transform: translate(-2px, -2px); }
  25% { transform: translate(2px, -2px); }
  35% { transform: translate(-2px, 2px); }
}

/* Mountain decoration */
.mountain {
  position: absolute;
  top: 20px;
  left: 10%;
  font-size: 3rem;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Fade in animations */
.fade-in {
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: #fff;
  text-shadow: 0 2px 10px rgba(255, 107, 53, 0.4);
  animation-delay: 0.2s;
}

.error-message {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 5px rgba(255, 107, 53, 0.3);
  animation-delay: 0.4s;
}

/* Adventure buttons */
.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation-delay: 0.6s;
}

.adventure-btn {
  position: relative;
  padding: 1rem 1.8rem;
  font-weight: 600;
  border-radius: 25px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
  margin: 0.5rem;
}

.adventure-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.btn-primary.adventure-btn {
  background: linear-gradient(45deg, #FF6B35, #F7931E);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.btn-outline-primary.adventure-btn {
  background: transparent;
  border: 2px solid #FF6B35;
  color: #FF6B35;
}

.btn-outline-primary.adventure-btn:hover {
  background: linear-gradient(45deg, #FF6B35, #F7931E);
  border-color: #FF6B35;
  color: white;
}

.btn-success.adventure-btn {
  background: linear-gradient(45deg, #FF6B35, #F7931E);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transition: left 0.5s;
}

.adventure-btn:hover .btn-glow {
  left: 100%;
}

/* Floating elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-item {
  position: absolute;
  font-size: 2rem;
  animation: floatAround var(--duration, 3s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}

.floating-item:nth-child(1) { top: 15%; left: 20%; }
.floating-item:nth-child(2) { top: 70%; right: 25%; }
.floating-item:nth-child(3) { bottom: 40%; left: 15%; }
.floating-item:nth-child(4) { top: 35%; right: 35%; }
.floating-item:nth-child(5) { top: 50%; left: 5%; }
.floating-item:nth-child(6) { bottom: 20%; right: 10%; }

@keyframes floatAround {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.7;
  }
  25% { 
    transform: translateY(-30px) translateX(20px) rotate(90deg);
    opacity: 1;
  }
  50% { 
    transform: translateY(-20px) translateX(-15px) rotate(180deg);
    opacity: 0.8;
  }
  75% { 
    transform: translateY(-35px) translateX(10px) rotate(270deg);
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .adventure-btn {
    width: 220px;
    padding: 0.8rem 1.2rem;
    margin: 0.3rem;
  }
  
  .traveler {
    font-size: 2.5rem;
  }
  
  .mountain {
    font-size: 2rem;
  }
  
  .floating-item {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .error-code {
    font-size: 4rem;
  }
  
  .traveler-container {
    top: -60px;
    right: 5%;
  }
  
  .mountain {
    top: 10px;
    left: 5%;
    font-size: 1.5rem;
  }
}
</style>
