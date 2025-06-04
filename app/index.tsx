import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { BASE_URL } from '../api/auth'
import CustomNavbar from '../components/CustomNavbar'
import { User } from '../types'

interface ExtendedUser extends User {
  avatar_path?: string
  points?: string
}

export default function Home() {
  const [userData, setUserData] = useState<ExtendedUser | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user')
      if (user) {
        setUserData(JSON.parse(user))
      }
    } catch (error) {
      console.error('Gagal load user data:', error)
    }
  }

  if (!userData) return null

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

        {/* Points Card */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <View
            style={{
              backgroundColor: '#3b82f6',
              borderRadius: 16,
              padding: 24,
              shadowColor: '#000',
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
              Memiliki Poin Sebesar
            </Text>
            <Text style={{ 
              color: 'white', 
              fontSize: 36, 
              fontWeight: 'bold',
              letterSpacing: -0.5
            }}>
              {parseFloat(userData.points || '92750').toLocaleString('id-ID')} Poin
            </Text>
          </View>
        </View>

        {/* Weight Info */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ 
              fontSize: 48, 
              fontWeight: '300', 
              color: '#9ca3af',
              textAlign: 'center',
              letterSpacing: -1
            }}>
              1.000.000 <Text style={{ fontSize: 32 }}>KG</Text>
            </Text>
          </View>
        </View>

        {/* Grid Layout */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
          {/* First Row - 2 items */}
          <View style={{ 
            flexDirection: 'row', 
            gap: 16, 
            marginBottom: 16 
          }}>
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#e5e7eb',
                borderRadius: 12,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#e5e7eb',
                borderRadius: 12,
              }}
            />
          </View>

          {/* Second Row - 2 items, left one wider */}
          <View style={{ 
            flexDirection: 'row', 
            gap: 16, 
            marginBottom: 16 
          }}>
            <View
              style={{
                flex: 2,
                height: 120,
                backgroundColor: '#e5e7eb',
                borderRadius: 12,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#e5e7eb',
                borderRadius: 12,
              }}
            />
          </View>

          {/* Third Row - 3 equal items */}
          <View style={{ 
            flexDirection: 'row', 
            gap: 16 
          }}>
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#e5e7eb',
                borderRadius: 12,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#e5e7eb',
                borderRadius: 12,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 120,
                backgroundColor: '#e5e7eb',
                borderRadius: 12,
              }}
            />
          </View>
        </View>
      </ScrollView>

      <CustomNavbar />
    </View>
  )
}