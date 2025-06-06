import AsyncStorage from '@react-native-async-storage/async-storage'
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { API_URL } from '../api/auth'

// Jangan sembunyikan splash screen otomatis
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const segments = useSegments()
  const router = useRouter()
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        await checkAuth()
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
        await SplashScreen.hideAsync()
      }
    }

    prepare()
  }, [])

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
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
        await AsyncStorage.multiRemove(['token', 'user'])
        router.replace('/login')
        return
      }

      if (data.status && data.data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
        router.replace('/')
      } else {
        throw new Error(`Format data tidak sesuai: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      await AsyncStorage.multiRemove(['token', 'user'])
      router.replace('/login')
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
