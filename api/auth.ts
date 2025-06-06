export const API_URL = 'http://192.168.1.18:8000/api'
export const BASE_URL = 'http://192.168.1.18:8000'

export interface LoginInput {
  login: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  phone_number: string
  password: string
  password_confirmation: string
}

export interface User {
  id: number
  name: string
  email: string
  phone_number: string
  role: string
  balance: string
}

export interface AuthResponse {
  status: boolean
  message: string
  data?: {
    user: User
    token: string
  }
}

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  return response.json()
}

export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  return response.json()
} 