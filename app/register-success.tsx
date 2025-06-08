import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterSuccessScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/success-icon.png')} // Pastikan path sesuai dengan folder kamu
        style={styles.icon}
      />
      
      <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
        Email Berhasil Diverifikasi
      </Text>
      
      <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>
        Selamat! Akun Anda telah aktif.{'\n'}Ayo kita mulai kurangi limbah makanan!
      </Text>
      
      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={() => router.replace('/login')}
      >
        <Text style={[styles.continueButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
          Selesai
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 64,
    textAlign: 'center',
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    width: '100%',
    maxWidth: 320,
    borderRadius: 12,
    shadowColor: '#22C55E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
});
