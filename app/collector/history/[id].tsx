import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, BASE_URL } from '../../../api/auth'
import { Ionicons } from '@expo/vector-icons'
import CollectorNavbar from '../../../components/CollectorNavbar'

interface WasteCategory {
  id: number
  name: string
  type: string
  price_per_kg: string
  image_path: string | null
}

interface TransactionDetail {
  id: number
  transaction_id: number
  category_id: number
  estimated_weight: string
  actual_weight: string
  photo_path: string | null
  category: WasteCategory
}

interface Transaction {
  id: number
  user: {
    name: string
    avatar: string | null
  }
  pickup_location: string
  total_weight: string
  total_price: string
  status: string
  created_at: string
  image_path: string | null
  details: TransactionDetail[]
}

export default function HistoryDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      }
    } catch (error) {
      console.error('❌ Failed to load transaction:', error)
    } finally {
      setIsLoading(false)
    }
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
          <ActivityIndicator size="large" color="#10b981" />
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
              backgroundColor: '#10b981',
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
              Detail Verifikasi
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
              {transaction.user.avatar ? (
                <Image 
                  source={{ uri: `${BASE_URL}${transaction.user.avatar}` }}
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

          {/* Detail Sampah */}
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
              Detail Sampah
            </Text>

            {/* List Sampah */}
            {transaction.details.map((item) => (
              <View key={item.id} style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  {item.category.image_path ? (
                    <Image 
                      source={{ uri: `${BASE_URL}${item.category.image_path}` }}
                      style={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 8,
                        marginRight: 12
                      }}
                    />
                  ) : (
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: '#f3f4f6',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12
                    }}>
                      <Ionicons name="leaf-outline" size={24} color="#9ca3af" />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: 2
                    }}>
                      {item.category.name}
                    </Text>
                    <Text style={{ color: '#059669' }}>
                      Rp {parseInt(item.category.price_per_kg).toLocaleString('id-ID')}/kg
                    </Text>
                  </View>
                </View>

                <View style={{ 
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f9fafb',
                  padding: 8,
                  borderRadius: 6
                }}>
                  <View>
                    <Text style={{ color: '#6b7280', marginBottom: 2 }}>Berat Awal</Text>
                    <Text style={{ fontWeight: '600', color: '#111827' }}>
                      {parseFloat(item.estimated_weight)} kg
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#6b7280', marginBottom: 2 }}>Berat Akhir</Text>
                    <Text style={{ fontWeight: '600', color: '#059669' }}>
                      {parseFloat(item.actual_weight)} kg
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
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
              Total
            </Text>

            <View style={{ 
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8
            }}>
              <Text style={{ color: '#6b7280' }}>Total Berat</Text>
              <Text style={{ fontWeight: '600', color: '#111827' }}>
                {parseFloat(transaction.total_weight)} kg
              </Text>
            </View>

            <View style={{ 
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: '#f3f4f6'
            }}>
              <Text style={{ color: '#6b7280' }}>Total Harga</Text>
              <Text style={{ fontWeight: '600', color: '#059669', fontSize: 16 }}>
                Rp {parseInt(transaction.total_price).toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
} 