import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CustomNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets() 
  const navItems = [
    { path: '/' as const, label: '🏠', title: 'Home' },
    { path: '/history' as const, label: '📋', title: 'Riwayat' },
    { path: '/waste-pickup' as const, label: '🗑️', title: 'Jual' },
    { path: '/profile' as const, label: '👤', title: 'Profile' }
  ]

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      marginBottom: insets.bottom + 12,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb'
    }}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.path}
          onPress={() => router.push(item.path)}
          style={{
            alignItems: 'center',
            opacity: pathname === item.path ? 1 : 0.5
          }}
        >
          <Text style={{ fontSize: 24 }}>{item.label}</Text>
          <Text style={{ fontSize: 12, marginTop: 4 }}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
