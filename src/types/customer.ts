export type Customer = {
  id: number
  name: string
  phone: string
  email: string
  identityNumber: string
  birthday: string
  status: string
}
export type CreateCustomerRequest = {
  name: string
  phone: string
  email: string
  identityNumber: string
  birthday: string
}
export type UpdateCustomerRequest = {
  name: string
  phone: string
  email: string
  birthday: string
}
