import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { resendOTP, sendOTP, verifyOTP } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [remainingResend, setRemainingResend] = useState<number>(3);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const initOTP = async (): Promise<void> => {
      const storedToken = await AsyncStorage.getItem('token');
      const needResend = await AsyncStorage.getItem('need_resend_otp');
      
      if (storedToken) {
        setToken(storedToken);
        try {
          // Jika need_resend_otp true, langsung kirim ulang OTP
          if (needResend === 'true') {
            console.log('Perlu kirim ulang OTP...');
            const response = await resendOTP(storedToken);
            await AsyncStorage.removeItem('need_resend_otp');
            setCountdown(30);
            if (response.remaining_resend) {
              setRemainingResend(response.remaining_resend);
            }
          } else {
            const response = await sendOTP(storedToken);
            setCountdown(30);
            if (response.remaining_resend) {
              setRemainingResend(response.remaining_resend);
            }
          }
        } catch (error) {
          console.error('Error saat inisialisasi OTP:', error);
          Alert.alert('Error', 'Gagal mengirim OTP');
        }
      }
    };

    initOTP();
  }, []);

useEffect(() => {
    let timer: number | undefined; // Ubah tipe dari NodeJS.Timeout menjadi number
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev: number) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);

  const handleOtpChange = (value: string, index: number): void => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number): void => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (): Promise<void> => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'OTP harus 6 digit');
      return;
    }

    setLoading(true);
    try {
      console.log('Mengirim OTP untuk verifikasi:', otpString);
      const response = await verifyOTP(token, otpString);
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

  const handleResend = async (): Promise<void> => {
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
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: 'Poppins_600SemiBold' }]}>
          Verification code
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail" size={32} color="#4CAF50" />
            </View>
          </View>

          {/* Title & Subtitle */}
          <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
            Verifikasi Email
          </Text>
          
          <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>
            Masukkan kode 6 digit yang telah dikirim ke email Anda
          </Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref: TextInput | null) => { // Tambahkan kurung kurawal di sini
                  inputRefs.current[index] = ref;
                }} // Tutup kurung kurawal di sini
                style={[
                  styles.otpInput,
                  { fontFamily: 'Poppins_600SemiBold' },
                  digit && styles.otpInputFilled
                ]}
                value={digit}
                onChangeText={(value: string) => handleOtpChange(value, index)}
                onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            style={[
              styles.verifyButton,
              loading && styles.disabledButton
            ]} 
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={[styles.verifyButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
                Verifikasi
              </Text>
            )}
          </TouchableOpacity>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={[styles.resendLabel, { fontFamily: 'Poppins_400Regular' }]}>
              Tidak menerima kode?
            </Text>
            <TouchableOpacity 
              onPress={handleResend}
              disabled={countdown > 0 || remainingResend <= 0}
              style={styles.resendButton}
            >
              <Text 
                style={[
                  styles.resendText,
                  { fontFamily: 'Poppins_600SemiBold' },
                  (countdown > 0 || remainingResend <= 0) && styles.disabledText
                ]}
              >
                Kirim Ulang
                {countdown > 0 ? ` (${countdown}s)` : ''}
              </Text>
            </TouchableOpacity>
            {remainingResend > 0 && countdown === 0 && (
              <Text style={[styles.remainingText, { fontFamily: 'Poppins_400Regular' }]}>
                Tersisa {remainingResend}x pengiriman
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8F5E8',
  },
  title: {
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    width: '100%',
    maxWidth: 280,
  },
  otpInput: {
    width: 44,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 20,
    color: '#111827',
  },
  otpInputFilled: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0F9FF',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    width: '100%',
    maxWidth: 280,
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 24,
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
    alignItems: 'center',
  },
  resendLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  remainingText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});