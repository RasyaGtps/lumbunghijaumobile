import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { API_URL } from '../api/auth'

export default function RootLayout() {
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [segments])

  const checkAuth = async () => {
    try {
      const [token, userStr] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user')
      ])

      const user = userStr ? JSON.parse(userStr) : null
      const segment = segments[0] // Mendapatkan segment pertama dari path
      const isAuthRoute = segment === 'login' || segment === 'register'

      // Jika tidak ada token, arahkan ke login kecuali jika di halaman auth atau register
      if (!token && !isAuthRoute) {
        router.replace('/login')
        return
      }

      // Jika ada token tapi di halaman auth, arahkan sesuai role
      if (token && isAuthRoute) {
        if (user?.role === 'collector') {
          router.replace('/collector')
        } else {
          router.replace('/')
        }
        return
      }

      // Jika ada token, pastikan user di halaman yang sesuai dengan rolenya
      if (token && user) {
        const isInCollectorPages = segment === 'collector'
        const isCollector = user.role === 'collector'

        if (isCollector && !isInCollectorPages) {
          router.replace('/collector')
        } else if (!isCollector && isInCollectorPages) {
          router.replace('/')
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    }
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    />
  )
}
