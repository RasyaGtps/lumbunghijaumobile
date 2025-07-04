import { useEffect, useState } from 'react'
import { SplashScreen, Slot } from 'expo-router'
import { useRouter } from 'expo-router'
import { AuthProvider } from './contexts/AuthContext'
import { View } from 'react-native'
import './global.css'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function App() {
  const router = useRouter()
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Preload any resources or data needed for the app
        await Promise.all([
          // Add any async operations here
        ])
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  if (!appIsReady) {
    return null
  }

  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </View>
  )
}