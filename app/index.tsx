import { View, Text, ScrollView, Image } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomNavbar from '../components/CustomNavbar'
import { User } from '../types'
import { BASE_URL } from '../api/auth'

interface ExtendedUser extends User {
  avatar_path?: string
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingTop: 48, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {userData.avatar_path ? (
              <Image
                source={{ 
                  uri: `${BASE_URL}${userData.avatar_path}`,
                  headers: { Accept: 'image/*' } 
                }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#0066cc',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                  {userData.name.charAt(0)}
                </Text>
              </View>
            )}
            <View>
              <Text style={{ color: '#666', fontSize: 14 }}>Selamat datang,</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{userData.name}</Text>
            </View>
          </View>

          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#f3f4f6',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </View>
        </View>

        {/* Balance */}
        <View style={{ padding: 16 }}>
          <View
            style={{
              backgroundColor: '#0066cc',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text style={{ color: 'white', marginBottom: 8 }}>Memiliki Uang Sebesar</Text>
            <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
              Rp {parseFloat(userData.balance || '0').toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* Kg Info */}
        <View style={{ padding: 16 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#666' }}>
              1.000,00 <Text style={{ fontSize: 24 }}>Kg</Text>
            </Text>
          </View>
        </View>

        {/* Boxes */}
        <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View
              key={item}
              style={{
                width: '30%',
                aspectRatio: 1,
                backgroundColor: '#f3f4f6',
                borderRadius: 12,
              }}
            />
          ))}
        </View>
      </ScrollView>

      <CustomNavbar />
    </View>
  )
}
