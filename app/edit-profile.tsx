import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { API_URL, BASE_URL, User } from '../api/auth'

interface EditProfileForm {
  name: string
  email: string
  phone_number: string
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Hijau */}
        <View style={{
          backgroundColor: '#27AE60',
          height: 150,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold'
          }}>
            Edit Profile
          </Text>
        </View>

        {/* Foto + Change Picture */}
        <View style={{
          alignItems: 'center',
          marginTop: -50, // supaya overlap ke header hijau
          marginBottom: 20
        }}>
          <TouchableOpacity onPress={pickImage}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: '#fff'
                }}
              />
            ) : (
              <View style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: '#e5e7eb',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderColor: '#fff'
              }}>
                <Text style={{ fontSize: 40 }}>📷</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={{ marginTop: 8 }}>
            Change Picture
          </Text>
        </View>

        {/* Form */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ marginBottom: 8 }}>Username</Text>
          <TextInput
            value={form.name}
            onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16
            }}
          />

          <Text style={{ marginBottom: 8 }}>Email I'd</Text>
          <TextInput
            value={form.email}
            onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16
            }}
          />

          <Text style={{ marginBottom: 8 }}>Phone Number</Text>
          <TextInput
            value={form.phone_number}
            onChangeText={(text) => setForm(prev => ({ ...prev, phone_number: text }))}
            keyboardType="phone-pad"
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16
            }}
          />

          {/* Password Field (dummy, sama kaya gambar kamu) */}
          <Text style={{ marginBottom: 8 }}>Password</Text>
          <TextInput
            value={'evFTbyVVCd'}
            secureTextEntry
            editable={false} // password dummy, tidak bisa edit
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              padding: 12,
              marginBottom: 24
            }}
          />

          {/* Tombol Update */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: '#27AE60',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              opacity: loading ? 0.7 : 1,
              marginBottom: 40
            }}
          >
            <Text style={{
              color: 'white',
              fontWeight: 'bold'
            }}>
              {loading ? 'Updating...' : 'Update'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
