export interface User {
  id: number
  name: string
  email: string
  phone_number: string
  role: string
  balance: string
  address: string
}

export interface ApiResponse<T> {
  status: boolean
  message: string
  data?: T
} 