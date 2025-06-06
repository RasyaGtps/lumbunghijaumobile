import React from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, TextInput } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, BASE_URL } from '../../api/auth'
import { Ionicons } from '@expo/vector-icons'
import CollectorNavbar from '../../components/CollectorNavbar'

interface Transaction {
  id: number
  user: {
    name: string
    avatar_path: string | null
  }
  pickup_location: string
  total_weight: number
  total_price: number
  status: string
  created_at: string
  image_path: string | null
}

export default function Verify() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      searchTransactions()
    } else {
      loadTransactions()
    }
  }, [searchQuery])

  const loadTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      console.log('🔍 Fetching pending transactions...')
      const response = await fetch(`${API_URL}/transactions/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      console.log('📦 Response:', data)

      if (data.status && data.data) {
        setTransactions(data.data)
      }
    } catch (error) {
      console.error('❌ Failed to load transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchTransactions = async () => {
    try {
      setIsSearching(true)
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }

      console.log('🔍 Searching transactions with query:', searchQuery)
      const response = await fetch(`${API_URL}/transactions/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      console.log('📦 Search response:', data)

      if (data.status && data.data) {
        setTransactions(data.data)
      }
    } catch (error) {
      console.error('❌ Failed to search transactions:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
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

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View style={{ 
          padding: 20,
          paddingTop: 60
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 30
          }}>
            {isSearchVisible ? (
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 12,
                paddingHorizontal: 12,
                height: 44,
                borderWidth: 1,
                borderColor: '#e5e7eb'
              }}>
                {isSearching ? (
                  <ActivityIndicator size="small" color="#3b82f6" style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons name="search-outline" size={20} color="#9ca3af" />
                )}
                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 16,
                    color: '#1f2937'
                  }}
                  placeholder="Cari nama pengguna..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity onPress={() => {
                  setSearchQuery('')
                  setIsSearchVisible(false)
                }}>
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Transaksi
                </Text>
                <TouchableOpacity 
                  onPress={() => setIsSearchVisible(true)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: '#f3f4f6'
                  }}
                >
                  <Ionicons name="search-outline" size={22} color="#6b7280" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {transactions.length === 0 ? (
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}>
              <Ionicons 
                name={searchQuery ? "search-outline" : "document-text-outline"} 
                size={48} 
                color="#9ca3af" 
              />
              <Text style={{ 
                color: '#4b5563',
                fontSize: 16,
                marginTop: 12,
                textAlign: 'center'
              }}>
                {searchQuery 
                  ? 'Tidak ada transaksi yang sesuai'
                  : 'Belum ada transaksi yang perlu diverifikasi'
                }
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {transactions.map((transaction) => (
                <TouchableOpacity
                  key={transaction.id}
                  onPress={() => {
                    const id = transaction.id.toString()
                    router.push({
                      pathname: '/collector/verify/[id]',
                      params: { id }
                    })
                  }}
                  style={{
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
                  }}
                >
                  <View style={{ 
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 12
                  }}>
                    {transaction.user.avatar_path ? (
                      <Image 
                        source={{ uri: `${BASE_URL}${transaction.user.avatar_path}` }}
                        style={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: 20,
                          borderWidth: 2,
                          borderColor: '#f3f4f6'
                        }}
                      />
                    ) : (
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#f3f4f6',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#f3f4f6'
                      }}>
                        <Ionicons name="person" size={20} color="#9ca3af" />
                      </View>
                    )}
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: 2
                      }}>
                        {transaction.user.name}
                      </Text>
                      <Text style={{ 
                        fontSize: 13,
                        color: '#6b7280'
                      }}>
                        {formatDate(transaction.created_at)}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#fef3c7',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 20
                    }}>
                      <Ionicons name="time-outline" size={14} color="#d97706" />
                      <Text style={{
                        marginLeft: 4,
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#d97706'
                      }}>
                        Menunggu
                      </Text>
                    </View>
                  </View>

                  <View style={{ 
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 12,
                    backgroundColor: '#f9fafb',
                    padding: 10,
                    borderRadius: 8
                  }}>
                    <Ionicons name="location-outline" size={16} color="#6b7280" />
                    <Text style={{ 
                      marginLeft: 6,
                      color: '#4b5563',
                      fontSize: 14,
                      flex: 1,
                      fontWeight: '500'
                    }}>
                      {transaction.pickup_location}
                    </Text>
                  </View>

                  <View style={{ 
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6'
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <Ionicons name="scale-outline" size={16} color="#6b7280" />
                      <View style={{ marginLeft: 6 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>
                          Total Berat
                        </Text>
                        <Text style={{ 
                          fontSize: 15,
                          fontWeight: '600',
                          color: '#111827'
                        }}>
                          {transaction.total_weight} kg
                        </Text>
                      </View>
                    </View>
                    
                    <View style={{ 
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <Ionicons name="wallet-outline" size={16} color="#6b7280" />
                      <View style={{ marginLeft: 6 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'right' }}>
                          Total Harga
                        </Text>
                        <Text style={{ 
                          fontSize: 15,
                          fontWeight: '600',
                          color: '#111827'
                        }}>
                          {formatPrice(transaction.total_price)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={{
                    position: 'absolute',
                    right: 16,
                    bottom: '50%',
                    transform: [{ translateY: 10 }]
                  }}>
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color="#9ca3af"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
} 