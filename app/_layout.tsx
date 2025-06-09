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
          await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
          
          // Cek status verifikasi email
          if (!data.data.user.email_verified) {
            try {
              console.log('Attempting to send OTP...')
              // Kirim OTP baru sebelum redirect ke halaman verifikasi
              const otpResponse = await fetch(`${BASE_URL}/api/otp/send`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json'
                }
              })

              const otpData = await otpResponse.text() // Gunakan text() untuk melihat respons mentah
              console.log('OTP Response status:', otpResponse.status)
              console.log('OTP Response headers:', Object.fromEntries(otpResponse.headers.entries()))
              console.log('OTP Raw response:', otpData)

              try {
                const otpJson = JSON.parse(otpData)
                console.log('OTP JSON response:', otpJson)
              } catch (e) {
                console.log('Failed to parse OTP response as JSON')
              }

              if (!otpResponse.ok) {
                throw new Error(`Failed to send OTP: ${otpData}`)
              }

              setShowSplash(false)
              setAppIsReady(true)
              setTimeout(() => router.replace('/verify-otp'), 100)
            } catch (error) {
              console.error('Error saat mengirim OTP:', error)
              // Tetap arahkan ke halaman OTP, tapi simpan informasi bahwa perlu kirim ulang
              await AsyncStorage.setItem('need_resend_otp', 'true')
              setShowSplash(false)
              setAppIsReady(true)
              setTimeout(() => router.replace('/verify-otp'), 100)
            }
            return
          }

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