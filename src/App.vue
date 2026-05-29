<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <section class="main-content">
      <RouterView />
    </section>
  </div>
</template>