import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import CustomerView from '@/views/CustomerView.vue'
import PolicyView from '@/views/PolicyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomerView,
    },
    {
      path: '/policies',
      name: 'policies',
      component: PolicyView,
    },
  ],
})

export default router
