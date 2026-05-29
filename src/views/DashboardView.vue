<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Customer } from '@/types/customer'
import type { Policy } from '@/types/policy'

const customers = ref<Customer[]>([])
const policies = ref<Policy[]>([])
const loading = ref(false)
const message = ref('')

const customerCount = computed(() => customers.value.length)

const policyCount = computed(() => policies.value.length)

const activePolicyCount = computed(() => {
    return policies.value.filter((policy) => policy.status === 'ACTIVE').length
})

const cancelledPolicyCount = computed(() => {
    return policies.value.filter((policy) => policy.status === 'CANCELLED').length
})

async function fetchDashboardData() {
    loading.value = true
    message.value = ''

    try {
        const [customerResponse, policyResponse] = await Promise.all([
            fetch('http://localhost:8080/api/customers'),
            fetch('http://localhost:8080/api/policies'),
        ])

        if (!customerResponse.ok || !policyResponse.ok) {
            throw new Error('取得總覽資料失敗')
        }

        customers.value = await customerResponse.json()
        policies.value = await policyResponse.json()
    } catch {
        message.value = '無法取得系統總覽資料，請確認後端是否已啟動'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchDashboardData()
})
</script>

<template>
    <main class="dashboard-page">
        <h1>系統總覽</h1>

        <p v-if="loading" class="info-message">資料讀取中...</p>

        <p v-else-if="message" class="error-message">{{ message }}</p>

        <section v-else class="summary-grid">
            <article class="summary-card">
                <p class="summary-label">客戶總數</p>
                <p class="summary-value">{{ customerCount }}</p>
            </article>

            <article class="summary-card">
                <p class="summary-label">保單總數</p>
                <p class="summary-value">{{ policyCount }}</p>
            </article>

            <article class="summary-card">
                <p class="summary-label">有效保單</p>
                <p class="summary-value status-value-active">{{ activePolicyCount }}</p>
            </article>

            <article class="summary-card">
                <p class="summary-label">已取消保單</p>
                <p class="summary-value status-value-cancelled">{{ cancelledPolicyCount }}</p>
            </article>
        </section>
    </main>
</template>