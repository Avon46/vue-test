<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import SummaryCard from '@/components/dashboard/SummaryCard.vue'
import { useCustomerStore } from '@/stores/customerStore'
import { usePolicyStore } from '@/stores/policyStore'

const customerStore = useCustomerStore()
const policyStore = usePolicyStore()

const { customers, loading: customerLoading } = storeToRefs(customerStore)
const { policies, loading: policyLoading } = storeToRefs(policyStore)

const message = ref('')

const loading = computed(() => {
    return customerLoading.value || policyLoading.value
})

const customerCount = computed(() => {
    return customers.value.length
})

const policyCount = computed(() => {
    return policies.value.length
})

const activePolicyCount = computed(() => {
    return policies.value.filter((policy) => policy.status === 'ACTIVE').length
})

const cancelledPolicyCount = computed(() => {
    return policies.value.filter((policy) => policy.status === 'CANCELLED').length
})

onMounted(async () => {
    message.value = ''

    try {
        await Promise.all([
            customerStore.fetchCustomers(),
            policyStore.fetchPolicies(),
        ])
    } catch (error) {
        message.value =
            error instanceof Error
                ? error.message
                : '無法取得系統總覽資料，請確認後端是否已啟動'
    }
})
</script>

<template>
    <main class="dashboard-page">
        <h1>系統總覽</h1>

        <p v-if="loading" class="info-message">資料讀取中...</p>

        <p v-else-if="message" class="error-message">{{ message }}</p>

        <section v-else class="summary-grid">
            <SummaryCard label="客戶總數" :value="customerCount" />

            <SummaryCard label="保單總數" :value="policyCount" />

            <SummaryCard label="有效保單" :value="activePolicyCount" tone="active" />

            <SummaryCard label="已取消保單" :value="cancelledPolicyCount" tone="cancelled" />
        </section>
    </main>
</template>