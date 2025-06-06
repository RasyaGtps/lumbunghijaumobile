import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { BASE_URL } from '../../api/auth'
import CollectorNavbar from '../../components/CollectorNavbar'
import { User } from '../../types'

interface ExtendedUser extends User {
  avatar_path?: string
  balance: string
}

export default function CollectorHome() {
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

  // Render loading placeholder dengan dimensi yang sama
  if (isLoading || !userData) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1 }} />
        <CollectorNavbar />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ 
          paddingTop: 60, 
          paddingHorizontal: 20, 
          paddingBottom: 20,
          backgroundColor: '#fff'
        }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {userData.avatar_path ? (
                <Image
                  source={{ 
                    uri: `${BASE_URL}${userData.avatar_path}`,
                    headers: { Accept: 'image/*' } 
                  }}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
              ) : (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#2563eb',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    {userData.name.charAt(0)}
                  </Text>
                </View>
              )}
              <View>
                <Text style={{ color: '#6b7280', fontSize: 14 }}>Selamat datang,</Text>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
                  {userData.name}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#f3f4f6',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </View>
          </View>
        </View>

        {/* Balance Card */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 20 }}>
          <View
            style={{
              backgroundColor: '#3b82f6',
              borderRadius: 16,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ 
              color: 'white', 
              fontSize: 16, 
              marginBottom: 8,
              opacity: 0.9 
            }}>
              Saldo Saat Ini
            </Text>
            <Text style={{ 
              color: 'white', 
              fontSize: 36, 
              fontWeight: 'bold',
              letterSpacing: -0.5
            }}>
              Rp {parseFloat(userData.balance || '0').toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* Stats Card */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: 16
            }}>
              Statistik Pengumpulan
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#2563eb' }}>
                  150
                </Text>
                <Text style={{ color: '#6b7280' }}>Total Pickup</Text>
              </View>
              <View>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#2563eb' }}>
                  1.250
                </Text>
                <Text style={{ color: '#6b7280' }}>KG Sampah</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: 16
          }}>
            Menu Cepat
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            gap: 16, 
            marginBottom: 16 
          }}>
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>📦</Text>
              <Text style={{ color: '#374151', fontWeight: '500' }}>Pickup Baru</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>📊</Text>
              <Text style={{ color: '#374151', fontWeight: '500' }}>Riwayat</Text>
            </View>
          </View>

          <View style={{ 
            flexDirection: 'row', 
            gap: 16 
          }}>
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>💰</Text>
              <Text style={{ color: '#374151', fontWeight: '500' }}>Penarikan</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>⚙️</Text>
              <Text style={{ color: '#374151', fontWeight: '500' }}>Pengaturan</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
} 