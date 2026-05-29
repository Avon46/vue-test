import type { CreatePolicyRequest, Policy } from '@/types/policy'

const API_BASE_URL = 'http://localhost:8080/api/policies'

async function getErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  const errorData = await response.json().catch(() => null)

  return errorData?.message ?? fallbackMessage
}

export async function getPolicies(): Promise<Policy[]> {
  const response = await fetch(API_BASE_URL)

  if (!response.ok) {
    throw new Error('取得保單資料失敗')
  }

  return await response.json()
}

export async function createPolicy(request: CreatePolicyRequest): Promise<Policy> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const message = await getErrorMessage(response, '新增保單失敗，請確認資料是否正確')

    throw new Error(message)
  }

  return await response.json()
}

export async function cancelPolicy(id: number): Promise<Policy> {
  const response = await fetch(`${API_BASE_URL}/${id}/cancel`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    const message = await getErrorMessage(response, '取消保單失敗')
    throw new Error(message)
  }

  return await response.json()
}
