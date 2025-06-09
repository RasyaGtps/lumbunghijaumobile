# Lumbung Hijau - Mobile App

Aplikasi mobile Lumbung Hijau menggunakan React Native dengan Expo.

## Struktur Folder

```
mobile/
├── app/                    # Halaman-halaman aplikasi
│   ├── auth/              # Halaman autentikasi
│   ├── collector/         # Halaman khusus collector
│   ├── transaction/       # Halaman detail transaksi
│   ├── _layout.tsx        # Layout utama & routing
│   ├── index.tsx          # Halaman utama
│   ├── login.tsx          # Halaman login
│   ├── register.tsx       # Halaman register
│   ├── profile.tsx        # Halaman profile
│   ├── cart.tsx           # Halaman keranjang
│   ├── pesanan.tsx        # Halaman pesanan/transaksi
│   └── withdraw.tsx       # Halaman penarikan saldo
│
├── components/            # Komponen yang bisa digunakan ulang
│   ├── ui/               # Komponen UI dasar
│   ├── CustomNavbar.tsx  # Navbar untuk user
│   ├── CollectorNavbar   # Navbar untuk collector
│   └── TransactionDetails.tsx # Komponen detail transaksi
│
├── api/                  # Fungsi-fungsi untuk memanggil API
├── types/               # Type definitions
├── contexts/            # React contexts
├── hooks/              # Custom hooks
└── assets/             # Gambar, font, dll
```

## Fitur Aplikasi

### User Biasa
1. Autentikasi
   - Register
   - Login
   - Verifikasi OTP
   - Logout

2. Profile
   - Lihat profile
   - Edit profile
   - Update foto profile

3. Jual Sampah
   - Lihat kategori sampah
   - Tambah ke keranjang
   - Checkout
   - Lihat status transaksi
   - Lihat riwayat transaksi

4. Penarikan Saldo
   - Request penarikan
   - Lihat status penarikan
   - Lihat riwayat penarikan

### Collector
1. Verifikasi Transaksi
   - Lihat daftar transaksi pending
   - Verifikasi berat sampah
   - Submit verifikasi
   - Lihat riwayat verifikasi

2. Profile Collector
   - Lihat profile
   - Edit profile
   - Logout

## Teknologi

- React Native
- Expo
- NativeWind (Tailwind untuk React Native)
- React Navigation
- Async Storage
- React Native Reanimated
- Expo Image Picker
- Expo Location

## Dependencies

```json
{
  "dependencies": {
    "@expo/vector-icons": "^13.0.0",
    "@react-native-async-storage/async-storage": "^1.18.2",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/native-stack": "^6.9.13",
    "axios": "^1.4.0",
    "expo": "~49.0.8",
    "expo-image-picker": "~14.3.2",
    "expo-location": "~16.1.0",
    "expo-status-bar": "~1.6.0",
    "nativewind": "^2.0.11",
    "react": "18.2.0",
    "react-native": "0.72.4",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-maps": "1.7.1",
    "react-native-reanimated": "~3.3.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.0",
    "tailwindcss": "^3.3.2",
    "zustand": "^4.4.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14",
    "typescript": "^5.1.3"
  }
}
```

## Setup Development

1. Install dependencies:
```bash
npm install
```

2. Setup environment:
- Sesuaikan `API_URL` dan `BASE_URL`

3. Jalankan aplikasi:
```bash
npx expo start
```

4. Build APK:
```bash
eas build -p android --profile preview
```

## Struktur Navigasi

1. Public Routes (tanpa login):
   - Login
   - Register
   - Verify OTP

2. User Routes:
   - Home
   - Cart
   - Profile
   - Pesanan
   - Withdraw

3. Collector Routes:
   - Home (Daftar Transaksi)
   - Verifikasi
   - Profile
   - Riwayat

## State Management

1. Authentication
   - Token disimpan di AsyncStorage
   - User data di context

2. Cart
   - Item cart di context
   - Sync dengan backend

## Error Handling

1. API Errors
   - Error message ditampilkan dengan Alert
   - Auto logout jika token expired

2. Form Validation
   - Client-side validation
   - Server-side validation message

3. Network
   - Retry mechanism
   - Offline indicator
