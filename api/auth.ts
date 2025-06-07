export const API_URL = 'http://192.168.1.21:8000/api'
export const BASE_URL = 'http://192.168.1.21:8000'

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
    token: string
    user: {
      id: number
      name: string
      email: string
      phone_number: string
      role: 'user' | 'collector'
      balance: string
      avatar: string | null
      avatar_path: string | null
      created_at: string
    }
  }
}

export interface LoginResponse {
  status: boolean
  message: string
  data: {
    user: {
      id: number
      name: string
      email: string
      phone_number: string
      role: 'user' | 'collector'
      balance: string
      avatar: string | null
      avatar_path: string | null
      created_at: string
    }
    token: string
    token_type: string
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

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  return response.json()
} 