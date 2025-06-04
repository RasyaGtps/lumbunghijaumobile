import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { registerUser, RegisterInput } from '../api/auth'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterInput>({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (Object.values(formData).some(value => !value)) {
      Alert.alert('Error', 'Semua field harus diisi')
      return
    }

    if (formData.password !== formData.password_confirmation) {
      Alert.alert('Error', 'Password tidak sama')
      return
    }

    setLoading(true)

    try {
      const response = await registerUser(formData)

      if (response.status) {
        Alert.alert('Sukses', 'Registrasi berhasil, silahkan login', [
          {
            text: 'OK',
            onPress: () => router.replace('/login')
          }
        ])
      } else {
        Alert.alert('Error', response.message || 'Registrasi gagal')
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat registrasi')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof RegisterInput, value: string) => {
    setFormData((prev: RegisterInput) => ({ ...prev, [field]: value }))
  }

  const fields: Record<keyof RegisterInput, string> = {
    name: 'Nama Lengkap',
    email: 'Email',
    phone_number: 'No. HP',
    password: 'Password',
    password_confirmation: 'Konfirmasi Password',
    address: 'Alamat',
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ 
          flex: 1,
          padding: 16,
          paddingTop: '20%' 
        }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: 'bold', 
            marginBottom: 32, 
            textAlign: 'center',
            color: '#18181b'
          }}>
            Register
          </Text>

          {(Object.entries(fields) as [keyof RegisterInput, string][]).map(([field, label]) => (
            <View key={field} style={{ marginBottom: 16 }}>
              <TextInput
                placeholder={label}
                value={formData[field]}
                onChangeText={(value) => handleChange(field, value)}
                secureTextEntry={field.includes('password')}
                style={{
                  borderWidth: 1,
                  borderColor: '#d4d4d8',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                }}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#d4d4d8' : '#18181b',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {loading ? 'Loading...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={{ marginTop: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#18181b' }}>Sudah punya akun? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
} 