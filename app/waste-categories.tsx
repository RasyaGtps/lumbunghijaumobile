import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, StatusBar, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { WasteCategory } from '../types'
import { BASE_URL } from '../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomNavbar from '../components/CustomNavbar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

interface CategoryQuantity {
  [key: number]: number
}

export default function WasteCategories() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [categories, setCategories] = useState<WasteCategory[]>([])
  const [quantities, setQuantities] = useState<CategoryQuantity>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      const response = await fetch(`${BASE_URL}/api/waste-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      if (data.status) {
        setCategories(data.data)
      } else {
        setError(data.message || 'Gagal mengambil data kategori')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (categoryId: number) => {
    setFailedImages(prev => new Set([...prev, categoryId]))
  }

  const handleQuantityChange = (categoryId: number, change: number) => {
    setQuantities(prev => {
      const currentQty = prev[categoryId] || 0
      const newQty = Math.max(0, currentQty + change) // Prevent negative values
      if (newQty === 0) {
        const { [categoryId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [categoryId]: newQty }
    })
  }

  const handleAddToCart = async () => {
    try {
      if (Object.keys(quantities).length === 0) {
        Alert.alert('Error', 'Mohon pilih sampah terlebih dahulu')
        return
      }

      setSubmitting(true)
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      const addToCartPromises = Object.entries(quantities).map(async ([categoryId, weight]) => {
        try {
          const response = await fetch(`${BASE_URL}/api/cart/add`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              categoryId: parseInt(categoryId),
              estimatedWeight: parseFloat(weight.toString())
            })
          })

          const data = await response.json()
          console.log('Response from server:', data)

          if (!data.status) {
            throw new Error(data.message || 'Gagal menambahkan ke cart')
          }

          return data
        } catch (error: any) {
          console.error('Error adding item to cart:', error)
          throw new Error(error.message || 'Gagal menambahkan ke cart')
        }
      })

      try {
        await Promise.all(addToCartPromises)
        
        setQuantities({})
        router.push('/cart')
      } catch (error) {
        Alert.alert('Error', 'Gagal menambahkan item ke cart')
      }

    } catch (err) {
      console.error('Error in handleAddToCart:', err)
      Alert.alert('Error', 'Terjadi kesalahan saat menambahkan ke cart')
    } finally {
      setSubmitting(false)
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
          onPress={fetchCategories}
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
        backgroundColor: 'white',
        justifyContent: 'space-between'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity 
            onPress={() => router.back()}
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
          }}>Pilih sampah</Text>
        </View>

        <TouchableOpacity 
          onPress={handleAddToCart}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#10b981" />
          ) : (
            <Text style={{ color: '#10b981' }}>Lanjut</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {categories.map((category) => (
          <View 
            key={category.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb'
            }}
          >
            {!failedImages.has(category.id) ? (
              <Image 
                source={{ uri: `${BASE_URL}/storage/${category.image_path}` }}
                style={{ 
                  width: 60, 
                  height: 60, 
                  backgroundColor: '#f3f4f6',
                  borderRadius: 8,
                  marginRight: 16
                }}
                onError={() => handleImageError(category.id)}
              />
            ) : (
              <View style={{ 
                width: 60, 
                height: 60, 
                backgroundColor: '#f3f4f6',
                borderRadius: 8,
                marginRight: 16,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 24 }}>📷</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>{category.name}</Text>
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
                    {parseInt(category.price_per_kg).toLocaleString('id-ID')}/kg
                  </Text>
                </View>
              </View>
            </View>
            {quantities[category.id] ? (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                backgroundColor: '#F3F4F6',
                borderRadius: 20,
                paddingVertical: 4,
                paddingHorizontal: 8
              }}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(category.id, -1)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#374151', fontSize: 16, fontWeight: '600' }}>-</Text>
                </TouchableOpacity>
                <Text style={{ 
                  marginHorizontal: 16,
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#374151'
                }}>{quantities[category.id]}kg</Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(category.id, 1)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#374151', fontSize: 16, fontWeight: '600' }}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => handleQuantityChange(category.id, 1)}
                style={{
                  backgroundColor: '#F3F4F6',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20
                }}
              >
                <Text style={{ color: '#10b981', fontWeight: '500' }}>Tambah</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* <CustomNavbar /> */}
    </View>
  )
} 