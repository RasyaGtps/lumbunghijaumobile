import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { WasteCategory, WasteItem, getWasteCategories, createTransaction } from '../api/waste'
import * as ImagePicker from 'expo-image-picker'

export default function WastePickup() {
  const router = useRouter()
  const [categories, setCategories] = useState<WasteCategory[]>([])
  const [selectedItems, setSelectedItems] = useState<WasteItem[]>([])
  const [pickupLocation, setPickupLocation] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getWasteCategories()
      setCategories(data)
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat kategori sampah')
    }
  }

  const handleAddItem = () => {
    if (categories.length === 0) return
    setSelectedItems(prev => [...prev, {
      categoryId: categories[0].id,
      estimatedWeight: '',
      category: categories[0]
    }])
  }

  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdateItem = (index: number, updates: Partial<WasteItem>) => {
    setSelectedItems(prev => prev.map((item, i) => {
      if (i === index) {
        const category = updates.categoryId 
          ? categories.find(c => c.id === updates.categoryId)
          : item.category
        return { ...item, ...updates, category }
      }
      return item
    }))
  }

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      handleUpdateItem(index, { photo: result.assets[0].uri })
    }
  }

  const handleSubmit = async () => {
    try {
      if (selectedItems.length === 0) {
        Alert.alert('Error', 'Pilih minimal 1 jenis sampah')
        return
      }

      if (!pickupLocation) {
        Alert.alert('Error', 'Masukkan lokasi pengambilan')
        return
      }

      const invalidItems = selectedItems.filter(item => !item.estimatedWeight || !item.photo)
      if (invalidItems.length > 0) {
        Alert.alert('Error', 'Lengkapi berat dan foto untuk semua sampah')
        return
      }

      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      const transaction = await createTransaction(token, pickupLocation, selectedItems)
      Alert.alert('Sukses', 'Transaksi berhasil dibuat', [
        { text: 'OK', onPress: () => router.replace('/') }
      ])
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Gagal membuat transaksi')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      if (!item.category || !item.estimatedWeight) return total
      return total + (parseFloat(item.estimatedWeight) * parseFloat(item.category.price_per_kg))
    }, 0)
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
            Jual Sampah
          </Text>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ marginBottom: 8 }}>Lokasi Pengambilan</Text>
            <TextInput
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholder="Masukkan alamat lengkap"
              multiline
              numberOfLines={2}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                padding: 12,
                textAlignVertical: 'top'
              }}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16 
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Daftar Sampah</Text>
              <TouchableOpacity
                onPress={handleAddItem}
                style={{
                  backgroundColor: '#0066cc',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6
                }}
              >
                <Text style={{ color: 'white' }}>+ Tambah</Text>
              </TouchableOpacity>
            </View>

            {selectedItems.map((item, index) => (
              <View 
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12
                }}
              >
                <View style={{ 
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 12
                }}>
                  <Text style={{ fontWeight: 'bold' }}>Sampah #{index + 1}</Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                    <Text style={{ color: '#dc2626' }}>Hapus</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={{ marginBottom: 8 }}>Jenis Sampah</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 8 }}
                  >
                    {categories.map(category => (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() => handleUpdateItem(index, { categoryId: category.id })}
                        style={{
                          backgroundColor: item.categoryId === category.id ? '#0066cc' : '#f3f4f6',
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 16,
                          marginRight: 8
                        }}
                      >
                        <Text style={{ 
                          color: item.categoryId === category.id ? 'white' : 'black'
                        }}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {item.category && (
                    <Text style={{ color: '#666' }}>
                      Harga: Rp {parseFloat(item.category.price_per_kg).toLocaleString('id-ID')}/kg
                    </Text>
                  )}
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={{ marginBottom: 8 }}>Perkiraan Berat (kg)</Text>
                  <TextInput
                    value={item.estimatedWeight}
                    onChangeText={(text) => handleUpdateItem(index, { estimatedWeight: text })}
                    keyboardType="decimal-pad"
                    style={{
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      borderRadius: 8,
                      padding: 12
                    }}
                  />
                </View>

                <View>
                  <Text style={{ marginBottom: 8 }}>Foto Sampah</Text>
                  <TouchableOpacity 
                    onPress={() => pickImage(index)}
                    style={{ alignItems: 'center' }}
                  >
                    {item.photo ? (
                      <Image 
                        source={{ uri: item.photo }}
                        style={{ width: '100%', height: 200, borderRadius: 8 }}
                      />
                    ) : (
                      <View style={{ 
                        width: '100%',
                        height: 200,
                        borderRadius: 8,
                        backgroundColor: '#f3f4f6',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Text style={{ fontSize: 40 }}>📷</Text>
                        <Text style={{ color: '#666', marginTop: 8 }}>Tap untuk memilih foto</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {selectedItems.length > 0 && (
            <View style={{ 
              backgroundColor: '#f3f4f6',
              padding: 16,
              borderRadius: 8,
              marginBottom: 24
            }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                Total Perkiraan
              </Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0066cc' }}>
                Rp {calculateTotal().toLocaleString('id-ID')}
              </Text>
            </View>
          )}

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
              {loading ? 'Memproses...' : 'Kirim Permintaan'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
} 