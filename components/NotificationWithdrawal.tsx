import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '../api/auth'
import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins'
import { Ionicons } from '@expo/vector-icons'

interface Withdrawal {
  id: number
  amount: number
  method: string
  virtual_account: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  created_at: string
  updated_at: string
  expires_at: string
}

interface NotificationWithdrawalProps {
  visible: boolean
  onClose: () => void
}

export default function NotificationWithdrawal({ visible, onClose }: NotificationWithdrawalProps) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  })

  useEffect(() => {
    if (visible) {
      fetchSuccessWithdrawals()
    }
  }, [visible])

  const fetchSuccessWithdrawals = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${BASE_URL}/api/withdrawals/success`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      if (data.status && Array.isArray(data.data)) {
        setWithdrawals(data.data)
      } else {
        setWithdrawals([])
        console.log('Data withdrawals tidak valid:', data)
      }
    } catch (error) {
      console.error('Error fetching successful withdrawals:', error)
      setWithdrawals([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: string } } = {
      pending: { text: 'Menunggu', color: '#F59E0B' },
      accepted: { text: 'Diterima', color: '#10B981' },
      rejected: { text: 'Ditolak', color: '#EF4444' },
      expired: { text: 'Kadaluarsa', color: '#6B7280' }
    }
    return statusMap[status] || { text: status, color: '#6B7280' }
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
              Notifikasi Penarikan
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>×</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
          ) : withdrawals.length > 0 ? (
            <ScrollView style={styles.withdrawalList}>
              {withdrawals.map((withdrawal) => {
                const status = formatStatus(withdrawal.status)
                return (
                  <View key={withdrawal.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.amount}>
                        Rp {parseInt(String(withdrawal.amount)).toLocaleString('id-ID')}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                      </View>
                    </View>
                    <View style={styles.cardBody}>
                      <View style={styles.infoRow}>
                        <Ionicons name="card-outline" size={20} color="#6B7280" />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Metode</Text>
                          <Text style={styles.methodText}>{withdrawal.method}</Text>
                        </View>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="key-outline" size={20} color="#6B7280" />
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Virtual Account</Text>
                          <Text style={styles.methodText}>{withdrawal.virtual_account}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.cardFooter}>
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text style={styles.dateText}>{formatDate(withdrawal.created_at)}</Text>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={64} color="#CBD5E1" />
              <Text style={[styles.emptyText, { fontFamily: 'Poppins_400Regular' }]}>
                Tidak ada notifikasi penarikan
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
    maxHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6B7280',
    lineHeight: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  withdrawalList: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  cardBody: {
    marginBottom: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 2,
  },
  methodText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#4B5563',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
}) 