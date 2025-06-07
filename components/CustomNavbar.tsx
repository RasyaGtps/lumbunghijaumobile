import { usePathname, useRouter } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CustomNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()

  const navItems = [
    { path: '/' as const, label: 'home', title: 'Home' },
    { path: '/pesanan' as const, label: 'pesanan', title: 'Pesanan' },
    { path: '/waste-categories' as const, label: 'mulai', title: 'Jual' },
    { path: '/cart' as const, label: 'keranjang', title: 'Keranjang' },
    { path: '/profile' as const, label: 'profil', title: 'Profil' }
  ]

  const getIcon = (label: string) => {
    switch (label) {
      case 'home':
        return require('../assets/images/icon/home-icon.png')
      case 'pesanan':
        return require('../assets/images/icon/pesanan-icon.png')
      case 'mulai':
        return require('../assets/images/icon/jual-icon.png')
      case 'keranjang':
        return require('../assets/images/icon/keranjang-icon.png')
      case 'profil':
        return require('../assets/images/icon/profile-icon.png')
      default:
        return require('../assets/images/icon/handphone.png')
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
      shadowOffset: { width: 0, height: 2 },
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
            onPress={() => router.push(item.path)}
            style={{
              alignItems: 'center',
              opacity: pathname === item.path ? 1 : 0.5
            }}
          >
            <Image
              source={getIcon(item.label)}
              style={{
                width: 24,
                height: 24,
                marginBottom: 4,
                tintColor: pathname === item.path ? '#10b981' : '#6b7280'
              }}
              resizeMode="contain"
            />
            <Text style={{
              fontSize: 12,
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
}
