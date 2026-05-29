<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PolicyForm from '@/components/PolicyForm.vue'
import type { Customer } from '@/types/customer'
import type { CreatePolicyRequest, Policy } from '@/types/policy'
const policies = ref<Policy[]>([])
const loading = ref(false)
const message = ref('')
const customers = ref<Customer[]>([])
const creating = ref(false)
const successMessage = ref('')
const cancellingId = ref<number | null>(null)
const searchKeyword = ref('')
const selectedStatus = ref('ALL')
const showCreateForm = ref(false)

const filteredPolicies = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()

    return policies.value.filter((policy) => {
        const matchKeyword =
            !keyword ||
            policy.policyNo.toLowerCase().includes(keyword) ||
            policy.customerName.toLowerCase().includes(keyword) ||
            policy.productName.toLowerCase().includes(keyword)

        const matchStatus =
            selectedStatus.value === 'ALL' ||
            policy.status === selectedStatus.value

        return matchKeyword && matchStatus
    })
})
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
async function fetchCustomers() {
    try {
        const response = await fetch('http://localhost:8080/api/customers')

        if (!response.ok) {
            throw new Error('取得客戶資料失敗')
        }

        customers.value = await response.json()
    } catch {
        message.value = '無法取得客戶資料'
    }
}
onMounted(() => {
    fetchPolicies()
    fetchCustomers()
})

async function handleCreatePolicy(request: CreatePolicyRequest) {
    creating.value = true
    message.value = ''
    successMessage.value = ''

    try {
        const response = await fetch('http://localhost:8080/api/policies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })

        if (!response.ok) {
            throw new Error('新增保單失敗')
        }
        successMessage.value = '保單新增成功'
        showCreateForm.value = false
        await fetchPolicies()
    } catch {
        message.value = '新增保單失敗，請確認資料是否正確'
    } finally {
        creating.value = false
    }
}
async function handleCancelPolicy(id: number) {
    cancellingId.value = id
    message.value = ''
    successMessage.value = ''

    try {
        const response = await fetch(`http://localhost:8080/api/policies/${id}/cancel`, {
            method: 'PATCH',
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.message ?? '取消保單失敗')
        }

        successMessage.value = '保單取消成功'
        await fetchPolicies()
    } catch (error) {
        message.value = error instanceof Error ? error.message : '取消保單失敗'
    } finally {
        cancellingId.value = null
    }
}
</script>

<template>
    <main class="policy-page">
        <h1>保單管理</h1>

        <section>
            <h2>查詢保單</h2>

            <input v-model="searchKeyword" type="text" placeholder="輸入保單編號、客戶姓名或商品名稱" />

            <select v-model="selectedStatus">
                <option value="ALL">全部狀態</option>
                <option value="ACTIVE">有效中</option>
                <option value="CANCELLED">已取消</option>
                <option value="EXPIRED">已到期</option>
            </select>
        </section>

        <div class="page-actions">
            <button class="toggle-create-button" type="button" @click="showCreateForm = !showCreateForm">
                {{ showCreateForm ? '收起新增表單' : '＋ 新增保單' }}
            </button>
        </div>

        <PolicyForm v-if="showCreateForm" :customers="customers" @submit="handleCreatePolicy" />

        <p v-if="creating" class="info-message">保單新增中...</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <p v-if="loading" class="info-message">資料讀取中...</p>

        <p v-else-if="message" class="error-message">{{ message }}</p>

        <p v-else-if="filteredPolicies.length === 0">查無符合條件的保單</p>

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
                    <th>操作</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="policy in filteredPolicies" :key="policy.id">
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
                            @click="handleCancelPolicy(policy.id)">
                            {{ cancellingId === policy.id ? '取消中...' : '取消保單' }}
                        </button>

                        <span v-else-if="policy.status === 'CANCELLED'">已取消</span>

                        <span v-else>{{ policy.status }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
</template>