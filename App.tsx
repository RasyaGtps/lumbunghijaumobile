import { useEffect } from 'react'
import { SplashScreen } from 'expo-router'
import { useRouter } from 'expo-router'
import './global.css'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function App() {
  const router = useRouter()

  useEffect(() => {
    // Hide splash screen after resources are loaded
    SplashScreen.hideAsync()
  }, [])

  return null
}   