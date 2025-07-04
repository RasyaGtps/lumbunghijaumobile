import AsyncStorage from '@react-native-async-storage/async-storage'
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { BASE_URL } from '../api/auth'
import CustomSplashScreen from '../components/CustomSplashScreen'
import { sendOTP } from '../api/auth'

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
        const minSplashTime = 3000 
        
        const token = await AsyncStorage.getItem('token')
        
        await new Promise(resolve => setTimeout(resolve, minSplashTime))
        
        if (!token) {
          setShowSplash(false)
          setAppIsReady(true)
          setTimeout(() => router.replace('/login'), 100)
          return
        }

        // Ambil data user dari AsyncStorage untuk cek email_verified
        const storedUser = await AsyncStorage.getItem('user')
        const userFromStorage = storedUser ? JSON.parse(storedUser) : null
        const isEmailVerified = userFromStorage?.email_verified || false

        console.log('Fetching profile with token:', token)
        const response = await fetch(`${BASE_URL}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        const data = await response.json()
        console.log('Profile response:', data)

        if (!response.ok || !data.status || !data.data?.user) {
          await AsyncStorage.multiRemove(['token', 'user'])
          setShowSplash(false)
          setAppIsReady(true)
          setTimeout(() => router.replace('/login'), 100)
          return
        }

        if (data.status && data.data?.user) {
          // Gabungkan data profile dengan email_verified dari storage
          const updatedUser = {
            ...data.data.user,
            email_verified: data.data.user.email_verified ?? isEmailVerified
          }
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
          
          // Cek status verifikasi email
          if (!updatedUser.email_verified) {
            // Hanya kirim OTP jika email belum terverifikasi
            try {
              console.log('Email belum terverifikasi, mengirim OTP...')
              const otpResponse = await fetch(`${BASE_URL}/api/otp/send`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json'
                }
              })

              if (!otpResponse.ok) {
                await AsyncStorage.setItem('need_resend_otp', 'true')
              }

              setShowSplash(false)
              setAppIsReady(true)
              setTimeout(() => router.replace('/verify-otp'), 100)
            } catch (error) {
              console.error('Error saat mengirim OTP:', error)
              await AsyncStorage.setItem('need_resend_otp', 'true')
              setShowSplash(false)
              setAppIsReady(true)
              setTimeout(() => router.replace('/verify-otp'), 100)
            }
            return
          }

          // Jika email sudah terverifikasi, langsung ke halaman utama
          setShowSplash(false)
          setAppIsReady(true)
          setTimeout(() => router.replace('/'), 100)
        }
      } catch (error) {
        console.error('Error in prepare:', error)
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