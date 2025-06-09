import { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from '../api/auth'

export default function Withdraw() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [virtualAccount, setVirtualAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMethodModal, setShowMethodModal] = useState(false)

  const bankMethods = [
    'BCA',
    'Mandiri',
    'Bank Jatim',
    'BNI',
    'BRI',
    'BTN',
    'CIMB Niaga',
    'Permata Bank',
    'Maybank'
  ]

  const handleWithdraw = async () => {
    const withdrawalAmount = parseFloat(amount.replace(/[.,]/g, ''))
    if (!amount || withdrawalAmount <= 0) {
      Alert.alert('Error', 'Masukkan jumlah penarikan yang valid')
      return
    }

    if (withdrawalAmount < 50000) {
      Alert.alert('Error', 'Jumlah penarikan minimal adalah Rp 50.000')
      return
    }

    if (!method.trim()) {
      Alert.alert('Error', 'Masukkan metode penarikan')
      return
    }

    if (!virtualAccount.trim() || virtualAccount.length < 10) {
      Alert.alert('Error', 'Masukkan nomor virtual account yang valid (minimal 10 digit)')
      return
    }

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      
      if (!token) {
        router.replace('/login')
        return
      }

      const response = await fetch(`${BASE_URL}/api/withdrawals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: withdrawalAmount,
          method: method.trim(),
          virtual_account: virtualAccount.trim()
        })
      })

      const data = await response.json()

      if (data.status === 'success') {
        Alert.alert(
          'Berhasil',
          'Permintaan penarikan berhasil dibuat',
          [
            {
              text: 'OK',
              onPress: () => {
                updateUserBalance(data.data.saldo_tersisa)
                router.push('/withdrawal-history')
              }
            }
          ]
        )
      } else {
        Alert.alert('Error', data.message || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error:', error)
      Alert.alert('Error', 'Terjadi kesalahan saat memproses penarikan')
    } finally {
      setLoading(false)
    }
  }

  const updateUserBalance = async (newBalance: string) => {
    try {
      const userStr = await AsyncStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        user.balance = newBalance
        await AsyncStorage.setItem('user', JSON.stringify(user))
      }
    } catch (error) {
      console.error('Error updating balance:', error)
    }
  }

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    
    if (numericValue) {
      const formattedValue = parseInt(numericValue).toLocaleString('id-ID')
      setAmount(formattedValue)
    } else {
      setAmount('')
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarik Saldo</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={styles.card}>
          {/* Amount Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jumlah Penarikan</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.rupiah}>Rp</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <Text style={styles.helperText}>Minimal penarikan Rp 50.000</Text>
          </View>

          {/* Method Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metode Penarikan</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowMethodModal(true)}
            >
              <Text style={[styles.dropdownText, !method && styles.placeholderText]}>
                {method || 'Pilih metode penarikan'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Virtual Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nomor Virtual Account</Text>
            <TextInput
              style={styles.textInput}
              value={virtualAccount}
              onChangeText={text => setVirtualAccount(text.replace(/[^0-9]/g, ''))}
              placeholder="Masukkan nomor virtual account"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.helperText}>Minimal 10 digit</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!amount || !method.trim() || !virtualAccount.trim() || virtualAccount.length < 10 || loading || parseFloat(amount.replace(/[.,]/g, '')) < 50000) && styles.submitButtonDisabled
          ]}
          onPress={handleWithdraw}
          disabled={!amount || !method.trim() || !virtualAccount.trim() || virtualAccount.length < 10 || loading || parseFloat(amount.replace(/[.,]/g, '')) < 50000}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Tarik Saldo</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Method Selection Modal */}
      <Modal
        visible={showMethodModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMethodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Metode Penarikan</Text>
              <TouchableOpacity
                onPress={() => setShowMethodModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={bankMethods}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.methodItem,
                    method === item && styles.selectedMethodItem
                  ]}
                  onPress={() => {
                    setMethod(item)
                    setShowMethodModal(false)
                  }}
                >
                  <Text style={[
                    styles.methodItemText,
                    method === item && styles.selectedMethodItemText
                  ]}>
                    {item}
                  </Text>
                  {method === item && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#4CAF50'
  },
  backButton: {
    marginRight: 16
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 4
  },
  rupiah: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 12
  },
  dropdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
    flex: 1
  },
  placeholderText: {
    color: '#9CA3AF'
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827'
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF'
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  closeButton: {
    padding: 4
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  selectedMethodItem: {
    backgroundColor: '#F0F9FF'
  },
  methodItemText: {
    fontSize: 16,
    color: '#374151',
    flex: 1
  },
  selectedMethodItemText: {
    color: '#4CAF50',
    fontWeight: '500'
  }
});