<script setup lang="ts">
import type { Policy } from '@/types/policy'

defineProps<{
    policies: Policy[]
    cancellingId: number | null
}>()

const emit = defineEmits<{
    cancel: [id: number]
}>()
</script>

<template>
    <table>
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
                <th>操作</th>
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
                <td>
                    <span :class="{
                        'status-active': policy.status === 'ACTIVE',
                        'status-cancelled': policy.status === 'CANCELLED',
                        'status-expired': policy.status === 'EXPIRED',
                    }">
                        {{ policy.status }}
                    </span>
                </td>
                <td>
                    <button v-if="policy.status === 'ACTIVE'" type="button" :disabled="cancellingId === policy.id"
                        @click="emit('cancel', policy.id)">
                        {{ cancellingId === policy.id ? '取消中...' : '取消保單' }}
                    </button>

                    <span v-else-if="policy.status === 'CANCELLED'">已取消</span>

                    <span v-else>{{ policy.status }}</span>
                </td>
            </tr>
        </tbody>
    </table>
</template>