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

export interface WasteCategory {
  id: number
  name: string
  type: 'organic' | 'inorganic'
  price_per_kg: string
  image_path: string
  created_at: string
  updated_at: string
}

export interface WasteCategoryResponse {
  status: boolean
  message: string
  data: WasteCategory[]
} 