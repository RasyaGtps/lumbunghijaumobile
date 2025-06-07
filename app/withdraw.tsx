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
  Platform
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

  // Format amount while typing to show thousands separator
  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '')
    
    if (numericValue) {
      // Convert to number and format with thousands separator
      const formattedValue = parseInt(numericValue).toLocaleString('id-ID')
      setAmount(formattedValue)
    } else {
      setAmount('')
    }
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarik Saldo</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount Input */}
        <Text style={styles.label}>Jumlah Penarikan</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencyPrefix}>Rp</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <Text style={styles.infoText}>Jumlah penarikan minimal: Rp 50.000</Text>

        {/* Method Input */}
        <Text style={styles.label}>Metode Penarikan</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={method}
            onChangeText={setMethod}
            placeholder="Contoh: BCA, GoPay, OVO, dll"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />
        </View>

        {/* Virtual Account Input */}
        <Text style={styles.label}>Nomor Virtual Account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={virtualAccount}
            onChangeText={text => setVirtualAccount(text.replace(/[^0-9]/g, ''))}
            placeholder="Masukkan nomor virtual account"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <Text style={styles.infoText}>Minimal 10 digit nomor virtual account</Text>

        <TouchableOpacity
          style={[
            styles.withdrawButton,
            (!amount || !method.trim() || !virtualAccount.trim() || virtualAccount.length < 10 || loading || parseFloat(amount.replace(/[.,]/g, '')) < 50000) && styles.withdrawButtonDisabled
          ]}
          onPress={handleWithdraw}
          disabled={!amount || !method.trim() || !virtualAccount.trim() || virtualAccount.length < 10 || loading || parseFloat(amount.replace(/[.,]/g, '')) < 50000}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.withdrawButtonText}>Tarik Saldo</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  content: {
    flex: 1,
    padding: 24
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB'
  },
  currencyPrefix: {
    fontSize: 16,
    color: '#111827',
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 24,
    fontStyle: 'italic'
  },
  withdrawButton: {
    backgroundColor: '#00A74F',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  withdrawButtonDisabled: {
    backgroundColor: '#9CA3AF'
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
}); 