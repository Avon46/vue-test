<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import CustomerForm from '@/components/CustomerForm.vue'
import type { CreateCustomerRequest, Customer, UpdateCustomerRequest } from '@/types/customer'

const customers = ref<Customer[]>([])
const loading = ref(false)
const message = ref('')
const creating = ref(false)
const successMessage = ref('')
const resetFormCount = ref(0)
const searchKeyword = ref('')
const editingCustomerId = ref<number | null>(null)
const updating = ref(false)
const showCreateForm = ref(false)

const editForm = ref<UpdateCustomerRequest>({
    name: '',
    phone: '',
    email: '',
    birthday: '',
})
function startEditCustomer(customer: Customer) {
    showCreateForm.value = false
    editingCustomerId.value = customer.id
    message.value = ''
    successMessage.value = ''

    editForm.value = {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        birthday: customer.birthday,
    }
}

function cancelEditCustomer() {
    editingCustomerId.value = null

    editForm.value = {
        name: '',
        phone: '',
        email: '',
        birthday: '',
    }
}
async function handleUpdateCustomer() {
    if (editingCustomerId.value === null) {
        return
    }

    updating.value = true
    message.value = ''
    successMessage.value = ''

    try {
        const response = await fetch(
            `http://localhost:8080/api/customers/${editingCustomerId.value}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm.value),
            },
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.message ?? '修改客戶失敗')
        }

        successMessage.value = '客戶資料修改成功'
        cancelEditCustomer()
        await fetchCustomers()
    } catch (error) {
        message.value = error instanceof Error ? error.message : '修改客戶失敗'
    } finally {
        updating.value = false
    }
}
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
        showCreateForm.value = false

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
        <div class="page-actions">
            <button class="toggle-create-button" type="button" @click="showCreateForm = !showCreateForm">
                {{ showCreateForm ? '收起新增表單' : '＋ 新增客戶' }}
            </button>
        </div>

        <CustomerForm v-if="showCreateForm" :reset-form-count="resetFormCount" @submit="handleCreateCustomer" />
        <section v-if="editingCustomerId !== null">
            <h2>編輯客戶</h2>

            <form @submit.prevent="handleUpdateCustomer">
                <div>
                    <label>姓名</label>
                    <input v-model="editForm.name" type="text" placeholder="請輸入姓名" />
                </div>

                <div>
                    <label>電話</label>
                    <input v-model="editForm.phone" type="text" placeholder="請輸入電話" />
                </div>

                <div>
                    <label>Email</label>
                    <input v-model="editForm.email" type="email" placeholder="請輸入 Email" />
                </div>

                <div>
                    <label>生日</label>
                    <input v-model="editForm.birthday" type="date" />
                </div>

                <button type="submit" :disabled="updating">
                    {{ updating ? '儲存中...' : '儲存修改' }}
                </button>

                <button class="secondary-button" type="button" :disabled="updating" @click="cancelEditCustomer">
                    取消
                </button>
            </form>
        </section>

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
                    <th>操作</th>
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
                    <td>
                        <button class="edit-button" type="button" @click="startEditCustomer(customer)">
                            編輯
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
</template>