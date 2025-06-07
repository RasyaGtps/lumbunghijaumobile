import { useEffect, useState } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Image,
  StatusBar
} from 'react-native'
import CollectorNavbar from '../../components/CollectorNavbar'
import { API_URL, BASE_URL } from '../../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Transaction {
  id: number
  status: string
  total_weight: string
  total_price: string
  pickup_location: string
  created_at: string
  user: {
    name: string
    avatar: string | null
  }
}

export default function CollectorHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const insets = useSafeAreaInsets()

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

      setLoading(true)
      console.log('Fetching verified transactions...')
      
      const response = await fetch(`${API_URL}/transactions/verified`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log('Transactions data:', data)

      if (data.status) {
        setTransactions(data.data || [])
        setError(null)
      } else {
        setError(data.message || 'Gagal mengambil data transaksi')
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
      setError('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
        <CollectorNavbar />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={{ 
        paddingTop: insets.top || 5,
        paddingHorizontal: 20, 
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
      }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold',
          color: '#111827'
        }}>
          Riwayat Verifikasi
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          padding: 20,
          paddingBottom: 100
        }}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={{ 
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 12,
            alignItems: 'center'
          }}>
            <Text style={{ color: '#dc2626', marginBottom: 12 }}>{error}</Text>
            <TouchableOpacity 
              onPress={fetchTransactions}
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
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 12,
            alignItems: 'center'
          }}>
            <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
            <Text style={{ 
              color: '#6b7280',
              marginTop: 12,
              textAlign: 'center'
            }}>
              Belum ada riwayat verifikasi
            </Text>
          </View>
        ) : (
          transactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              onPress={() => router.push({
                pathname: '/collector/history/[id]' as const,
                params: { id: transaction.id }
              })}
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}
            >
              {/* User Info & Date */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                {transaction.user.avatar ? (
                  <Image 
                    source={{ uri: `${BASE_URL}${transaction.user.avatar}` }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                  />
                ) : (
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#f3f4f6',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                  }}>
                    <Ionicons name="person" size={20} color="#9ca3af" />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: 2
                  }}>
                    {transaction.user.name}
                  </Text>
                  <Text style={{ color: '#6b7280', fontSize: 12 }}>
                    {formatDate(transaction.created_at)}
                  </Text>
                </View>
                <View style={{ 
                  backgroundColor: '#DCFCE7',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12
                }}>
                  <Text style={{ 
                    fontSize: 12,
                    color: '#15803D'
                  }}>
                    Selesai
                  </Text>
                </View>
              </View>

              {/* Summary */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <View>
                  <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>
                    Total Berat
                  </Text>
                  <Text style={{ color: '#111827', fontWeight: '600' }}>
                    {parseFloat(transaction.total_weight)} kg
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>
                    Total Harga
                  </Text>
                  <Text style={{ color: '#059669', fontWeight: '600' }}>
                    Rp {parseInt(transaction.total_price).toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
} 