<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import PolicyTable from '@/components/policy/PolicyTable.vue'
import PolicyForm from '@/components/PolicyForm.vue'
import { useCustomerStore } from '@/stores/customerStore'
import { usePolicyStore } from '@/stores/policyStore'
import type { CreatePolicyRequest } from '@/types/policy'

const customerStore = useCustomerStore()
const policyStore = usePolicyStore()

const { customers } = storeToRefs(customerStore)
const { policies, loading } = storeToRefs(policyStore)

const message = ref('')
const creating = ref(false)
const successMessage = ref('')
const cancellingId = ref<number | null>(null)
const showCreateForm = ref(false)
const searchKeyword = ref('')
const selectedStatus = ref('ALL')

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
onMounted(async () => {
    message.value = ''

    try {
        await Promise.all([
            policyStore.fetchPolicies(),
            customerStore.fetchCustomers(),
        ])
    } catch (error) {
        message.value =
            error instanceof Error
                ? error.message
                : '無法取得保單管理資料'
    }
})

async function handleCreatePolicy(request: CreatePolicyRequest) {
    creating.value = true
    message.value = ''
    successMessage.value = ''

    try {
        await policyStore.createPolicy(request)

        successMessage.value = '保單新增成功'
        showCreateForm.value = false
    } catch (error) {
        message.value =
            error instanceof Error
                ? error.message
                : '新增保單失敗，請確認資料是否正確'
    } finally {
        creating.value = false
    }
}
async function handleCancelPolicy(id: number) {
    cancellingId.value = id
    message.value = ''
    successMessage.value = ''

    try {
        await policyStore.cancelPolicy(id)

        successMessage.value = '保單取消成功'
    } catch (error) {
        message.value =
            error instanceof Error
                ? error.message
                : '取消保單失敗'
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

        <PolicyTable v-else :policies="filteredPolicies" :cancelling-id="cancellingId" @cancel="handleCancelPolicy" />
    </main>
</template>