import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, BASE_URL, User } from '../api/auth'
import * as ImagePicker from 'expo-image-picker'
 
interface EditProfileForm {
  name: string
  email: string
  phone_number: string
  address: string
}

interface ExtendedUser extends User {
  avatar: string
  avatar_path: string
  created_at: string
}

export default function EditProfile() {
  const router = useRouter()
  const [form, setForm] = useState<EditProfileForm>({
    name: '',
    email: '',
    phone_number: '',
    address: ''
  })
  const [userData, setUserData] = useState<ExtendedUser | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const userDataStr = await AsyncStorage.getItem('user')
    if (userDataStr) {
      const user = JSON.parse(userDataStr) as ExtendedUser
      setUserData(user)
      setForm({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address
      })
      if (user.avatar_path) {
        setAvatar(`${BASE_URL}${user.avatar_path}`)
      }
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true
      })

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = result.assets[0].base64
        setAvatar(`data:image/jpeg;base64,${base64Image}`)
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih gambar')
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      const updateData: any = {}
      
      if (form.name !== userData?.name) updateData.name = form.name
      if (form.email !== userData?.email) updateData.email = form.email
      if (form.phone_number !== userData?.phone_number) updateData.phone_number = form.phone_number
      if (form.address !== userData?.address) updateData.address = form.address || ''

      if (avatar && !avatar.startsWith(`${BASE_URL}`)) {
        const base64Data = avatar.split(',')[1]
        if (base64Data) {
          updateData.avatar = base64Data
        }
      }

      const response = await fetch(`${API_URL}/profile/update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengupdate profile')
      }

      if (data.status && data.data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user))
        Alert.alert('Sukses', 'Profile berhasil diupdate', [
          { text: 'OK', onPress: () => {
            router.replace('/profile')
          }}
        ])
      } else {
        throw new Error('Format data tidak sesuai')
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Gagal mengupdate profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ marginBottom: 16 }}
          >
            <Text>← Kembali</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
            Edit Profile
          </Text>

          <TouchableOpacity 
            onPress={pickImage}
            style={{ alignItems: 'center', marginBottom: 24 }}
          >
            {avatar ? (
              <Image 
                source={{ uri: avatar }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <View style={{ 
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#e5e7eb',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 40 }}>📷</Text>
              </View>
            )}
            <Text style={{ marginTop: 8, color: '#0066cc' }}>
              Ubah Foto
            </Text>
          </TouchableOpacity>

          <View style={{ gap: 16 }}>
            <View>
              <Text style={{ marginBottom: 8 }}>Nama Lengkap</Text>
              <TextInput
                value={form.name}
                onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 12
                }}
              />
            </View>

            <View>
              <Text style={{ marginBottom: 8 }}>Email</Text>
              <TextInput
                value={form.email}
                onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 12
                }}
              />
            </View>

            <View>
              <Text style={{ marginBottom: 8 }}>Nomor HP</Text>
              <TextInput
                value={form.phone_number}
                onChangeText={(text) => setForm(prev => ({ ...prev, phone_number: text }))}
                keyboardType="phone-pad"
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 12
                }}
              />
            </View>

            <View>
              <Text style={{ marginBottom: 8 }}>Alamat</Text>
              <TextInput
                value={form.address}
                onChangeText={(text) => setForm(prev => ({ ...prev, address: text }))}
                multiline
                numberOfLines={3}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 12,
                  textAlignVertical: 'top'
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: '#0066cc',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center',
                opacity: loading ? 0.7 : 1
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
} 