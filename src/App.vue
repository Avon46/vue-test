<script setup lang="ts">
import { ref } from 'vue'
import CustomerView from './views/CustomerView.vue'
import PolicyView from './views/PolicyView.vue'

type Page = 'customers' | 'policies'

const currentPage = ref<Page>('customers')
</script>

<template>
  <div>
    <nav>
      <button @click="currentPage = 'customers'">客戶管理</button>
      <button @click="currentPage = 'policies'">保單管理</button>
    </nav>

    <CustomerView v-if="currentPage === 'customers'" />
    <PolicyView v-else />
  </div>
</template>