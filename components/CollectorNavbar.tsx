import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { memo } from 'react'
import { Ionicons } from '@expo/vector-icons'

type NavPath = '/collector' | '/collector/verify' | '/collector/history' | '/collector/profile'

const CollectorNavbar = memo(() => {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()

  const navItems = [
    { path: '/collector' as const, label: 'home', title: 'Home' },
    { path: '/collector/verify' as const, label: 'verify', title: 'Verifikasi' },
    { path: '/collector/history' as const, label: 'history', title: 'Riwayat' },
    { path: '/collector/profile' as const, label: 'profile', title: 'Profil' }
  ]

  const getIcon = (label: string) => {
    switch (label) {
      case 'home':
        return <Ionicons name="home-outline" size={24} color={pathname === '/collector' ? '#10b981' : '#6b7280'} />
      case 'verify':
        return <Ionicons name="checkmark-circle-outline" size={24} color={pathname === '/collector/verify' ? '#10b981' : '#6b7280'} />
      case 'history':
        return <Ionicons name="document-text-outline" size={24} color={pathname === '/collector/history' ? '#10b981' : '#6b7280'} />
      case 'profile':
        return <Ionicons name="person-outline" size={24} color={pathname === '/collector/profile' ? '#10b981' : '#6b7280'} />
      default:
        return <Ionicons name="apps-outline" size={24} color="#6b7280" />
    }
  }

  const handlePress = (path: NavPath) => {
    if (pathname !== path) {
      router.replace(path)
    }
  }

  return (
    <View style={{
      position: 'absolute',
      bottom: insets.bottom + 16,
      left: 16,
      right: 16,
      backgroundColor: 'white',
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
      }}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            onPress={() => handlePress(item.path)}
            style={{
              alignItems: 'center',
              opacity: pathname === item.path ? 1 : 0.5
            }}
          >
            {getIcon(item.label)}
            <Text style={{ 
              fontSize: 12, 
              marginTop: 4,
              color: pathname === item.path ? '#10b981' : '#6b7280',
              fontWeight: pathname === item.path ? '600' : '400'
            }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
})

CollectorNavbar.displayName = 'CollectorNavbar'

export default CollectorNavbar 