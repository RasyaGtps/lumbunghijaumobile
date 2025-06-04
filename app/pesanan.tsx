import { useEffect, useState } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  StatusBar,
  Image,
  Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import { BASE_URL } from '../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomNavbar from '../components/CustomNavbar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

interface Transaction {
  id: number
  status: string
  total_weight: string
  total_price: string
  pickup_location: string
  image_path: string | null
  created_at: string
  details: Array<{
    id: number
    category: {
      name: string
      price_per_kg: string
      image_path: string
    }
    estimated_weight: string
  }>
}

export default function Pesanan() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      console.log('Fetching transactions with status:', activeTab)
      
      const response = await fetch(`${BASE_URL}/api/transactions?status=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response:', await response.text())
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()
      console.log('Transactions data:', data)

      if (data.status) {
        setTransactions(data.data || [])
      } else {
        setError(data.message || 'Gagal mengambil data transaksi')
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={{ 
        backgroundColor: 'white',
        paddingTop: insets.top || 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
      }}>
        <Text style={{ 
          fontSize: 16, 
          fontWeight: '600',
          textAlign: 'center',
          paddingVertical: 16
        }}>Pesanan</Text>

        <View style={{ 
          flexDirection: 'row', 
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}>
          <TouchableOpacity 
            onPress={() => {
              setActiveTab('pending')
              setLoading(true)
              fetchTransactions()
            }}
            style={{ 
              flex: 1,
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'pending' ? '#10b981' : 'transparent'
            }}
          >
            <Text style={{ 
              textAlign: 'center',
              color: activeTab === 'pending' ? '#10b981' : '#6b7280',
              fontWeight: activeTab === 'pending' ? '600' : '400'
            }}>Dalam Proses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setActiveTab('history')
              setLoading(true)
              fetchTransactions()
            }}
            style={{ 
              flex: 1,
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'history' ? '#10b981' : 'transparent'
            }}
          >
            <Text style={{ 
              textAlign: 'center',
              color: activeTab === 'history' ? '#10b981' : '#6b7280',
              fontWeight: activeTab === 'history' ? '600' : '400'
            }}>Riwayat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: 16,
          paddingBottom: 100
        }}
      >
        {error ? (
          <View style={{ 
            padding: 16, 
            backgroundColor: 'white', 
            borderRadius: 8,
            alignItems: 'center'
          }}>
            <Text style={{ color: '#dc2626', marginBottom: 8 }}>{error}</Text>
            <TouchableOpacity 
              onPress={() => {
                setLoading(true)
                fetchTransactions()
              }}
              style={{
                backgroundColor: '#10b981',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8
              }}
            >
              <Text style={{ color: 'white' }}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 ? (
          <View style={{ 
            padding: 16, 
            backgroundColor: 'white', 
            borderRadius: 8,
            alignItems: 'center'
          }}>
            <Ionicons 
              name="trash-bin-outline" 
              size={100} 
              color="#6b7280"
              style={{ marginBottom: 16 }}
            />
            <Text style={{ 
              fontSize: 16,
              color: '#6b7280',
              marginBottom: 16,
              textAlign: 'center'
            }}>
              {activeTab === 'pending' 
                ? 'Belum memiliki pesanan yang sedang diproses' 
                : 'Belum memiliki riwayat pesanan'}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/waste-categories')}
              style={{
                backgroundColor: '#10b981',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8
              }}
            >
              <Text style={{ color: 'white' }}>Mulai Daur Ulang</Text>
            </TouchableOpacity>
          </View>
        ) : (
          transactions.map((transaction) => (
            <View 
              key={transaction.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                marginBottom: 16,
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <View style={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e7eb'
              }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  {formatDate(transaction.created_at)}
                </Text>
                <View style={{ 
                  backgroundColor: '#FEF3C7',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12
                }}>
                  <Text style={{ color: '#D97706', fontSize: 12 }}>
                    {transaction.status === 'pending' ? 'Menunggu Picker' : 'Selesai'}
                  </Text>
                </View>
              </View>

              <View style={{ padding: 16 }}>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                    Lokasi Penjemputan
                  </Text>
                  <Text style={{ fontSize: 14 }}>{transaction.pickup_location}</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                    Total Sampah
                  </Text>
                  <Text style={{ fontSize: 14 }}>{transaction.total_weight} kg</Text>
                </View>

                <View style={{ 
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#e5e7eb'
                }}>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    Estimasi Pendapatan
                  </Text>
                  <Text style={{ 
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#10b981'
                  }}>
                    Rp {parseInt(transaction.total_price).toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <CustomNavbar />
    </View>
  )
} 