import { ScrollView, Text, View } from 'react-native'
import CollectorNavbar from '../../components/CollectorNavbar'

export default function CollectorHistory() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Content akan ditambahkan di sini */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#6b7280' }}>Belum ada riwayat pickup</Text>
        </View>
      </ScrollView>

      <CollectorNavbar />
    </View>
  )
} 