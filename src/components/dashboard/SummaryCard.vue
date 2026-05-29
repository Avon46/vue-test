<script setup lang="ts">
type CardTone = 'default' | 'active' | 'cancelled'

withDefaults(
    defineProps<{
        label: string
        value: number
        tone?: CardTone
    }>(),
    {
        tone: 'default',
    },
)
</script>

<template>
    <article class="summary-card">
        <p class="summary-label">{{ label }}</p>

        <p class="summary-value" :class="{
            'status-value-active': tone === 'active',
            'status-value-cancelled': tone === 'cancelled',
        }">
            {{ value }}
        </p>
    </article>
</template>