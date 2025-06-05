import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { RegisterInput, registerUser } from '../api/auth'; // sesuaikan path

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterInput>({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A529F" />
      </View>
    );
  }

  const handleRegister = async () => {
    if (Object.values(formData).some(value => !value)) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Email tidak valid');
      return;
    }

    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      Alert.alert('Error', 'Nomor telepon tidak valid (minimal 10 digit)');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      Alert.alert('Error', 'Kata sandi dan konfirmasi kata sandi tidak cocok');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Harap menyetujui syarat dan ketentuan');
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(formData);
      if (response.status) {
        Alert.alert('Sukses', 'Registrasi berhasil, silahkan login', [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.content}>
          {/* Header dengan tombol back */}
          <View style={styles.headerBackContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007D1B" />
            </TouchableOpacity>
          </View>

          {/* Judul dan Subjudul */}
          <View style={styles.header}>
              <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>Buat Akun</Text>
              <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>Bergabunglah bersama Lumbung hijau</Text>
              <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>Lumbung hijau</Text>
          </View>

          {/* Form Input */}
          <View style={styles.form}>
            {/* Nama */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>Nama Lengkap</Text>
              <TextInput
                placeholder="Nama Lengkap Anda"
                value={formData.name}
                onChangeText={value => handleChange('name', value)}
                style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            {/* Telepon */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>Nomor Telepon</Text>
              <View style={styles.phoneContainer}>
                <Text style={[styles.countryCode, { fontFamily: 'Poppins_600SemiBold' }]}>+62</Text>
                <TextInput
                  placeholder="81234567890"
                  value={formData.phone_number}
                  onChangeText={value => handleChange('phone_number', value)}
                  style={[styles.phoneInput, { fontFamily: 'Poppins_400Regular' }]}
                  keyboardType="phone-pad"
                  maxLength={13}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>Email</Text>
              <TextInput
                placeholder="user@example.com"
                value={formData.email}
                onChangeText={value => handleChange('email', value)}
                style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>Kata Sandi</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={value => handleChange('password', value)}
                  secureTextEntry={!showPassword}
                  style={[styles.passwordInput, { fontFamily: 'Poppins_400Regular' }]}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Konfirmasi Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>Konfirmasi Kata Sandi</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChangeText={value => handleChange('password_confirmation', value)}
                  secureTextEntry={!showPassword}
                  style={[styles.passwordInput, { fontFamily: 'Poppins_400Regular' }]}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Checkbox Syarat */}
            <View style={styles.termsContainer}>
              <TouchableOpacity onPress={() => setAgreeToTerms(!agreeToTerms)} style={styles.checkboxContainer} disabled={loading}>
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
                <Text style={[styles.termsText, { fontFamily: 'Poppins_400Regular' }]}>
                  Menyetujui <Text style={[styles.termsLink, { fontFamily: 'Poppins_600SemiBold' }]}>Syarat dan Ketentuan</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tombol Daftar */}
            <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.registerButtonWrapper}>
              <LinearGradient
                colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#2E9E4D', '#78C885']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.registerButton}
              >
                <Text style={[styles.registerButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
                  {loading ? 'Loading...' : 'Selesai'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContentContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  content: { flex: 1, paddingTop: 48 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerBackContainer: { marginBottom: 24 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  header: { marginBottom: 32 },
  title: {fontSize:26, textAlign: 'center'},
  subtitle: { fontSize: 12, color: '#999999', textAlign: 'center' },
  highlight: { fontWeight: '600' },

  form: {},

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#111827', marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 3,
  },

  countryCode: { fontSize: 16, color: '#111827', marginRight: 8 },

  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 3,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },

  eyeIcon: {
    marginLeft: 12,
  },

  termsContainer: {
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007D1B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  checkboxChecked: {
    backgroundColor: '#007D1B',
  },

  termsText: {
    fontSize: 14,
    color: '#6B7280',
  },

  termsLink: {
    color: '#007D1B',
  },

  registerButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  registerButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
