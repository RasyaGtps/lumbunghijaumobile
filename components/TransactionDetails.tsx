import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins'
import { BASE_URL } from '../api/auth'

interface WasteItem {
  id: number
  waste_category_id: number
  waste_category: {
    name: string
    price_per_kg: number
    icon?: string
  }
  weight: number
  photo_path?: string
  notes?: string
}

interface TransactionDetailsProps {
  items: WasteItem[]
  status: string
  totalWeight: number
  estimatedEarnings: number
}

export default function TransactionDetails({ 
  items, 
  status, 
  totalWeight, 
  estimatedEarnings 
}: TransactionDetailsProps) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  })

  if (!fontsLoaded) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'menunggu verifikasi':
        return '#F59E0B'
      case 'diproses':
        return '#3B82F6'
      case 'selesai':
        return '#10B981'
      case 'dibatalkan':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Ionicons name="scale-outline" size={24} color="#00A74F" />
          <View>
            <Text style={styles.summaryLabel}>Total Berat</Text>
            <Text style={styles.summaryValue}>{totalWeight.toFixed(2)} kg</Text>
          </View>
        </View>

        <View style={styles.summaryItem}>
          <Ionicons name="cash-outline" size={24} color="#00A74F" />
          <View>
            <Text style={styles.summaryLabel}>Estimasi Pendapatan</Text>
            <Text style={styles.summaryValue}>
              Rp {estimatedEarnings.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Detail Sampah</Text>

      {items.map((item, index) => (
        <View key={item.id} style={styles.wasteItem}>
          <View style={styles.wasteHeader}>
            <View style={styles.wasteInfo}>
              {item.waste_category.icon ? (
                <Image 
                  source={{ uri: `${BASE_URL}${item.waste_category.icon}` }}
                  style={styles.categoryIcon}
                />
              ) : (
                <Ionicons name="leaf-outline" size={24} color="#00A74F" />
              )}
              <View>
                <Text style={styles.wasteName}>{item.waste_category.name}</Text>
                <Text style={styles.wastePrice}>
                  Rp {item.waste_category.price_per_kg.toLocaleString('id-ID')}/kg
                </Text>
              </View>
            </View>
            <Text style={styles.wasteWeight}>{item.weight.toFixed(2)} kg</Text>
          </View>

          {item.photo_path && (
            <Image
              source={{ uri: `${BASE_URL}${item.photo_path}` }}
              style={styles.wastePhoto}
              resizeMode="cover"
            />
          )}

          {item.notes && (
            <View style={styles.notesContainer}>
              <Ionicons name="document-text-outline" size={16} color="#6B7280" />
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}

          {index !== items.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#fff',
  },
  summaryContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  summaryValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  wasteItem: {
    marginBottom: 16,
  },
  wasteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wasteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  wasteName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#111827',
  },
  wastePrice: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#00A74F',
  },
  wasteWeight: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#111827',
  },
  wastePhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  notesText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
}); 