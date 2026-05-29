import type { CreateCustomerRequest, Customer, UpdateCustomerRequest } from '@/types/customer'

const API_BASE_URL = 'http://localhost:8080/api/customers'

async function getErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  const errorData = await response.json().catch(() => null)

  return errorData?.message ?? fallbackMessage
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(API_BASE_URL)

  if (!response.ok) {
    throw new Error('取得客戶資料失敗')
  }

  return await response.json()
}

export async function createCustomer(request: CreateCustomerRequest): Promise<Customer> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const message = await getErrorMessage(response, '新增客戶失敗')
    throw new Error(message)
  }

  return await response.json()
}

export async function updateCustomer(
  id: number,
  request: UpdateCustomerRequest,
): Promise<Customer> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const message = await getErrorMessage(response, '修改客戶失敗')
    throw new Error(message)
  }

  return await response.json()
}
