import { API_URL } from './auth'

export interface WasteCategory {
  id: number
  name: string
  type: 'organic' | 'inorganic'
  price_per_kg: string
  created_at: string
  updated_at: string
}

export interface WasteItem {
  categoryId: number
  category?: WasteCategory
  estimatedWeight: string
  photo?: string
}

export interface Transaction {
  id: number
  user_id: number
  pickup_location: string
  total_weight: string
  total_price: string
  status: string
  qr_code_path: string
  verification_token: string
  token_expires_at: string
  created_at: string
  updated_at: string
  details: TransactionDetail[]
}

export interface TransactionDetail {
  id: number
  transaction_id: number
  category_id: number
  estimated_weight: string
  actual_weight: string | null
  photo_path: string
  created_at: string
  updated_at: string
  category: WasteCategory
}

export const getWasteCategories = async (): Promise<WasteCategory[]> => {
  const response = await fetch(`${API_URL}/waste-categories`)
  const data = await response.json()
  if (data.status && data.data) {
    return data.data
  }
  throw new Error(data.message || 'Gagal mengambil data kategori sampah')
}

export const createTransaction = async (
  token: string,
  pickupLocation: string,
  items: WasteItem[]
): Promise<Transaction> => {
  const formData = new FormData()
  formData.append('pickupLocation', pickupLocation)
  
  const categoryIds = items.map(item => item.categoryId).join(',')
  const weights = items.map(item => item.estimatedWeight).join(',')
  
  formData.append('categoryId', categoryIds)
  formData.append('estimatedWeight', weights)

  items.forEach((item, index) => {
    if (item.photo) {
      const filename = item.photo.split('/').pop()
      const match = /\.(\w+)$/.exec(filename || '')
      const type = match ? `image/${match[1]}` : 'image/jpeg'
      
      formData.append('photo', {
        uri: item.photo,
        name: filename,
        type
      } as any)
    }
  })

  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
    body: formData
  })

  const data = await response.json()
  if (data.status && data.data?.transaction) {
    return data.data.transaction
  }
  throw new Error(data.message || 'Gagal membuat transaksi')
} 