import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { BASE_URL } from '../../api/auth'
import CollectorNavbar from '../../components/CollectorNavbar'
import { User } from '../../types'
import { useRouter } from 'expo-router'

interface ExtendedUser extends User {
  avatar_path?: string
  balance: string
  total_requests?: number
}

export default function CollectorHome() {
  const [userData, setUserData] = useState<ExtendedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loadUserData = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem('user')
      if (user) {
        const parsedUser = JSON.parse(user)
        
        // Redirect ke halaman user jika bukan collector
        if (parsedUser.role !== 'collector') {
          router.replace('/')
          return
        }
        
        setUserData(parsedUser)
      }
    } catch (error) {
      console.error('Gagal load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

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
        {/* Header with improved spacing and typography */}
        <View style={{ 
          paddingTop: 50, 
          paddingHorizontal: 24, 
          paddingBottom: 24,
          backgroundColor: '#fff'
        }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              {userData.avatar_path ? (
                <Image
                  source={{ 
                    uri: `${BASE_URL}${userData.avatar_path}`,
                    headers: { Accept: 'image/*' } 
                  }}
                  style={{ 
                    width: 50, 
                    height: 50, 
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#e5e7eb'
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#2563eb',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#e5e7eb'
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                    {userData.name.charAt(0)}
                  </Text>
                </View>
              )}
              <View>
                <Text style={{ 
                  color: '#6b7280', 
                  fontSize: 14,
                  marginBottom: 2
                }}>
                  Selamat datang,
                </Text>
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: '700', 
                  color: '#111827',
                  letterSpacing: -0.3
                }}>
                  {userData.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Total Request Card - replacing balance */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}>
          <View
            style={{
              backgroundColor: '#3b82f6',
              borderRadius: 20,
              padding: 28,
              shadowColor: "#3b82f6",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: 16, 
              marginBottom: 12,
              fontWeight: '500'
            }}>
              Total Request Hari Ini
            </Text>
            <Text style={{ 
              color: 'white', 
              fontSize: 42, 
              fontWeight: '800',
              letterSpacing: -1,
              marginBottom: 4
            }}>
              {userData.total_requests || 0}
            </Text>
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: 14,
              fontWeight: '500'
            }}>
              Permintaan pickup
            </Text>
          </View>
        </View>

        {/* Enhanced Stats Card */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 28,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '700', 
              color: '#374151',
              marginBottom: 20,
              letterSpacing: -0.3
            }}>
              Statistik Pengumpulan
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ 
                  fontSize: 36, 
                  fontWeight: '800', 
                  color: '#2563eb',
                  letterSpacing: -1,
                  marginBottom: 4
                }}>
                  150
                </Text>
                <Text style={{ 
                  color: '#6b7280',
                  fontSize: 14,
                  fontWeight: '500'
                }}>
                  Total Pickup
                </Text>
              </View>
              <View style={{
                width: 1,
                height: 60,
                backgroundColor: '#e5e7eb'
              }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ 
                  fontSize: 36, 
                  fontWeight: '800', 
                  color: '#2563eb',
                  letterSpacing: -1,
                  marginBottom: 4
                }}>
                  1.250
                </Text>
                <Text style={{ 
                  color: '#6b7280',
                  fontSize: 14,
                  fontWeight: '500'
                }}>
                  KG Sampah
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Activity Status Section - replacing Menu Cepat */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            color: '#374151',
            marginBottom: 20,
            letterSpacing: -0.3
          }}>
            Status Aktivitas
          </Text>
          
          {/* Online Status Card */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
              borderLeftWidth: 4,
              borderLeftColor: '#10b981'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#10b981'
              }} />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Status: Online
              </Text>
            </View>
            <Text style={{ 
              color: '#6b7280', 
              fontSize: 14,
              marginTop: 4,
              marginLeft: 24
            }}>
              Siap menerima pickup request
            </Text>
          </View>

          {/* Today's Performance */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: 12
            }}>
              Performa Hari Ini
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#2563eb' }}>
                  8
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>Completed</Text>
              </View>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#f59e0b' }}>
                  3
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>In Progress</Text>
              </View>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#ef4444' }}>
                  1
                </Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>Cancelled</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
}