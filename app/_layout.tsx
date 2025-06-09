import AsyncStorage from '@react-native-async-storage/async-storage'
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { API_URL } from '../api/auth'
import CustomSplashScreen from '../components/CustomSplashScreen'

// Jangan sembunyikan splash screen otomatis
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const segments = useSegments()
  const router = useRouter()
  const [appIsReady, setAppIsReady] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [initialRoute, setInitialRoute] = useState<string | null>(null)

  useEffect(() => {
    const prepare = async () => {
      try {
        // Tampilkan splash screen minimal 3 detik
        const minSplashTime = 3000 // 3 detik
        
        const token = await AsyncStorage.getItem('token')
        
        // Tunggu minimal splash time
        await new Promise(resolve => setTimeout(resolve, minSplashTime))
        
        if (!token) {
          setShowSplash(false)
          setAppIsReady(true)
          setTimeout(() => router.replace('/login'), 100)
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
          setShowSplash(false)
          setAppIsReady(true)
          setTimeout(() => router.replace('/login'), 100)
          return
        }

        if (data.status && data.data?.user) {
          await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
          setShowSplash(false)
          setAppIsReady(true)
          setTimeout(() => router.replace('/'), 100)
        }
      } catch (error) {
        await AsyncStorage.multiRemove(['token', 'user'])
        setShowSplash(false)
        setAppIsReady(true)
        setTimeout(() => router.replace('/login'), 100)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    if (appIsReady && !showSplash) {
      SplashScreen.hideAsync()
    }
  }, [appIsReady, showSplash])

  // Tampilkan custom splash screen
  if (showSplash) {
    return <CustomSplashScreen />
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