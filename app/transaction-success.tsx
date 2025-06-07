import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransactionSuccessScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const handleContinue = async () => {
    try {
      // Get the stored transaction ID
      const transactionId = await AsyncStorage.getItem('last_transaction_id');
      if (transactionId) {
        // Clear the stored ID since we don't need it anymore
        await AsyncStorage.removeItem('last_transaction_id');
        // Navigate to transaction details
        router.replace(`/transaction/${transactionId}`);
      } else {
        // Fallback to home if no transaction ID found
        router.replace('/');
      }
    } catch (error) {
      console.error('Error handling continue:', error);
      router.replace('/');
    }
  };

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
        source={require('../assets/images/transaction-success-icon.png')}
        style={styles.icon}
      />
      
      <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
        Transaksi Berhasil!
      </Text>
      
      <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>
        Permintaan penjemputan sampah Anda telah berhasil dibuat. Silakan tunggu picker untuk memverifikasi sampah Anda.
      </Text>
      
      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={handleContinue}
      >
        <Text style={[styles.continueButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
          Lihat Detail Transaksi
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
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#22C55E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
