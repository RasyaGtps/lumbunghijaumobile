import React from 'react'
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomNavbar from '../components/CustomNavbar'
import { useState, useEffect } from 'react'
import { API_URL, BASE_URL, User } from '../api/auth'
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

interface ExtendedUser extends User {
  avatar: string
  avatar_path: string
  created_at: string
}

export default function Profile() {
  const router = useRouter()
  const [userData, setUserData] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/login')
    }
  }, [shouldRedirect])

  useEffect(() => {
    checkAuthAndLoadProfile()
  }, [])

  const checkAuthAndLoadProfile = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        setShouldRedirect(true)
        return
      }

      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.multiRemove(['token', 'user'])
          setShouldRedirect(true)
          return
        }
        throw new Error(`Gagal mengambil data profile: ${data.message || 'Unknown error'}`)
      }

      if (data.status && data.data?.user) {
        setUserData(data.data.user)
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
      } else {
        throw new Error(`Format data tidak sesuai: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Gagal memuat data profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const token = await AsyncStorage.getItem('token')
      
      if (!token) {
        router.replace('/login')
        return
      }

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      console.log('📤 Logout response:', data)

      await AsyncStorage.clear()
      router.replace('/login')
    } catch (error) {
      console.error('❌ Logout error:', error)
      Alert.alert('Error', 'Terjadi kesalahan saat logout. Silakan coba lagi.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const confirmLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: handleLogout,
          style: 'destructive'
        }
      ]
    )
  }

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A74F" />
      </View>
    )
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Mengalihkan ke halaman login...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#00A74F', '#91D68D']}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            {userData.avatar_path ? (
              <Image
                source={{
                  uri: `${BASE_URL}${userData.avatar_path}`,
                  headers: { 'Accept': 'image/*' }
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {userData.name.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={styles.userName}>{userData.name}</Text>
            <View style={styles.userInfoContainer}>
              <View style={styles.userInfoItem}>
                <Ionicons name="mail-outline" size={16} color="#fff" />
                <Text style={styles.userInfoText}>{userData.email}</Text>
              </View>
              <View style={styles.userInfoItem}>
                <Ionicons name="call-outline" size={16} color="#fff" />
                <Text style={styles.userInfoText}>{userData.phone_number}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.menuSection}>
          <TouchableOpacity
            onPress={() => router.push('/edit-profile')}
            style={styles.menuItem}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="pencil" size={20} color="#00A74F" />
            </View>
            <Text style={styles.menuText}>Edit Profil</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="wallet" size={20} color="#2196F3" />
            </View>
            <Text style={styles.menuText}>Metode Penarikan</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/withdrawal-history')}
            style={styles.menuItem}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="wallet" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.menuText}>Riwayat Penarikan</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/version')}
            style={styles.menuItem}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="information-circle" size={20} color="#9C27B0" />
            </View>
            <Text style={styles.menuText}>Versi Aplikasi</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <TouchableOpacity style={styles.infoLink}>
            <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>Informasi Terkait Lumbung Hijau</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoLink}>
            <Ionicons name="document-text-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>Syarat dan Ketentuan</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoLink}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>Kebijakan Privasi</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={confirmLogout}
          disabled={isLoggingOut}
          style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
        >
          {isLoggingOut ? (
            <>
              <ActivityIndicator size="small" color="white" style={styles.logoutLoader} />
              <Text style={styles.logoutText}>Logging out...</Text>
            </>
          ) : (
            <>
              <Ionicons name="log-out" size={20} color="white" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarInitial: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'Poppins_600SemiBold',
  },
  userName: {
    fontSize: 24,
    marginTop: 12,
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
  userInfoContainer: {
    marginTop: 8,
    gap: 4,
  },
  userInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userInfoText: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    color: '#111827',
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 16,
  },
  infoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: '#6b7280',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#ef4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 70,
  },
  logoutButtonDisabled: {
    backgroundColor: '#f87171',
  },
  logoutLoader: {
    marginRight: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});
