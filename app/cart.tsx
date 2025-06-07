import React, { Fragment } from 'react'
import { useEffect, useState } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  StatusBar,
  TextInput,
  Image,
  Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import { BASE_URL } from '../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomNavbar from '../components/CustomNavbar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

interface CartItem {
  id: number
  transaction_id: number
  category_id: number
  estimated_weight: string
  category: {
    id: number
    name: string
    type: string
    price_per_kg: number
    image_path: string
  }
}

interface Cart {
  id: number
  user_id: number
  total_weight: string
  total_price: number
  status: string
  pickup_location: string | null
  details: CartItem[]
}

export default function Cart() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pickupLocation, setPickupLocation] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingItem, setEditingItem] = useState<CartItem | null>(null)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      const response = await fetch(`${BASE_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('Cart data:', data)

      if (data.status) {
        // Pastikan data.data ada dan memiliki properti yang dibutuhkan
        if (data.data && typeof data.data === 'object') {
          setCart({
            ...data.data,
            details: data.data.details || [] // Pastikan details selalu array
          })
          if (data.data.pickup_location) {
            setPickupLocation(data.data.pickup_location)
          }
        } else {
          // Jika tidak ada data cart, redirect ke waste-categories
          router.replace('/waste-categories')
        }
      } else {
        setError(data.message || 'Gagal mengambil data cart')
      }
    } catch (err) {
      console.error('Error fetching cart:', err)
      setError('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (detailId: number) => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      const response = await fetch(`${BASE_URL}/api/cart/remove`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ detailId })
      })

      const data = await response.json()
      if (data.status) {
        if (data.data === null) {
          // Cart kosong, kembali ke halaman kategori
          router.replace('/waste-categories')
        } else {
          setCart(data.data)
        }
      } else {
        Alert.alert('Error', data.message || 'Gagal menghapus item')
      }
    } catch (err) {
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus item')
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (status !== 'granted') {
      Alert.alert('Maaf', 'Kami membutuhkan izin untuk mengakses galeri foto')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    })

    if (!result.canceled) {
      setPhoto(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (!pickupLocation) {
      Alert.alert('Error', 'Mohon isi lokasi penjemputan')
      return
    }

    if (!photo) {
      Alert.alert('Error', 'Mohon pilih foto sampah')
      return
    }

    try {
      setSubmitting(true)
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      // Convert photo to base64
      const response = await fetch(photo)
      const blob = await response.blob()
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            // Remove data:image/jpeg;base64, prefix
            resolve(reader.result.split(',')[1])
          }
        }
        reader.readAsDataURL(blob)
      })

      const submitData = {
        pickupLocation,
        photo: base64
      }

      console.log('Submitting data...')

      const submitResponse = await fetch(`${BASE_URL}/api/cart/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const data = await submitResponse.json()
      console.log('Submit response:', data)

      if (data.status) {
        // Store transaction ID in AsyncStorage for later use
        await AsyncStorage.setItem('last_transaction_id', String(data.data.id))
        // Redirect to success page first
        router.replace('/transaction-success')
      } else {
        Alert.alert('Error', data.message || 'Gagal submit transaksi')
      }
    } catch (err) {
      console.error('Submit error:', err)
      Alert.alert('Error', 'Terjadi kesalahan saat submit transaksi')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateWeight = async (detailId: number, newWeight: string) => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      console.log('Updating weight:', {
        detailId,
        estimatedWeight: newWeight
      })

      const response = await fetch(`${BASE_URL}/api/cart/update-item`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          detailId,
          estimatedWeight: parseInt(newWeight)
        })
      })

      const data = await response.json()
      console.log('Update response:', data)

      if (data.status) {
        setCart(data.data)
        setEditingItem(null)
      } else {
        Alert.alert('Error', data.message || 'Gagal mengupdate berat')
      }
    } catch (err) {
      console.error('Error updating weight:', err)
      Alert.alert('Error', 'Terjadi kesalahan saat mengupdate berat')
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: '#dc2626', marginBottom: 8 }}>{error}</Text>
        <TouchableOpacity 
          onPress={fetchCart}
          style={{
            backgroundColor: '#10b981',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8
          }}
        >
          <Text style={{ color: 'white' }}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!cart || !cart.details || cart.details.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingHorizontal: 20,
          paddingTop: (insets.top || 5) + 8,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          backgroundColor: 'white'
        }}>
          <TouchableOpacity 
            onPress={() => router.push('/waste-categories')}
            style={{ 
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600',
            includeFontPadding: false
          }}>Cart</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 16 }}>
            Cart kosong
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/waste-categories')}
            style={{
              backgroundColor: '#10b981',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white' }}>Pilih Sampah</Text>
          </TouchableOpacity>
        </View>

        <CustomNavbar />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20,
        paddingTop: (insets.top || 5) + 8,
        paddingBottom: 12,
        backgroundColor: 'white',
        justifyContent: 'space-between'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => router.push('/waste-categories')}
            style={{ 
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600'
          }}>Keranjang</Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/waste-categories')}>
          <Text style={{ color: '#10b981', fontWeight: '500' }}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingBottom: 120
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ 
            backgroundColor: 'white',
            marginTop: 8,
            paddingHorizontal: 20,
            paddingVertical: 16
          }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '500',
              marginBottom: 8,
              color: '#374151'
            }}>Jenis Sampah</Text>

            {cart.details.map((item) => (
              <View 
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e7eb'
                }}
              >
                {item.category.image_path ? (
                  <Image 
                    source={{ uri: `${BASE_URL}/storage/${item.category.image_path}` }}
                    style={{ 
                      width: 50, 
                      height: 50, 
                      backgroundColor: '#f3f4f6',
                      borderRadius: 8,
                      marginRight: 12
                    }}
                    onError={() => {
                      console.log('Error loading image:', item.category.image_path)
                    }}
                  />
                ) : (
                  <View style={{ 
                    width: 50, 
                    height: 50, 
                    backgroundColor: '#f3f4f6',
                    borderRadius: 8,
                    marginRight: 12,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 24 }}>📷</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500' }}>{item.category.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <View style={{ 
                      backgroundColor: '#FEF3C7', 
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 8
                    }}>
                      <Text style={{ color: '#D97706', fontSize: 12, marginRight: 2 }}>Rp</Text>
                      <Text style={{ color: '#D97706', fontSize: 12 }}>
                        {parseInt(String(item.category.price_per_kg)).toLocaleString('id-ID')}/kg
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ 
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f3f4f6',
                  borderRadius: 8,
                  marginRight: 8
                }}>
                  <TouchableOpacity 
                    onPress={() => {
                      const currentWeight = parseInt(item.estimated_weight)
                      if (!isNaN(currentWeight) && currentWeight > 1) {
                        const newWeight = currentWeight - 1
                        handleUpdateWeight(item.id, String(newWeight))
                      }
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 20, color: '#374151' }}>-</Text>
                  </TouchableOpacity>

                  <View style={{
                    paddingHorizontal: 8,
                    minWidth: 50,
                    alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 14, color: '#374151' }}>
                      {parseInt(item.estimated_weight)}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>kg</Text>
                  </View>

                  <TouchableOpacity 
                    onPress={() => {
                      const currentWeight = parseInt(item.estimated_weight)
                      if (!isNaN(currentWeight)) {
                        const newWeight = currentWeight + 1
                        handleUpdateWeight(item.id, String(newWeight))
                      }
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 20, color: '#374151' }}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={{
                    padding: 8
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ 
            backgroundColor: 'white',
            marginTop: 8,
            padding: 20
          }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '500',
              marginBottom: 8,
              color: '#374151'
            }}>Foto Sampah</Text>
            
            <TouchableOpacity
              onPress={pickImage}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                overflow: 'hidden'
              }}
            >
              {photo ? (
                <Image 
                  source={{ uri: photo }} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: 8,
                  }}
                  resizeMode="contain"
                />
              ) : (
                <Fragment>
                  <Ionicons name="camera-outline" size={32} color="#9ca3af" />
                  <Text style={{ color: '#6b7280', marginTop: 8 }}>Pilih Foto</Text>
                </Fragment>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ 
            backgroundColor: 'white',
            marginTop: 8,
            padding: 20
          }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '500',
              marginBottom: 8,
              color: '#374151'
            }}>Lokasi Penjemputan</Text>
            
            <View style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              backgroundColor: 'white',
              padding: 12
            }}>
              <TextInput
                value={pickupLocation}
                onChangeText={setPickupLocation}
                placeholder="Masukkan alamat lengkap"
                multiline
                numberOfLines={3}
                style={{
                  fontSize: 14,
                  color: '#374151',
                  textAlignVertical: 'top',
                  minHeight: 72
                }}
              />
            </View>
          </View>

          <View style={{ 
            backgroundColor: 'white',
            marginTop: 8,
            padding: 20,
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: '#e5e7eb'
            }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>Total Berat</Text>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{cart.total_weight} kg</Text>
            </View>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              marginTop: 8,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb'
            }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>Estimasi Pendapatan</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#10b981' }}>
                Rp {parseInt(String(cart.total_price)).toLocaleString('id-ID')}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              style={{
                backgroundColor: '#10b981',
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 16
              }}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                  Cari Picker
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingBottom: insets.bottom
      }}>
      <CustomNavbar />
      </View>
    </View>
  )
} 