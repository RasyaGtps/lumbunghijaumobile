import React from 'react'
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomNavbar from '../components/CustomNavbar'
import { useState, useEffect } from 'react'
import { API_URL, BASE_URL, User } from '../api/auth'

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

      // Call logout API
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      console.log('📤 Logout response:', data)

      // Even if the API call fails, we still want to clear local storage and redirect
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Memuat...</Text>
      </View>
    )
  }

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Mengalihkan ke halaman login...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
      >
        <View style={{
          alignItems: 'center',
          paddingVertical: 24,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}>
          {userData.avatar_path ? (
            <Image
              source={{
                uri: `${BASE_URL}${userData.avatar_path}`,
                headers: { 'Accept': 'image/*' }
              }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#0066cc',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
                {userData.name.charAt(0)}
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 12 }}>{userData.name}</Text>
          <Text style={{ color: '#666' }}>{userData.email}</Text>
          <Text style={{ color: '#666' }}>{userData.phone_number}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/edit-profile')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb'
          }}
        >
          <Text style={{ fontSize: 24, marginRight: 12 }}>✏️</Text>
          <Text style={{ flex: 1 }}>Edit Profil</Text>
          <Text style={{ color: '#666' }}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>🏦</Text>
          <Text style={{ flex: 1 }}>Metode Penarikan</Text>
          <Text style={{ color: '#666' }}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>⚙️</Text>
          <Text style={{ flex: 1 }}>Pengaturan Aplikasi</Text>
          <Text style={{ color: '#666' }}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>📞</Text>
          <Text style={{ flex: 1 }}>Layanan Pelanggan</Text>
          <Text style={{ color: '#666' }}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>⭐</Text>
          <Text style={{ flex: 1 }}>Beri Rating</Text>
          <Text style={{ color: '#666' }}>➔</Text>
        </TouchableOpacity>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 16,
          marginTop: 8
        }}>
          <TouchableOpacity>
            <Text style={{ fontSize: 32 }}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ fontSize: 32 }}>👥</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ fontSize: 32 }}>🎵</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16 }}>
          <TouchableOpacity onPress={() => { }}>
            <Text style={{ color: '#666' }}>Informasi Terkait Lumbung Hijau ➔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }} style={{ marginTop: 8 }}>
            <Text style={{ color: '#666' }}>Syarat dan Ketentuan ➔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }} style={{ marginTop: 8 }}>
            <Text style={{ color: '#666' }}>Kebijakan Privasi ➔</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={{ 
        padding: 20, 
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: 'white'
      }}>
        <TouchableOpacity
          onPress={confirmLogout}
          disabled={isLoggingOut}
          style={{
            backgroundColor: isLoggingOut ? '#f87171' : '#ef4444',
            paddingVertical: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoggingOut ? (
            <>
              <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Logging out...
              </Text>
            </>
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Logout
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <CustomNavbar />
    </View>
  )
}
