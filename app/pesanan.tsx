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
  }, [activeTab])

  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      setLoading(true)
      console.log('Fetching transactions...')
      
      const response = await fetch(`${BASE_URL}/api/transactions/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log('Transactions data:', data)

      if (data.status) {
        const filteredTransactions = data.data.filter((transaction: Transaction) => 
          activeTab === 'pending' ? 
            transaction.status === 'pending' : 
            ['verified', 'rejected'].includes(transaction.status)
        )
        setTransactions(filteredTransactions || [])
        setError(null)
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
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#00A74F" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={{ 
        backgroundColor: '#fff',
        paddingTop: insets.top || 5,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
      }}>
        <Text style={{ 
          fontSize: 16, 
          textAlign: 'center',
          paddingVertical: 16
        }}>
          Pesanan
        </Text>

        {/* Tabs */}
        <View style={{ 
          flexDirection: 'row',
          paddingHorizontal: 16,
          marginBottom: 8
        }}>
          <TouchableOpacity 
            onPress={() => setActiveTab('pending')}
            style={{ 
              flex: 1,
              paddingVertical: 8,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'pending' ? '#00A74F' : 'transparent'
            }}
          >
            <Text style={{ 
              textAlign: 'center',
              color: activeTab === 'pending' ? '#00A74F' : '#9CA3AF',
            }}>
              Dalam Proses
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('history')}
            style={{ 
              flex: 1,
              paddingVertical: 8,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'history' ? '#00A74F' : 'transparent'
            }}
          >
            <Text style={{ 
              textAlign: 'center',
              color: activeTab === 'history' ? '#00A74F' : '#9CA3AF',
            }}>
              Riwayat
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1, backgroundColor: '#F3F4F6' }}
        contentContainerStyle={{ 
          padding: 24,
          paddingBottom: 100
        }}
        showsVerticalScrollIndicator={false}
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
              onPress={fetchTransactions}
              style={{
                backgroundColor: '#00A74F',
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
              color="#9CA3AF"
              style={{ marginBottom: 16 }}
            />
            <Text style={{ 
              fontSize: 16,
              color: '#9CA3AF',
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
                backgroundColor: '#00A74F',
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
                borderRadius: 12,
                marginBottom: 12,
                padding: 16
              }}
            >
              {/* Tanggal dan Status */}
              <View style={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <Text style={{ color: '#6B7280' }}>
                  {formatDate(transaction.created_at)}
                </Text>
                <View style={{ 
                  backgroundColor: transaction.status === 'pending' ? '#FEF3C7' : 
                                  transaction.status === 'verified' ? '#DCFCE7' : '#FEE2E2',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12
                }}>
                  <Text style={{ 
                    fontSize: 12,
                    color: transaction.status === 'pending' ? '#D97706' : 
                            transaction.status === 'verified' ? '#15803D' : '#DC2626'
                  }}>
                    {transaction.status === 'pending' ? 'Menunggu Picker' :
                     transaction.status === 'verified' ? 'Selesai' : 'Ditolak'}
                  </Text>
                </View>
              </View>

              {/* Total Sampah */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#6B7280', marginBottom: 4 }}>
                  Total sampah
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {parseFloat(transaction.total_weight)} kg
                </Text>
              </View>

              {/* Estimasi Pendapatan */}
              <View style={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#6B7280' }}>
                  Estimasi Pendapatan
                </Text>
                <Text style={{ color: '#00A74F', fontSize: 16 }}>
                  Rp {parseInt(transaction.total_price).toLocaleString('id-ID')}
                </Text>
              </View>

              {/* Tombol Cek Status */}
              <TouchableOpacity
                onPress={() => router.push({
                  pathname: '/transaction/[id]',
                  params: { id: transaction.id }
                })}
                style={{
                  backgroundColor: '#00A74F',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  alignSelf: 'flex-end',
                  marginTop: 12
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>
                  Cek Status
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <CustomNavbar />
    </View>
  )
} 