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
  const [initialRoute, setInitialRoute] = useState<string | null>(null)

  useEffect(() => {
    const prepare = async () => {
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

        if (!response.ok || !data.status || !data.data?.user) {
          await AsyncStorage.multiRemove(['token', 'user'])
          router.replace('/login')
          return
        }

        if (data.status && data.data?.user) {
          await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
          router.replace('/')
        }
      } catch (error) {
        await AsyncStorage.multiRemove(['token', 'user'])
        router.replace('/login')
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync()
    }
  }, [appIsReady])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    />
  )
}
