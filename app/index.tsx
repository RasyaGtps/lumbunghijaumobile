import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BASE_URL } from '../api/auth'
import CustomNavbar from '../components/CustomNavbar'
import { User } from '../types'
import { useRouter } from 'expo-router'

import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins'

interface ExtendedUser extends Omit<User, 'role'> {
  avatar_path?: string
  points?: string
  role: string
}

interface WasteStats {
  totalWeight: number
  pending: number
  completed: number
}

interface Article {
  id: string
  title: string
  image: any
  category: string
  readTime: string
}

export default function Home() {
  const [userData, setUserData] = useState<ExtendedUser | null>(null)
  const [wasteStats, setWasteStats] = useState<WasteStats>({
    totalWeight: 30,
    pending: 0,
    completed: 0
  })

  const [articles] = useState<Article[]>([
    {
      id: '1',
      title: 'ECO Bricks solusi atasi sampah masa kini',
      image: require('../assets/images/icon/image 2.png'),
      category: 'Tips',
      readTime: '5 menit'
    },
    {
      id: '2',
      title: 'ECO Bricks solusi atasi sampah masa kini',
      image: require('../assets/images/icon/image 2.png'),
      category: 'Tips',
      readTime: '5 menit'
    },
    {
      id: '3',
      title: 'ECO Bricks solusi atasi sampah masa kini',
      image: require('../assets/images/icon/image 2.png'),
      category: 'Tips',
      readTime: '5 menit'
    },
  ])

  // Load font menggunakan useFonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_700Bold_Italic
  })

  const router = useRouter()

  useEffect(() => {
    loadUserData()
    fetchTransactionStats()
  }, [])

  const loadUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user')
      if (user) {
        const parsedUser = JSON.parse(user)
        setUserData(parsedUser)
        
        // Redirect ke halaman collector jika user adalah collector
        if (parsedUser.role === 'collector') {
          router.replace('/collector')
          return
        }
      }
    } catch (error) {
      console.error('Gagal load user data:', error)
    }
  }

  const fetchTransactionStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${BASE_URL}/api/transactions/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      if (data.status) {
        const transactions = data.data
        const totalWeight = transactions.reduce((sum: number, t: any) => sum + parseFloat(t.total_weight), 0)
        const completed = transactions.filter((t: any) => t.status === 'verified').length
        const pending = transactions.filter((t: any) => t.status === 'pending').length

        setWasteStats({
          totalWeight,
          pending,
          completed
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp')
  }

  // Tampilkan loading kalau font belum siap
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0A529F" />
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              {userData?.avatar_path ? (
                <Image
                  source={{ 
                    uri: `${BASE_URL}${userData?.avatar_path}`,
                    headers: { Accept: 'image/*' } 
                  }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>
                    {userData?.name.charAt(0)}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.welcomeText}>Selamat datang ,</Text>
                <Text style={styles.userName}>Hi {userData?.name} !!</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationIcon}>
                <Image 
                  source={require('../assets/images/icon/notifikasi-icon.png')} 
                  style={styles.notificationImage} 
                  resizeMode="contain"
                />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.section}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceInfo}>
                <Image 
                  source={require('../assets/images/icon/dompet.png')} 
                  style={styles.dompetImage} 
                  resizeMode="contain"
                />
                <Text style={styles.balanceLabel}>Saldo anda</Text>
              </View>
              <TouchableOpacity 
                style={styles.withdrawButton}
                onPress={() => router.push('/withdraw')}
              >
                <Text style={styles.withdrawText}>Tarik saldo</Text>
                <Image 
                  source={require('../assets/images/icon/tarik-saldo.png')} 
                  style={styles.dompetImage} 
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {formatCurrency(userData?.balance || '276900')}
            </Text>
            
            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{wasteStats.totalWeight} kg</Text>
                <Text style={styles.statLabel}>Total per kg</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{wasteStats.pending}</Text>
                <Text style={styles.statLabel}>Dalam Proses</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{wasteStats.completed}</Text>
                <Text style={styles.statLabel}>Selesai</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionScroll}>
            <TouchableOpacity style={[styles.actionButton, styles.firstActionButton]}>
              <Image 
                source={require('../assets/images/icon/handphone.png')} 
                style={styles.actionImage} 
                resizeMode="contain"
              />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Cara Pakai Aplikasi Lumbung Hijau</Text>
                <Text style={styles.actionSubtitle}>Kelola sampah organik jadi kompos berkelanjutan</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Image 
                source={require('../assets/images/icon/handphone.png')} 
                style={styles.actionImage} 
                resizeMode="contain"
              />              
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Cara membuat eco bricks</Text>
                <Text style={styles.actionSubtitle}>Ubah sampah plastik jadi bata ramah lingkungan</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Image 
                source={require('../assets/images/icon/handphone.png')} 
                style={styles.actionImage} 
                resizeMode="contain"
              />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Tips daur ulang sampah</Text>
                <Text style={styles.actionSubtitle}>Panduan lengkap mengelola sampah rumah tangga</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Articles Section */}
        <View style={styles.articlesSection}>
          <Text style={styles.sectionTitle}>Artikel</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.articlesScroll}>
            {articles.map((article, index) => (
              <TouchableOpacity key={article.id} style={[styles.articleCard, index === 0 && styles.firstArticle]}>
                <Image source={article.image} style={styles.articleImage} />
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <View style={styles.articleMeta}>
                    <Text style={styles.articleCategory}>{article.category}</Text>
                    <Text style={styles.articleReadTime}>{article.readTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <CustomNavbar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
  welcomeText: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    // backgroundColor: 'yellow',
    marginBottom: -5
    },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_600SemiBold',
    // backgroundColor: 'black'
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  notificationImage: {
  width: 35,
  height: 35,
  },
  notificationText: {
    fontSize: 18,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#00A74F',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dompetImage: {
    width: 20,
    height: 20,
  },
  balanceLabel: {
    color: 'white',
    fontSize: 15,
    opacity: 0.9,
    fontFamily: 'Poppins_400Regular'
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  withdrawIcon: {
    fontSize: 12,
  },
  withdrawText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Poppins_600SemiBold'
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    marginBottom: 5,
    fontFamily: 'Poppins_800ExtraBold'
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  actionSection: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  actionScroll: {
    paddingRight: 20,
  },
  actionButton: {
    flexDirection: 'column',
    backgroundColor: '#00AA13',
    borderRadius: 16,
    paddingVertical: 20,
    paddingLeft:20,
    paddingRight: 15,
    paddingBottom: 15,
    alignItems: 'flex-start',
    gap: 16,
    width: 220,
    height: 155,
    marginRight: 16,
  },
  actionImage: {
    width: 30,
    height: 30,
  },
  firstActionButton: {
    marginLeft: 0,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: -6,
    fontFamily: 'Poppins_600SemiBold'
  },
  actionSubtitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    fontFamily: 'Poppins_400Regular',
    // backgroundColor: 'black'
  },
  articlesSection: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#A6A6A6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
    fontFamily: 'Poppins_600SemiBold'
  },
  articlesScroll: {
    paddingRight: 20,
  },
  articleCard: {
    width: 180,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 0.6,
  },
  firstArticle: {
    marginLeft: 0,
  },
  articleImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  articleContent: {
    padding: 12,
  },
  articleTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 18,
    fontFamily: 'Poppins_600SemiBold'
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleCategory: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '500',
  },
  articleReadTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  bottomSpacing: {
    height: 100,
  },
})