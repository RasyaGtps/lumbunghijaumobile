# LumbungHijau Mobile App

Aplikasi mobile untuk manajemen sampah yang memungkinkan pengguna untuk melakukan transaksi sampah dan berinteraksi dengan pengepul.

## Persyaratan Sistem

- Node.js (versi 16 atau lebih tinggi)
- npm atau yarn
- Expo CLI
- Android Studio (untuk pengembangan Android)
- Xcode (untuk pengembangan iOS, hanya di macOS)

## Teknologi Utama

- React Native (v0.79.3)
- Expo (v53.0.10)
- TypeScript
- NativeWind (Tailwind CSS untuk React Native)

## Instalasi

1. Clone repositori ini
2. Masuk ke direktori mobile:
```bash
cd mobile
```

3. Install dependencies:
```bash
# Menggunakan npm
npm install
npm install -g expo-cli
npx expo install

# ATAU menggunakan yarn
yarn install
yarn global add expo-cli
npx expo install

# Install dev dependencies secara terpisah jika diperlukan
npm install --save-dev @babel/core @types/react eslint eslint-config-expo typescript
# atau
yarn add --dev @babel/core @types/react eslint eslint-config-expo typescript
```

Pastikan semua dependencies terinstal dengan benar. Jika ada masalah, coba jalankan:
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json
# Install ulang semua dependencies
npm install
npx expo install
```

4. Install Expo CLI secara global (jika belum):
```bash
npm install -g expo-cli
```

## Dependencies Utama

### Core Dependencies
- `expo`: Framework untuk pengembangan React Native
- `react`: v19.0.0
- `react-native`: v0.79.3
- `expo-router`: Sistem routing untuk Expo
- `@react-navigation/native`: Navigasi dasar
- `@react-navigation/bottom-tabs`: Navigasi tab bawah

### UI & Styling
- `nativewind`: Tailwind CSS untuk React Native
- `tailwindcss`: Utility-first CSS framework
- `@expo-google-fonts/poppins`: Font Poppins
- `expo-blur`: Efek blur
- `expo-linear-gradient`: Efek gradient
- `lucide-react-native`: Icon pack

### Storage & State Management
- `@react-native-async-storage/async-storage`: Penyimpanan lokal

### Media & Images
- `expo-image`: Komponen image yang dioptimalkan
- `expo-image-picker`: Pemilih gambar

### System & UI Components
- `expo-status-bar`: Kontrol status bar
- `expo-splash-screen`: Splash screen kustom
- `expo-constants`: Konstanta sistem
- `expo-system-ui`: Integrasi UI sistem
- `react-native-safe-area-context`: Penanganan safe area
- `react-native-screens`: Optimasi navigasi native

### Development Dependencies
- `typescript`: Dukungan TypeScript
- `eslint`: Linting
- `@babel/core`: Babel compiler
- `@types/react`: Type definitions untuk React

## Menjalankan Aplikasi

1. Memulai server development:
```bash
npm start
# atau
yarn start
```

2. Menjalankan di Android:
```bash
npm run android
# atau
yarn android
```

3. Menjalankan di iOS:
```bash
npm run ios
# atau
yarn ios
```

4. Menjalankan di web:
```bash
npm run web
# atau
yarn web
```

## Scripts yang Tersedia

- `npm start`: Memulai server development Expo
- `npm run android`: Menjalankan aplikasi di Android
- `npm run ios`: Menjalankan aplikasi di iOS
- `npm run web`: Menjalankan aplikasi di web browser
- `npm run lint`: Menjalankan ESLint
- `npm run reset-project`: Mereset project (membersihkan cache)

## Struktur Folder

- `/app`: Berisi file routing dan halaman utama
- `/components`: Komponen React yang dapat digunakan kembali
- `/assets`: Gambar, font, dan aset lainnya
- `/types`: Type definitions TypeScript
- `/api`: Konfigurasi dan fungsi API
- `/contexts`: React Context untuk state management
- `/hooks`: Custom React hooks
- `/constants`: Konstanta dan konfigurasi

## Catatan Penting

1. Pastikan semua dependencies terinstal dengan benar sebelum menjalankan aplikasi
2. Untuk pengembangan iOS, Xcode diperlukan dan hanya tersedia di macOS
3. Untuk pengembangan Android, pastikan Android Studio dan Android SDK terinstal
4. Jika mengalami masalah, coba jalankan `npm run reset-project` untuk membersihkan cache

## Troubleshooting

Jika mengalami masalah saat instalasi atau menjalankan aplikasi:

1. Hapus folder `node_modules` dan file `package-lock.json`
2. Jalankan `npm install` kembali
3. Bersihkan cache Expo:
```bash
expo start -c
```
4. Pastikan semua environment variables sudah dikonfigurasi dengan benar
