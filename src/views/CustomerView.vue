<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import CustomerForm from '@/components/CustomerForm.vue'
import type { CreateCustomerRequest, Customer } from '@/types/customer'

const customers = ref<Customer[]>([])
const loading = ref(false)
const message = ref('')
const creating = ref(false)
const successMessage = ref('')
const resetFormCount = ref(0)
const searchKeyword = ref('')

const filteredCustomers = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()

    if (!keyword) {
        return customers.value
    }

    return customers.value.filter((customer) => {
        return (
            customer.name.toLowerCase().includes(keyword) ||
            customer.phone.toLowerCase().includes(keyword) ||
            customer.email.toLowerCase().includes(keyword)
        )
    })
})

async function fetchCustomers() {
    loading.value = true
    message.value = ''

    try {
        const response = await fetch('http://localhost:8080/api/customers')

        if (!response.ok) {
            throw new Error('取得客戶資料失敗')
        }

        customers.value = await response.json()
    } catch {
        message.value = '無法取得客戶資料，請確認後端是否已啟動'
    } finally {
        loading.value = false
    }
}
async function handleCreateCustomer(request: CreateCustomerRequest) {
    creating.value = true
    message.value = ''
    successMessage.value = ''

    try {
        const response = await fetch('http://localhost:8080/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })

        if (!response.ok) {
            throw new Error('新增客戶失敗')
        }

        successMessage.value = '客戶新增成功'
        resetFormCount.value++

        await fetchCustomers()
    } catch {
        message.value = '新增客戶失敗，請確認輸入資料是否正確'
    } finally {
        creating.value = false
    }
}

onMounted(() => {
    fetchCustomers()
})
</script>

<template>
    <main class="customer-page">

        <h1>客戶管理</h1>
        <section>
            <h2>查詢客戶</h2>

            <input v-model="searchKeyword" type="text" placeholder="輸入姓名、電話或 Email" />
        </section>
        <CustomerForm :reset-form-count="resetFormCount" @submit="handleCreateCustomer" />

        <p v-if="creating" class="info-message">客戶新增中...</p>

        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <p v-if="loading" class="info-message">資料讀取中...</p>

        <p v-else-if="message" class="error-message">{{ message }}</p>

        <p v-else-if="filteredCustomers.length === 0">查無符合條件的客戶</p>

        <table v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>姓名</th>
                    <th>電話</th>
                    <th>Email</th>
                    <th>生日</th>
                    <th>狀態</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="customer in filteredCustomers" :key="customer.id">
                    <td>{{ customer.id }}</td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.birthday }}</td>
                    <td>
                        <span :class="{
                            'status-active': customer.status === 'ACTIVE',
                            'status-cancelled': customer.status === 'INACTIVE',
                        }">
                            {{ customer.status }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
</template>