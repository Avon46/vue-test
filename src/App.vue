<script setup lang="ts">
import { ref } from 'vue'
import DashboardView from './views/DashboardView.vue'
import CustomerView from './views/CustomerView.vue'
import PolicyView from './views/PolicyView.vue'

type Page = 'dashboard' | 'customers' | 'policies'

const currentPage = ref<Page>('dashboard')
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand">
        <p class="brand-title">Insurance Admin</p>
        <p class="brand-subtitle">保單管理系統</p>
      </div>

      <nav class="nav-menu">
        <button class="nav-button" :class="{ active: currentPage === 'dashboard' }" @click="currentPage = 'dashboard'">
          系統總覽
        </button>

        <button class="nav-button" :class="{ active: currentPage === 'customers' }" @click="currentPage = 'customers'">
          客戶管理
        </button>

        <button class="nav-button" :class="{ active: currentPage === 'policies' }" @click="currentPage = 'policies'">
          保單管理
        </button>
      </nav>
    </aside>

    <section class="main-content">
      <DashboardView v-if="currentPage === 'dashboard'" />
      <CustomerView v-else-if="currentPage === 'customers'" />
      <PolicyView v-else />
    </section>
  </div>
</template>