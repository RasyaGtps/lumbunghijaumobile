import { ScrollView, Text, View } from 'react-native'
import CollectorNavbar from '../../components/CollectorNavbar'

export default function CollectorPickup() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ 
          paddingTop: 60, 
          paddingHorizontal: 20, 
          paddingBottom: 20,
          backgroundColor: '#fff'
        }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold',
            color: '#111827'
          }}>
            Pickup Baru
          </Text>
        </View>

        {/* Content akan ditambahkan di sini */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#6b7280' }}>Belum ada permintaan pickup baru</Text>
        </View>
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
} 