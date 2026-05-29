<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { CreateCustomerRequest } from '@/types/customer'

const form = reactive<CreateCustomerRequest>({
    name: '',
    phone: '',
    email: '',
    identityNumber: '',
    birthday: '',
})

const props = defineProps<{
    resetFormCount: number
}>()

watch(
    () => props.resetFormCount,
    () => {
        form.name = ''
        form.phone = ''
        form.email = ''
        form.identityNumber = ''
        form.birthday = ''
    },
)

const emit = defineEmits<{
    submit: [request: CreateCustomerRequest]
}>()

function handleSubmit() {
    emit('submit', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        identityNumber: form.identityNumber,
        birthday: form.birthday,
    })
}
</script>

<template>
    <section>
        <h2>新增客戶</h2>

        <form @submit.prevent="handleSubmit">
            <div>
                <label>姓名</label>
                <input v-model="form.name" type="text" placeholder="請輸入姓名" />
            </div>

            <div>
                <label>電話</label>
                <input v-model="form.phone" type="text" placeholder="請輸入電話" />
            </div>

            <div>
                <label>Email</label>
                <input v-model="form.email" type="email" placeholder="請輸入 Email" />
            </div>

            <div>
                <label>身分證字號</label>
                <input v-model="form.identityNumber" type="text" placeholder="請輸入身分證字號" />
            </div>

            <div>
                <label>生日</label>
                <input v-model="form.birthday" type="date" />
            </div>

            <button type="submit">新增客戶</button>
        </form>
    </section>
</template>