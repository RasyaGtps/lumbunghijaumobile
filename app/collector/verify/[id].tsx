import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, BASE_URL } from '../../../api/auth'
import { Ionicons } from '@expo/vector-icons'
import CollectorNavbar from '../../../components/CollectorNavbar'

interface TransactionDetail {
  id: number
  transaction_id: number
  category_id: number
  estimated_weight: string
  actual_weight: string | null
  photo_path: string | null
  category: {
    id: number
    name: string
    price_per_kg: string
  }
}

interface Transaction {
  id: number
  user: {
    name: string
    avatar_path: string | null
  }
  pickup_location: string
  total_weight: string
  total_price: string
  status: string
  created_at: string
  image_path: string | null
  details: TransactionDetail[]
}

export default function VerifyDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [actualWeight, setActualWeight] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadTransaction()
  }, [])

  const loadTransaction = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      console.log('🔍 Fetching transaction details for ID:', id)
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      console.log('📦 Response:', data)

      if (data.status && data.data) {
        setTransaction(data.data)
        // Pre-fill dengan estimated weight
        setActualWeight(data.data.total_weight.toString())
      }
    } catch (error) {
      console.error('❌ Failed to load transaction:', error)
      Alert.alert('Error', 'Gagal memuat data transaksi')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(price))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
        <CollectorNavbar />
      </View>
    )
  }

  if (!transaction) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={{ 
            marginTop: 12,
            fontSize: 16,
            color: '#1f2937',
            textAlign: 'center'
          }}>
            Transaksi tidak ditemukan
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginTop: 20,
              backgroundColor: '#3b82f6',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>
              Kembali
            </Text>
          </TouchableOpacity>
        </View>
        <CollectorNavbar />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ padding: 20, paddingTop: 60 }}>
          {/* Header */}
          <View style={{ 
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: '#f3f4f6'
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#4b5563" />
            </TouchableOpacity>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              Detail Transaksi
            </Text>
          </View>

          {/* User Info */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#f3f4f6'
          }}>
            <View style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12
            }}>
              {transaction.user.avatar_path ? (
                <Image 
                  source={{ uri: `${BASE_URL}${transaction.user.avatar_path}` }}
                  style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: '#f3f4f6'
                  }}
                />
              ) : (
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#f3f4f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#f3f4f6'
                }}>
                  <Ionicons name="person" size={24} color="#9ca3af" />
                </View>
              )}
              <View style={{ marginLeft: 12 }}>
                <Text style={{ 
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: 2
                }}>
                  {transaction.user.name}
                </Text>
                <Text style={{ 
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  {formatDate(transaction.created_at)}
                </Text>
              </View>
            </View>

            <View style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f9fafb',
              padding: 12,
              borderRadius: 8
            }}>
              <Ionicons name="location-outline" size={18} color="#6b7280" />
              <Text style={{ 
                marginLeft: 8,
                color: '#4b5563',
                fontSize: 15,
                flex: 1,
                fontWeight: '500'
              }}>
                {transaction.pickup_location}
              </Text>
            </View>
          </View>

          {/* Weight Input */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#f3f4f6'
          }}>
            <Text style={{ 
              fontSize: 16,
              fontWeight: '600',
              color: '#111827',
              marginBottom: 16
            }}>
              Verifikasi Berat
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ 
                fontSize: 14,
                color: '#6b7280',
                marginBottom: 4
              }}>
                Berat Estimasi
              </Text>
              <Text style={{ 
                fontSize: 16,
                fontWeight: '600',
                color: '#111827'
              }}>
                {transaction.total_weight} kg
              </Text>
            </View>

            <View>
              <Text style={{ 
                fontSize: 14,
                color: '#6b7280',
                marginBottom: 4
              }}>
                Berat Aktual
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 16,
                  color: '#1f2937'
                }}
                value={actualWeight}
                onChangeText={setActualWeight}
                keyboardType="decimal-pad"
                placeholder="Masukkan berat aktual"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Price Info */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#f3f4f6'
          }}>
            <Text style={{ 
              fontSize: 16,
              fontWeight: '600',
              color: '#111827',
              marginBottom: 16
            }}>
              Rincian Harga
            </Text>

            <View style={{ 
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8
            }}>
              <Text style={{ color: '#6b7280' }}>Harga Estimasi</Text>
              <Text style={{ 
                fontWeight: '600',
                color: '#111827'
              }}>
                {formatPrice(transaction.total_price)}
              </Text>
            </View>

            <View style={{ 
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: '#f3f4f6'
            }}>
              <Text style={{ color: '#6b7280' }}>Harga Final</Text>
              <Text style={{ 
                fontWeight: '600',
                color: '#111827'
              }}>
                {formatPrice(Number(actualWeight) * Number(transaction.details[0].category.price_per_kg))}
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => {
              // TODO: Implement verification submit
              Alert.alert('Info', 'Fitur verifikasi akan segera hadir!')
            }}
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#93c5fd' : '#3b82f6',
              paddingVertical: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Memproses...
                </Text>
              </>
            ) : (
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Verifikasi Transaksi
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
}