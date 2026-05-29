import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  cancelPolicy as cancelPolicyApi,
  createPolicy as createPolicyApi,
  getPolicies,
} from '@/services/policyApi'
import type { CreatePolicyRequest, Policy } from '@/types/policy'

export const usePolicyStore = defineStore('policy', () => {
  const policies = ref<Policy[]>([])
  const loading = ref(false)

  async function fetchPolicies() {
    loading.value = true

    try {
      policies.value = await getPolicies()
    } finally {
      loading.value = false
    }
  }

  async function createPolicy(request: CreatePolicyRequest) {
    await createPolicyApi(request)
    await fetchPolicies()
  }

  async function cancelPolicy(id: number) {
    await cancelPolicyApi(id)
    await fetchPolicies()
  }

  return {
    policies,
    loading,
    fetchPolicies,
    createPolicy,
    cancelPolicy,
  }
})
