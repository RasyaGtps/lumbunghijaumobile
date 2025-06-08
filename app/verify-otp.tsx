import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { resendOTP, sendOTP, verifyOTP } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [remainingResend, setRemainingResend] = useState(3);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const initOTP = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await sendOTP(storedToken);
          setCountdown(30);
          if (response.remaining_resend) {
            setRemainingResend(response.remaining_resend);
          }
        } catch (error) {
          Alert.alert('Error', 'Gagal mengirim OTP');
        }
      }
    };

    initOTP();
  }, []);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP harus 6 digit');
      return;
    }

    setLoading(true);
    try {
      console.log('Mengirim OTP untuk verifikasi:', otp);
      const response = await verifyOTP(token, otp);
      console.log('Response verifikasi OTP:', response);

      if (response.message === 'Email berhasil diverifikasi') {
        console.log('Verifikasi OTP berhasil');
        Alert.alert(
          'Sukses',
          'Email berhasil diverifikasi',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Mengarahkan ke halaman sukses');
                router.replace('/register-success');
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        console.log('Verifikasi OTP gagal:', response.message);
        Alert.alert('Error', response.message || 'Kode OTP tidak valid');
      }
    } catch (error) {
      console.error('Error saat verifikasi:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat verifikasi');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (countdown > 0 || remainingResend <= 0) return;

    try {
      console.log('Meminta pengiriman ulang OTP');
      const response = await resendOTP(token);
      console.log('Response resend OTP:', response);
      
      setCountdown(30);
      if (response.remaining_resend !== undefined) {
        setRemainingResend(response.remaining_resend);
      }
      
      Alert.alert('Sukses', 'OTP baru telah dikirim ke email Anda');
    } catch (error) {
      console.error('Error saat resend:', error);
      Alert.alert('Error', 'Gagal mengirim ulang OTP');
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
      <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
        Verifikasi Email
      </Text>
      
      <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>
        Masukkan kode OTP yang telah dikirim ke email Anda
      </Text>

      <TextInput
        style={[styles.otpInput, { fontFamily: 'Poppins_400Regular' }]}
        placeholder="Masukkan 6 digit kode OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity 
        style={[
          styles.verifyButton,
          loading && styles.disabledButton
        ]} 
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={[styles.verifyButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
            Verifikasi
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <TouchableOpacity 
          onPress={handleResend}
          disabled={countdown > 0 || remainingResend <= 0}
        >
          <Text 
            style={[
              styles.resendText,
              { fontFamily: 'Poppins_400Regular' },
              (countdown > 0 || remainingResend <= 0) && styles.disabledText
            ]}
          >
            Kirim Ulang OTP
            {countdown > 0 ? ` (${countdown}s)` : ''}
            {remainingResend > 0 ? ` (${remainingResend}x)` : ''}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  otpInput: {
    width: '100%',
    maxWidth: 320,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  verifyButton: {
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
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  resendContainer: {
    marginTop: 24,
  },
  resendText: {
    color: '#22C55E',
    fontSize: 14,
    textAlign: 'center',
  },
  disabledText: {
    color: '#9CA3AF',
  },
}); 