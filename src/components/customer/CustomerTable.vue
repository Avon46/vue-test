<script setup lang="ts">
import type { Customer } from '@/types/customer'

defineProps<{
    customers: Customer[]
}>()

const emit = defineEmits<{
    edit: [customer: Customer]
}>()
</script>

<template>
    <table>
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
            <tr v-for="customer in customers" :key="customer.id">
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
                    <button class="edit-button" type="button" @click="emit('edit', customer)">
                        編輯
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>