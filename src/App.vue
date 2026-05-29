<script setup lang="ts">
import { ref } from 'vue'
import CustomerView from './views/CustomerView.vue'
import PolicyView from './views/PolicyView.vue'

type Page = 'customers' | 'policies'

const currentPage = ref<Page>('customers')
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand">
        <p class="brand-title">Insurance Admin</p>
        <p class="brand-subtitle">保單管理系統</p>
      </div>

      <nav class="nav-menu">
        <button class="nav-button" :class="{ active: currentPage === 'customers' }" @click="currentPage = 'customers'">
          客戶管理
        </button>

        <button class="nav-button" :class="{ active: currentPage === 'policies' }" @click="currentPage = 'policies'">
          保單管理
        </button>
      </nav>
    </aside>

    <section class="main-content">
      <CustomerView v-if="currentPage === 'customers'" />
      <PolicyView v-else />
    </section>
  </div>
</template>