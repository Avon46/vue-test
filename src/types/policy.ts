export type Policy = {
  id: number
  policyNo: string
  customerId: number
  customerName: string
  productName: string
  premium: number
  insuredAmount: number
  startDate: string
  endDate: string
  status: string
}
export type CreatePolicyRequest = {
  customerId: number
  policyNo: string
  productName: string
  premium: number
  insuredAmount: number
  startDate: string
  endDate: string
}
