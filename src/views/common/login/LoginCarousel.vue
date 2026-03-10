<template>
  <div class="login-carousel-wrap">
    <div
      v-for="(slide, index) in carouselSlides"
      :key="index"
      class="login-carousel-slide"
      :class="{ active: currentIndex === index }"
      role="button"
      tabindex="0"
      :aria-label="$t('ui.login.contact')"
      @click="openHiTRUST"
      @keydown.enter="openHiTRUST"
    >
      <img v-if="slide.img" :src="slide.img" alt="" class="login-carousel-slide-img" />
    </div>
    <div class="login-carousel-dots">
      <button
        v-for="(_, index) in carouselSlides"
        :key="index"
        type="button"
        class="login-carousel-dot"
        :class="{ active: currentIndex === index }"
        :aria-label="'Slide ' + (index + 1)"
        @click="currentIndex = index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import carouselImg1 from '@/assets/img/login/carousel-1.png'
import carouselImg2 from '@/assets/img/login/carousel-2.png'

defineOptions({
  name: 'LoginCarousel'
})

const carouselSlides = [{ img: carouselImg1 }, { img: carouselImg2 }]

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % carouselSlides.length
  }, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const HiTRUST_URL = 'https://www.hitrust.com'
function openHiTRUST() {
  window.open(HiTRUST_URL, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped lang="scss">
.login-carousel-wrap {
  position: absolute;
  inset: 0;
}

.login-carousel-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;

  &.active {
    opacity: 1;
    pointer-events: auto;
    cursor: pointer;
  }
}

.login-carousel-slide-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.login-carousel-dots {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 3;
}

.login-carousel-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  padding: 0;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;

  &.active {
    background: #fff;
    border-color: #fff;
  }
}

@media (max-width: 767px) {
  .login-carousel-dots {
    bottom: 15px;
  }
}
</style>
