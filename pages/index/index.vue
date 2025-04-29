<template>
  <scroll-view scroll-y class="page">
    <BannerBox />
    <FestivalSection />
    <DevotionGrid />
    <BookSection />
  </scroll-view>
</template>

<script setup lang="ts">
import BannerBox from '@/components/index/BannerBox.vue'
import FestivalSection from '@/components/index/FestivalSection.vue'
import DevotionGrid from '@/components/index/DevotionGrid.vue'
import BookSection from '@/components/index/BookSection.vue'
</script>
