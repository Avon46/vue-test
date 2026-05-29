<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Policy } from '@/types/policy'

const policies = ref<Policy[]>([])
const loading = ref(false)
const message = ref('')

async function fetchPolicies() {
    loading.value = true
    message.value = ''

    try {
        const response = await fetch('http://localhost:8080/api/policies')

        if (!response.ok) {
            throw new Error('取得保單資料失敗')
        }

        policies.value = await response.json()
    } catch {
        message.value = '無法取得保單資料，請確認後端是否已啟動'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchPolicies()
})
</script>

<template>
    <main class="policy-page">
        <h1>保單管理</h1>

        <p v-if="loading">資料讀取中...</p>

        <p v-else-if="message">{{ message }}</p>

        <p v-else-if="policies.length === 0">目前沒有保單資料</p>

        <table v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>保單編號</th>
                    <th>客戶姓名</th>
                    <th>商品名稱</th>
                    <th>保費</th>
                    <th>保額</th>
                    <th>開始日期</th>
                    <th>結束日期</th>
                    <th>狀態</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="policy in policies" :key="policy.id">
                    <td>{{ policy.id }}</td>
                    <td>{{ policy.policyNo }}</td>
                    <td>{{ policy.customerName }}</td>
                    <td>{{ policy.productName }}</td>
                    <td>{{ policy.premium }}</td>
                    <td>{{ policy.insuredAmount }}</td>
                    <td>{{ policy.startDate }}</td>
                    <td>{{ policy.endDate }}</td>
                    <td>{{ policy.status }}</td>
                </tr>
            </tbody>
        </table>
    </main>
</template>