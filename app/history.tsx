import { View, Text } from 'react-native'
import CustomNavbar from '../components/CustomNavbar'

export default function History() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Riwayat</Text>
      </View>
      <CustomNavbar />
    </View>
  )
} 