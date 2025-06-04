import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginUser } from '../api/auth'

export default function Login() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert('Error', 'Semua field harus diisi')
      return
    }

    setLoading(true)

    try {
      const response = await loginUser({ login, password })

      if (response.status && response.data) {
        await AsyncStorage.setItem('token', response.data.token)
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user))
        router.replace('/')
      } else {
        Alert.alert('Error', response.message || 'Login gagal')
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' }}>
        Login
      </Text>

      <View style={{ marginBottom: 16 }}>
        <TextInput
          placeholder="Email atau No. HP"
          value={login}
          onChangeText={setLogin}
          style={{
            borderWidth: 1,
            borderColor: '#d4d4d8',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
        />
      </View>

      <View style={{ marginBottom: 24 }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: '#d4d4d8',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#d4d4d8' : '#18181b',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {loading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/register')}
        style={{ marginTop: 16, alignItems: 'center' }}
      >
        <Text style={{ color: '#18181b' }}>Belum punya akun? Daftar</Text>
      </TouchableOpacity>
    </View>
  )
} 