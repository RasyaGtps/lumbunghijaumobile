import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { BASE_URL } from '../../api/auth'
import CollectorNavbar from '../../components/CollectorNavbar'
import { User } from '../../types'

interface ExtendedUser extends User {
  avatar_path?: string
  phone_number: string
  created_at: string
}

export default function CollectorProfile() {
  const router = useRouter()
  const [userData, setUserData] = useState<ExtendedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUserData = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem('user')
      if (user) {
        setUserData(JSON.parse(user))
      }
    } catch (error) {
      console.error('Gagal load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      
      // Call logout API
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      console.log('📤 Logout response:', await response.json())

      // Even if the API call fails, we still want to clear local storage and redirect
      await AsyncStorage.multiRemove(['user', 'token'])
      router.replace('/login')
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Still clear storage and redirect even if API call fails
      await AsyncStorage.multiRemove(['user', 'token'])
      router.replace('/login')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading || !userData) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
        <CollectorNavbar />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={{ 
          backgroundColor: '#3b82f6',
          paddingTop: 60,
          paddingBottom: 80,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}>
          <View style={{ alignItems: 'center' }}>
            {userData.avatar_path ? (
              <Image
                source={{ 
                  uri: `${BASE_URL}${userData.avatar_path}`,
                  headers: { Accept: 'image/*' } 
                }}
                style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: 60,
                  borderWidth: 4,
                  borderColor: 'white'
                }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 4,
                  borderColor: 'rgba(255,255,255,0.3)'
                }}
              >
                <Text style={{ color: '#3b82f6', fontSize: 48, fontWeight: 'bold' }}>
                  {userData.name.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={{ 
              color: 'white', 
              fontSize: 24, 
              fontWeight: 'bold',
              marginTop: 16
            }}>
              {userData.name}
            </Text>
            <Text style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: 16,
              marginTop: 4
            }}>
              Collector
            </Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={{ 
          padding: 20,
          marginTop: -50
        }}>
          <View style={{ 
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            marginBottom: 16
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
                Informasi Pribadi
              </Text>
              <TouchableOpacity 
                onPress={() => router.push('/collector/edit-profile')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#3b82f6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8
                }}
              >
                <Ionicons name="pencil" size={16} color="white" style={{ marginRight: 4 }} />
                <Text style={{ color: 'white', fontWeight: '500' }}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20,
                  backgroundColor: '#f3f4f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name="mail-outline" size={20} color="#6b7280" />
                </View>
                <View>
                  <Text style={{ color: '#6b7280', fontSize: 12 }}>Email</Text>
                  <Text style={{ color: '#111827', fontSize: 16 }}>{userData.email}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20,
                  backgroundColor: '#f3f4f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name="call-outline" size={20} color="#6b7280" />
                </View>
                <View>
                  <Text style={{ color: '#6b7280', fontSize: 12 }}>Nomor Telepon</Text>
                  <Text style={{ color: '#111827', fontSize: 16 }}>{userData.phone_number}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20,
                  backgroundColor: '#f3f4f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                </View>
                <View>
                  <Text style={{ color: '#6b7280', fontSize: 12 }}>Bergabung Sejak</Text>
                  <Text style={{ color: '#111827', fontSize: 16 }}>{formatDate(userData.created_at)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20,
                backgroundColor: '#f3f4f6',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Ionicons name="settings-outline" size={20} color="#6b7280" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#111827', fontSize: 16, fontWeight: '500' }}>
                  Pengaturan
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20,
                backgroundColor: '#fee2e2',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: '500' }}>
                  Logout
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
} 