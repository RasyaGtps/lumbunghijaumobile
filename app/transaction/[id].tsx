import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, Alert, StyleSheet, Image } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { API_URL, BASE_URL } from '../../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TransactionDetails from '../../components/TransactionDetails'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins'

interface WasteCategory {
  id: number
  name: string
  type: string
  price_per_kg: string
  image_path: string
}

interface TransactionDetail {
  id: number
  transaction_id: number
  category_id: number
  estimated_weight: string
  actual_weight: string | null
  created_at: string
  updated_at: string
  category: WasteCategory
}

interface User {
  id: number
  name: string
  email: string
  phone_number: string
  avatar: string | null
  role: string
  balance: string
  created_at: string
  updated_at: string
}

interface Transaction {
  id: number
  user_id: number
  pickup_location: string
  total_weight: string
  total_price: string
  status: string
  image_path: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  details: TransactionDetail[]
  user: User
}

export default function TransactionDetailsPage() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  })

  useEffect(() => {
    fetchTransactionDetails()
  }, [id])

  const fetchTransactionDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      console.log('Using token:', token)
      console.log('Fetching transaction:', `${API_URL}/transactions/${id}`)
      
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.status) {
        setTransaction(data.data)
      } else {
        console.error('API Error:', data.message)
        Alert.alert('Error', data.message || 'Gagal mengambil detail transaksi')
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
      }
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil detail transaksi')
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

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A74F" />
      </View>
    )
  }

  if (!transaction) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#F59E0B'
      case 'verified':
        return '#15803D'
      case 'completed':
        return '#1D4ED8'
      case 'rejected':
        return '#DC2626'
      default:
        return '#6B7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Menunggu Verifikasi'
      case 'verified':
        return 'Terverifikasi'
      case 'completed':
        return 'Selesai'
      case 'rejected':
        return 'Ditolak'
      default:
        return status
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <View style={styles.headerContent}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#111827"
            onPress={() => router.back()} 
          />
          <Text style={styles.headerTitle}>Detail Transaksi</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) }]}>
              <Text style={styles.statusText}>{getStatusText(transaction.status)}</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(transaction.created_at)}</Text>
          </View>

          {transaction.rejection_reason && (
            <View style={styles.rejectionContainer}>
              <Text style={styles.rejectionLabel}>Alasan Penolakan:</Text>
              <Text style={styles.rejectionText}>{transaction.rejection_reason}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#00A74F" />
            <View>
              <Text style={styles.infoLabel}>Lokasi Penjemputan</Text>
              <Text style={styles.infoValue}>{transaction.pickup_location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="scale-outline" size={20} color="#00A74F" />
            <View>
              <Text style={styles.infoLabel}>Total Berat</Text>
              <Text style={styles.infoValue}>{parseFloat(transaction.total_weight)} kg</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#00A74F" />
            <View>
              <Text style={styles.infoLabel}>Total Pendapatan</Text>
              <Text style={styles.infoValue}>
                Rp {parseInt(transaction.total_price).toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>

        {/* Detail Sampah */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Sampah</Text>
          {transaction.image_path && (
            <View style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              height: 200,
              overflow: 'hidden',
              backgroundColor: '#f9fafb',
              marginBottom: 16
            }}>
              <Image
                source={{ uri: `${BASE_URL}${transaction.image_path}` }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 8
                }}
                resizeMode="contain"
              />
            </View>
          )}
          {transaction.details.map((item, index) => (
            <View key={item.id} style={styles.wasteItem}>
              <View style={styles.wasteHeader}>
                <View style={styles.wasteInfo}>
                  {item.category.image_path ? (
                    <Image 
                      source={{ uri: `${BASE_URL}${item.category.image_path}` }}
                      style={styles.categoryIcon}
                    />
                  ) : (
                    <View style={styles.categoryIcon}>
                      <Ionicons name="leaf-outline" size={20} color="#00A74F" />
                    </View>
                  )}
                  <View>
                    <Text style={styles.wasteName}>{item.category.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.wastePrice}>
                        Rp {parseInt(item.category.price_per_kg).toLocaleString('id-ID')}/kg
                      </Text>
                      <View style={{
                        backgroundColor: item.category.type === 'organic' ? '#DCFCE7' : '#F3E8FF',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 12
                      }}>
                        <Text style={{
                          fontSize: 10,
                          color: item.category.type === 'organic' ? '#15803D' : '#7E22CE'
                        }}>
                          {item.category.type === 'organic' ? 'Organik' : 'Anorganik'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.wasteWeight, { marginBottom: 4 }]}>
                      Berat Awal: {parseFloat(item.estimated_weight)} kg
                    </Text>
                    {item.actual_weight && (
                      <Text style={[styles.wasteWeight, { color: '#059669' }]}>
                        Berat Akhir: {parseFloat(item.actual_weight)} kg
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              {index !== transaction.details.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  dateText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  rejectionContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  rejectionLabel: {
    color: '#DC2626',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  rejectionText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  infoValue: {
    color: '#111827',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  wasteItem: {
    marginBottom: 16,
  },
  wasteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wasteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wasteName: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
  },
  wastePrice: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#00A74F',
  },
  wasteWeight: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
}); 