<script setup lang="ts">
import { reactive } from 'vue'
import type { Customer } from '@/types/customer'
import type { CreatePolicyRequest } from '@/types/policy'

defineProps<{
    customers: Customer[]
}>()

const form = reactive<CreatePolicyRequest>({
    customerId: 0,
    policyNo: '',
    productName: '',
    premium: 0,
    insuredAmount: 0,
    startDate: '',
    endDate: '',
})

const emit = defineEmits<{
    submit: [request: CreatePolicyRequest]
}>()

function handleSubmit() {
    emit('submit', {
        customerId: form.customerId,
        policyNo: form.policyNo,
        productName: form.productName,
        premium: form.premium,
        insuredAmount: form.insuredAmount,
        startDate: form.startDate,
        endDate: form.endDate,
    })
}
</script>

<template>
    <section>
        <h2>新增保單</h2>

        <form @submit.prevent="handleSubmit">
            <div>
                <label>客戶</label>
                <select v-model.number="form.customerId">
                    <option :value="0">請選擇客戶</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                        {{ customer.name }}（ID: {{ customer.id }}）
                    </option>
                </select>
            </div>

            <div>
                <label>保單編號</label>
                <input v-model="form.policyNo" type="text" placeholder="例如 POL001" />
            </div>

            <div>
                <label>商品名稱</label>
                <input v-model="form.productName" type="text" placeholder="例如 終身壽險" />
            </div>

            <div>
                <label>保費</label>
                <input v-model.number="form.premium" type="number" min="0" />
            </div>

            <div>
                <label>保額</label>
                <input v-model.number="form.insuredAmount" type="number" min="0" />
            </div>

            <div>
                <label>開始日期</label>
                <input v-model="form.startDate" type="date" />
            </div>

            <div>
                <label>結束日期</label>
                <input v-model="form.endDate" type="date" />
            </div>

            <button type="submit">新增保單</button>
        </form>
    </section>
</template>