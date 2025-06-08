import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useFocusEffect } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BASE_URL } from '../api/auth'
import CustomNavbar from '../components/CustomNavbar'
import { User } from '../types'

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
    totalWeight: 0,
    pending: 0,
    completed: 0
  })
  const [isLoading, setIsLoading] = useState(true)

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

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        setIsLoading(true)
        try {
          const token = await AsyncStorage.getItem('token')
          if (!token) {
            router.replace('/login')
            return
          }

          // Get fresh user data from API
          const userResponse = await fetch(`${BASE_URL}/api/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })

          const userData = await userResponse.json()
          if (userData.status && userData.data?.user) {
            console.log('Setting fresh user data:', userData.data.user)
            setUserData(userData.data.user)
            await AsyncStorage.setItem('user', JSON.stringify(userData.data.user))

            // Redirect ke halaman collector jika user adalah collector
            if (userData.data.user.role === 'collector') {
              router.replace('/collector')
              return
            }
          }

          // Get fresh transaction stats
          const statsResponse = await fetch(`${BASE_URL}/api/transactions/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })

          const statsData = await statsResponse.json()
          if (statsData.status) {
            const transactions = statsData.data
            const totalWeight = transactions.reduce((sum: number, t: any) => sum + parseFloat(t.total_weight || 0), 0)
            const completed = transactions.filter((t: any) => t.status === 'verified').length
            const pending = transactions.filter((t: any) => t.status === 'pending').length

            console.log('Setting fresh stats:', { totalWeight, completed, pending })
            setWasteStats({
              totalWeight,
              pending,
              completed
            })
          }
        } catch (error) {
          console.error('Error refreshing data:', error)
        } finally {
          setIsLoading(false)
        }
      }

      refreshData()
    }, [])
  )

  // Show loading indicator while refreshing
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    )
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
        {/* Header with enhanced background */}
        <View style={styles.header}>
          {/* Background decorative elements */}
          <View style={styles.headerBackground}>
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
            <View style={styles.wavePattern} />
          </View>
          
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              {userData?.avatar_path ? (
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ 
                      uri: `${BASE_URL}${userData?.avatar_path}`,
                      headers: { Accept: 'image/*' } 
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.avatarBorder} />
                </View>
              ) : (
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitial}>
                      {userData?.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.avatarBorder} />
                </View>
              )}
              <View>
                <Text style={styles.welcomeText}>Selamat datang ,</Text>
                <Text style={styles.userName}>{userData?.name} !!</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationIcon}>
                <Image 
                  source={require('../assets/images/icon/notifikasi-icon.png')} 
                  style={styles.notificationImage} 
                  resizeMode="contain"
                />
                <View style={styles.notificationGlow} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Balance Card */}
        <View style={styles.section}>
          <View style={styles.balanceCard}>
            {/* Card background pattern */}
            <View style={styles.cardPattern}>
              <View style={styles.cardCircle1} />
              <View style={styles.cardCircle2} />
              <View style={styles.cardDots} />
            </View>
            
            <View style={styles.balanceHeader}>
              <View style={styles.balanceInfo}>
                <View style={styles.walletIconContainer}>
                  <Image 
                    source={require('../assets/images/icon/dompet.png')} 
                    style={styles.dompetImage} 
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.balanceLabel}>Saldo anda</Text>
              </View>
              <TouchableOpacity 
                style={styles.withdrawButton}
                onPress={() => router.push('/withdraw')}
              >
                <Text style={styles.withdrawText}>Tarik saldo</Text>
                <View style={styles.withdrawIconContainer}>
                  <Image 
                    source={require('../assets/images/icon/tarik-saldo.png')} 
                    style={styles.dompetImage} 
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {formatCurrency(userData?.balance || '276900')}
            </Text>
            
            {/* Enhanced Stats Row */}
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

        {/* Enhanced Action Buttons */}
        <View style={styles.actionSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionScroll}>
            <TouchableOpacity style={[styles.actionButton, styles.firstActionButton]}>
              <View style={styles.actionIconContainer}>
                <Image 
                  source={require('../assets/images/icon/handphone.png')} 
                  style={styles.actionImage} 
                  resizeMode="contain"
                />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Cara Pakai Aplikasi Lumbung Hijau</Text>
                <Text style={styles.actionSubtitle}>Kelola sampah organik jadi kompos berkelanjutan</Text>
              </View>
              <View style={styles.actionPattern}>
                <View style={styles.actionDot1} />
                <View style={styles.actionDot2} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <Image 
                  source={require('../assets/images/icon/handphone.png')} 
                  style={styles.actionImage} 
                  resizeMode="contain"
                />
              </View>              
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Cara membuat eco bricks</Text>
                <Text style={styles.actionSubtitle}>Ubah sampah plastik jadi bata ramah lingkungan</Text>
              </View>
              <View style={styles.actionPattern}>
                <View style={styles.actionDot1} />
                <View style={styles.actionDot2} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <Image 
                  source={require('../assets/images/icon/handphone.png')} 
                  style={styles.actionImage} 
                  resizeMode="contain"
                />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Tips daur ulang sampah</Text>
                <Text style={styles.actionSubtitle}>Panduan lengkap mengelola sampah rumah tangga</Text>
              </View>
              <View style={styles.actionPattern}>
                <View style={styles.actionDot1} />
                <View style={styles.actionDot2} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Enhanced Articles Section */}
        <View style={styles.articlesSection}>
          <View style={styles.articleHeaderContainer}>
            <Text style={styles.sectionTitle}>Artikel</Text>
            <View style={styles.articleHeaderLine} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.articlesScroll}>
            {articles.map((article, index) => (
              <TouchableOpacity key={article.id} style={[styles.articleCard, index === 0 && styles.firstArticle]}>
                <View style={styles.articleImageContainer}>
                  <Image source={article.image} style={styles.articleImage} />
                  <View style={styles.articleOverlay} />
                </View>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <View style={styles.articleMeta}>
                    <View style={styles.categoryContainer}>
                      <Text style={styles.articleCategory}>{article.category}</Text>
                    </View>
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
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    top: -30,
    right: -20,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    top: 20,
    left: -15,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(34, 197, 94, 0.03)',
    bottom: -10,
    right: 50,
  },
  wavePattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 50%, rgba(34, 197, 94, 0.1) 100%)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
    position: 'relative',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
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
  avatarBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.3)',
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
    marginBottom: -5
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_600SemiBold',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    zIndex: -1,
  },
  notificationImage: {
    width: 35,
    height: 35,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#00A74F',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  cardCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -30,
    right: -20,
  },
  cardCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -10,
    left: -15,
  },
  cardDots: {
    position: 'absolute',
    top: 60,
    right: 30,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: { width: 10, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 1,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 1,
    position: 'relative',
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  withdrawIconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 8,
    fontFamily: 'Poppins_800ExtraBold',
    zIndex: 1,
    position: 'relative',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1,
    position: 'relative',
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
    borderRadius: 20,
    paddingVertical: 22,
    paddingLeft: 22,
    paddingRight: 18,
    paddingBottom: 18,
    alignItems: 'flex-start',
    gap: 16,
    width: 220,
    height: 155,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00AA13',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionImage: {
    width: 30,
    height: 30,
  },
  actionPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
  },
  actionDot1: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: 20,
    right: 25,
  },
  actionDot2: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 35,
    right: 15,
  },
  firstActionButton: {
    marginLeft: 0,
  },
  actionTextContainer: {
    flex: 1,
    zIndex: 1,
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
    opacity: 0.85,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 16,
  },
  articlesSection: {
    paddingLeft: 20,
    paddingTop: 25,
    paddingBottom: 25,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#A6A6A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  articleHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingRight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_600SemiBold'
  },
  articleHeaderLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    marginLeft: 12,
    borderRadius: 1,
  },
  articlesScroll: {
    paddingRight: 20,
  },
  articleCard: {
    width: 180,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  firstArticle: {
    marginLeft: 0,
  },
  articleImageContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  articleImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#f3f4f6',
  },
  articleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  articleContent: {
    padding: 14,
  },
  articleTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 10,
    lineHeight: 18,
    fontFamily: 'Poppins_600SemiBold'
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  articleCategory: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '600',
  },
  articleReadTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  bottomSpacing: {
    height: 100,
  },
})