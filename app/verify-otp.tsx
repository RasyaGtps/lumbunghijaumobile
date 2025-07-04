import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { resendOTP, sendOTP, verifyOTP } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Menggunakan array untuk OTP per digit
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [remainingResend, setRemainingResend] = useState<number>(3);
  // Ref untuk mengelola fokus antar input OTP
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Memuat font Poppins
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // Efek untuk inisialisasi OTP saat komponen dimuat
  useEffect(() => {
    const initOTP = async (): Promise<void> => {
      const storedToken = await AsyncStorage.getItem('token');
      const needResend = await AsyncStorage.getItem('need_resend_otp');

      if (storedToken) {
        setToken(storedToken);
        try {
          // Jika 'need_resend_otp' true, langsung kirim ulang OTP
          if (needResend === 'true') {
            console.log('Perlu kirim ulang OTP...');
            const response = await resendOTP(storedToken);
            // Hapus flag setelah pengiriman ulang berhasil
            await AsyncStorage.removeItem('need_resend_otp');
            setCountdown(30);
            if (response.remaining_resend) {
              setRemainingResend(response.remaining_resend);
            }
          } else {
            // Jika tidak, kirim OTP pertama kali
            const response = await sendOTP(storedToken);
            setCountdown(30);
            if (response.remaining_resend) {
              setRemainingResend(response.remaining_resend);
            }
          }
        } catch (error) {
          console.error('Error saat inisialisasi OTP:', error);
          Alert.alert('Error', 'Gagal mengirim OTP. Silakan coba lagi.');
        }
      } else {
        // Jika tidak ada token, arahkan kembali ke halaman login
        router.replace('/login');
      }
    };

    initOTP();
  }, []); // [] agar hanya berjalan sekali saat mount

  // Efek untuk mengelola countdown pengiriman ulang OTP
  useEffect(() => {
    let timer: number | undefined; // Tipe `number` untuk ID timer di React Native
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev: number) => prev - 1);
      }, 1000);
    }
    // Membersihkan timer saat komponen unmount atau countdown selesai
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]); // Berjalan setiap kali countdown berubah

  // Menangani perubahan teks pada input OTP (per digit)
  const handleOtpChange = (value: string, index: number): void => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Otomatis fokus ke input berikutnya jika ada nilai
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Menangani penekanan tombol keyboard (khusus backspace untuk menghapus)
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number): void => {
    // Jika tombol backspace ditekan dan input saat ini kosong, pindah fokus ke input sebelumnya
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Menangani proses verifikasi OTP
  const handleVerify = async (): Promise<void> => {
    const otpString = otp.join(''); // Gabungkan array OTP menjadi string
    if (otpString.length !== 6) {
      Alert.alert('Error', 'OTP harus 6 digit');
      return;
    }

    setLoading(true); // Mulai loading
    try {
      console.log('Mengirim OTP untuk verifikasi:', otpString);
      const response = await verifyOTP(token, otpString);
      console.log('Response verifikasi OTP:', response);

      if (response.message === 'Email berhasil diverifikasi') {
        console.log('Verifikasi OTP berhasil');
        
        // Update user data di AsyncStorage dengan email_verified = true
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.email_verified = true;
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        }
        
        Alert.alert(
          'Sukses',
          'Email berhasil diverifikasi',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Mengarahkan ke halaman sukses');
                // Arahkan ke halaman sukses, ganti stack navigasi
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
    setLoading(false); // Selesai loading
  };

  // Menangani proses pengiriman ulang OTP
  const handleResend = async (): Promise<void> => {
    // Jangan izinkan resend jika countdown masih berjalan atau sisa pengiriman habis
    if (countdown > 0 || remainingResend <= 0) return;

    try {
      console.log('Meminta pengiriman ulang OTP');
      const response = await resendOTP(token);
      console.log('Response resend OTP:', response);

      setCountdown(30); // Mulai countdown baru
      if (response.remaining_resend !== undefined) {
        setRemainingResend(response.remaining_resend);
      }

      Alert.alert('Sukses', 'OTP baru telah dikirim ke email Anda');
    } catch (error) {
      console.error('Error saat resend:', error);
      Alert.alert('Error', 'Gagal mengirim ulang OTP');
    }
  };

  // Tampilkan loading indicator jika font belum dimuat
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Render UI utama halaman verifikasi OTP
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Section */}
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

      {/* Main Content Area */}
      <View style={styles.content}>
        <View style={styles.card}>
          {/* Icon Section */}
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

          {/* OTP Input Fields */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                // Pastikan ref callback tidak mengembalikan nilai
                ref={(ref: TextInput | null) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  { fontFamily: 'Poppins_600SemiBold' },
                  // Memberi gaya berbeda jika input sudah terisi
                  digit && styles.otpInputFilled
                ]}
                value={digit}
                onChangeText={(value: string) => handleOtpChange(value, index)}
                onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1} // Hanya satu digit per input
                textAlign="center"
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              // Menonaktifkan tombol saat loading
              loading && styles.disabledButton
            ]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              // Tampilkan ActivityIndicator saat loading
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              // Tampilkan teks tombol saat tidak loading
              <Text style={[styles.verifyButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
                Verifikasi
              </Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP Section */}
          <View style={styles.resendContainer}>
            <Text style={[styles.resendLabel, { fontFamily: 'Poppins_400Regular' }]}>
              Tidak menerima kode?
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              // Menonaktifkan tombol resend jika countdown berjalan atau sisa pengiriman habis
              disabled={countdown > 0 || remainingResend <= 0}
              style={styles.resendButton}
            >
              <Text
                style={[
                  styles.resendText,
                  { fontFamily: 'Poppins_600SemiBold' },
                  // Gaya teks yang berbeda jika tombol dinonaktifkan
                  (countdown > 0 || remainingResend <= 0) && styles.disabledText
                ]}
              >
                Kirim Ulang
                {/* Tampilkan countdown jika lebih dari 0 */}
                {countdown > 0 ? ` (${countdown}s)` : ''}
              </Text>
            </TouchableOpacity>
            {/* Tampilkan sisa pengiriman jika ada dan countdown sudah 0 */}
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

// Stylesheet untuk komponen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50', // Background hijau untuk layar
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
    backgroundColor: '#F8FAFC', // Background konten putih
    borderTopLeftRadius: 24, // Sudut melengkung di atas
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000', // Bayangan untuk efek kedalaman
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
    backgroundColor: '#F0F9FF', // Warna latar belakang lingkaran ikon
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
    borderColor: '#4CAF50', // Border hijau saat terisi
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
    opacity: 0.7, // Efek buram saat tombol dinonaktifkan
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