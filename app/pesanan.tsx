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

// Styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    backgroundColor: '#FFFFFF'
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as '600',
    textAlign: 'center' as 'center',
    paddingVertical: 16,
    color: '#111827'
  },
  tabContainer: {
    flexDirection: 'row' as 'row',
    paddingHorizontal: 16,
    marginBottom: 0,
    backgroundColor: '#FFFFFF'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2
  },
  tabButtonActive: {
    borderBottomColor: '#10B981'
  },
  tabButtonInactive: {
    borderBottomColor: 'transparent'
  },
  tabText: {
    textAlign: 'center' as 'center',
    fontSize: 14,
    fontWeight: '500' as '500'
  },
  tabTextActive: {
    color: '#10B981'
  },
  tabTextInactive: {
    color: '#9CA3AF'
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center' as 'center',
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center' as 'center'
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '500' as '500'
  },
  emptyContainer: {
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center' as 'center',
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center' as 'center',
    lineHeight: 24
  },
  startButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '500' as '500',
    fontSize: 14
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  cardHeader: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    marginBottom: 16
  },
  dateText: {
    color: '#6B7280',
    fontSize: 14
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7'
  },
  statusBadgeVerified: {
    backgroundColor: '#D1FAE5'
  },
  statusBadgeRejected: {
    backgroundColor: '#FEE2E2'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as '500'
  },
  statusTextPending: {
    color: '#D97706'
  },
  statusTextVerified: {
    color: '#059669'
  },
  statusTextRejected: {
    color: '#DC2626'
  },
  weightSection: {
    marginBottom: 16
  },
  sectionLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4
  },
  weightValue: {
    fontSize: 16,
    fontWeight: '600' as '600',
    color: '#111827'
  },
  priceSection: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    marginBottom: 16
  },
  priceValue: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600' as '600'
  },
  checkStatusButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end' as 'flex-end'
  },
  checkStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500' as '500'
  }
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 5 }]}>
        <Text style={styles.headerTitle}>
          Pesanan
        </Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            onPress={() => setActiveTab('pending')}
            style={[
              styles.tabButton,
              activeTab === 'pending' ? styles.tabButtonActive : styles.tabButtonInactive
            ]}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'pending' ? styles.tabTextActive : styles.tabTextInactive
            ]}>
              Dalam Proses
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('history')}
            style={[
              styles.tabButton,
              activeTab === 'history' ? styles.tabButtonActive : styles.tabButtonInactive
            ]}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'history' ? styles.tabTextActive : styles.tabTextInactive
            ]}>
              Riwayat
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              onPress={fetchTransactions}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="trash-bin-outline" 
              size={80} 
              color="#D1D5DB"
              style={{ marginBottom: 20 }}
            />
            <Text style={styles.emptyText}>
              {activeTab === 'pending' 
                ? 'Belum memiliki pesanan yang sedang diproses' 
                : 'Belum memiliki riwayat pesanan'}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/waste-categories')}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>Mulai Daur Ulang</Text>
            </TouchableOpacity>
          </View>
        ) : (
          transactions.map((transaction) => (
            <View 
              key={transaction.id}
              style={styles.transactionCard}
            >
              {/* Tanggal dan Status */}
              <View style={styles.cardHeader}>
                <Text style={styles.dateText}>
                  {formatDate(transaction.created_at)}
                </Text>
                <View style={[
                  styles.statusBadge,
                  transaction.status === 'pending' ? styles.statusBadgePending : 
                  transaction.status === 'verified' ? styles.statusBadgeVerified : styles.statusBadgeRejected
                ]}>
                  <Text style={[
                    styles.statusText,
                    transaction.status === 'pending' ? styles.statusTextPending : 
                    transaction.status === 'verified' ? styles.statusTextVerified : styles.statusTextRejected
                  ]}>
                    {transaction.status === 'pending' ? 'Menunggu Picker' :
                     transaction.status === 'verified' ? 'Selesai' : 'Ditolak'}
                  </Text>
                </View>
              </View>

              {/* Total Sampah */}
              <View style={styles.weightSection}>
                <Text style={styles.sectionLabel}>
                  Total sampah
                </Text>
                <Text style={styles.weightValue}>
                  {parseFloat(transaction.total_weight)} kg
                </Text>
              </View>

              {/* Estimasi Pendapatan */}
              <View style={styles.priceSection}>
                <Text style={styles.sectionLabel}>
                  Estimasi Pendapatan
                </Text>
                <Text style={styles.priceValue}>
                  Rp {parseInt(transaction.total_price).toLocaleString('id-ID')}
                </Text>
              </View>

              {/* Tombol Cek Status */}
              <TouchableOpacity
                onPress={() => router.push({
                  pathname: '/transaction/[id]',
                  params: { id: transaction.id }
                })}
                style={styles.checkStatusButton}
              >
                <Text style={styles.checkStatusText}>
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