import { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator
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
  const [loading, setLoading] = useState(false)

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Masukkan jumlah penarikan yang valid')
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
          amount: parseFloat(amount)
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
                // Update saldo di AsyncStorage
                updateUserBalance(data.data.saldo_tersisa)
                router.back()
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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

      {/* Form */}
      <View style={styles.content}>
        <Text style={styles.label}>Jumlah Penarikan</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencyPrefix}>Rp</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.withdrawButton,
            (!amount || loading) && styles.withdrawButtonDisabled
          ]}
          onPress={handleWithdraw}
          disabled={!amount || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.withdrawButtonText}>Tarik Saldo</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    padding: 24
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24
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
  withdrawButton: {
    backgroundColor: '#00A74F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  withdrawButtonDisabled: {
    backgroundColor: '#9CA3AF'
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
}) 