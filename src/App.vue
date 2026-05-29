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
        <RouterLink class="nav-button" to="/">
          系統總覽
        </RouterLink>

        <RouterLink class="nav-button" to="/customers">
          客戶管理
        </RouterLink>

        <RouterLink class="nav-button" to="/policies">
          保單管理
        </RouterLink>
      </nav>
    </aside>

    <section class="main-content">
      <RouterView />
    </section>
  </div>
</template>