import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { API_URL } from '../api/auth'

// Jangan sembunyikan splash screen otomatis
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()
  const [appIsReady, setAppIsReady] = useState(false)

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

        await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
        router.replace('/')
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
