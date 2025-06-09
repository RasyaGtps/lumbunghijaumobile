export interface Withdrawal {
  id: number
  user_id: number
  amount: number
  method: string
  virtual_account: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
  expires_at: string
} 