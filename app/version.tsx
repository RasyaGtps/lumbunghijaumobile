import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts,
} from '@expo-google-fonts/poppins'

const APP_VERSION = '1.0.0'

export default function Version() {
  const router = useRouter()
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Versi Aplikasi</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Lumbung Hijau</Text>
          <Text style={styles.version}>Versi {APP_VERSION}</Text>
          <Text style={styles.tagline}>Solusi Pengelolaan Sampah Digital</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
          <Text style={styles.description}>
            Lumbung Hijau adalah aplikasi yang membantu Anda mengubah sampah menjadi uang. 
            Dengan sistem pengelolaan sampah digital, Anda dapat dengan mudah memilah sampah, 
            mendapatkan penjemputan, dan menukarkan sampah Anda menjadi uang tunai yang langsung 
            masuk ke rekening bank Anda.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Fitur Utama</Text>
          <View style={styles.featureItem}>
            <Ionicons name="leaf-outline" size={24} color="#00A74F" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Pemilahan Sampah</Text>
              <Text style={styles.featureDescription}>Panduan lengkap pemilahan sampah organik dan anorganik</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cash-outline" size={24} color="#00A74F" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Konversi ke Uang</Text>
              <Text style={styles.featureDescription}>Tukarkan sampahmu menjadi uang tunai langsung ke rekeningmu</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="location-outline" size={24} color="#00A74F" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Penjemputan</Text>
              <Text style={styles.featureDescription}>Layanan penjemputan sampah langsung ke lokasi Anda</Text>
            </View>
          </View>
        </View>

        <View style={styles.copyrightSection}>
          <Text style={styles.copyright}>© 2025 Lumbung Hijau</Text>
          <Text style={styles.copyright}>All rights reserved</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#00A74F',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#4b5563',
    lineHeight: 22,
  },
  featuresSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
  },
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  copyright: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#9ca3af',
  },
}); 