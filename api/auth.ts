export const API_URL = 'http://192.168.43.100:8000/api'
export const BASE_URL = 'http://192.168.43.100:8000'

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

export interface OTPVerifyInput {
  otp: string
}

export interface User {
  id: number
  name: string
  email: string
  phone_number: string
  role: string
  balance: string
  email_verified: boolean
}

export interface AuthResponse {
  status: boolean
  message: string
  data?: {
    access_token: string
    token_type: string
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
      email_verified: boolean
      created_at: string
    }
    token: string
    token_type: string
  }
}

export interface OTPResponse {
  message: string
  expires_at: string
  remaining_resend?: number
  next_resend_available?: string
}

export interface OTPVerifyResponse {
  message: string
  user: {
    id: number
    name: string
    email: string
    phone_number: string
    role: 'user' | 'collector'
    balance: string
    avatar: string | null
    email_verified: boolean
    created_at: string
    updated_at: string
  }
}

export const loginUser = async (input: LoginInput): Promise<LoginResponse> => {
  console.log('Calling loginUser API with input:', input);
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();
    console.log('Login API response:', data);
    return data;
  } catch (error) {
    console.error('Error in loginUser API call:', error);
    throw error;
  }
}

export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
  console.log('Calling registerUser API with input:', input);
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();
    console.log('Register API response:', data);
    return data;
  } catch (error) {
    console.error('Error in registerUser API call:', error);
    throw error;
  }
}

export const sendOTP = async (token: string): Promise<OTPResponse> => {
  const response = await fetch(`${API_URL}/otp/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  return response.json()
}

export const verifyOTP = async (token: string, otp: string): Promise<OTPVerifyResponse> => {
  console.log('Calling verifyOTP API with otp:', otp);
  try {
    const response = await fetch(`${API_URL}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ otp })
    });

    const data = await response.json();
    console.log('Verify OTP API response:', data);
    return data;
  } catch (error) {
    console.error('Error in verifyOTP API call:', error);
    throw error;
  }
}

export const resendOTP = async (token: string): Promise<OTPResponse> => {
  const response = await fetch(`${API_URL}/otp/resend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
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