import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
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
  
  // Focus states
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
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
        router.replace('/register-success');
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

  const isFormValid = Object.values(formData).every(value => value.length > 0) && agreeToTerms;

  const renderInputField = (
    field: keyof RegisterInput,
    placeholder: string,
    label: string,
    icon: string,
    keyboardType: any = 'default',
    isPassword: boolean = false
  ) => {
    const isFocused = focusedField === field;
    const hasValue = formData[field].length > 0;
    
    return (
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>{label}</Text>
        <View style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          hasValue && styles.inputContainerFilled
        ]}>
          <LinearGradient
            colors={isFocused ? ['#E8F5E8', '#F1F8E9'] : ['#FAFAFA', '#FAFAFA']}
            style={styles.inputGradient}
          >
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={isFocused ? '#4CAF50' : '#9E9E9E'} 
              style={styles.inputIcon} 
            />
            <TextInput
              placeholder={placeholder}
              value={formData[field]}
              onChangeText={value => handleChange(field, value)}
              onFocus={() => setFocusedField(field)}
              onBlur={() => setFocusedField(null)}
              style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
              keyboardType={keyboardType}
              autoCapitalize={field === 'name' ? 'words' : 'none'}
              secureTextEntry={isPassword && !showPassword}
              editable={!loading}
              placeholderTextColor="#9E9E9E"
              maxLength={field === 'phone_number' ? 13 : undefined}
            />
            {hasValue && !isPassword && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
            {isPassword && (
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)} 
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={isFocused ? '#4CAF50' : '#9E9E9E'} 
                />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern} />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContentContainer}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Header dengan tombol back */}
            <View style={styles.headerBackContainer}>
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#E8F5E8', '#F1F8E9']}
                  style={styles.backButtonGradient}
                >
                  <Ionicons name="arrow-back" size={24} color="#4CAF50" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Header Card */}
            <View style={styles.headerCard}>
              <View style={styles.logoSection}>
                <LinearGradient
                  colors={['#66BB6A', '#4CAF50']}
                  style={styles.logoContainer}
                >
                  <Ionicons name="person-add" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
              
              <View style={styles.header}>
                <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
                  Buat Akun Baru
                </Text>
                <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>
                  Bergabunglah bersama Lumbung Hijau
                </Text>
                <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>
                  untuk masa depan yang lebih hijau 🌱
                </Text>
              </View>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.form}>
                {/* Nama */}
                {renderInputField('name', 'Nama Lengkap Anda', 'Nama Lengkap', 'person-outline')}

                {/* Telepon */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>Nomor Telepon</Text>
                  <View style={[
                    styles.phoneContainer,
                    focusedField === 'phone_number' && styles.inputContainerFocused,
                    formData.phone_number.length > 0 && styles.inputContainerFilled
                  ]}>
                    <LinearGradient
                      colors={focusedField === 'phone_number' ? ['#E8F5E8', '#F1F8E9'] : ['#FAFAFA', '#FAFAFA']}
                      style={styles.phoneGradient}
                    >
                      <Ionicons 
                        name="call-outline" 
                        size={20} 
                        color={focusedField === 'phone_number' ? '#4CAF50' : '#9E9E9E'} 
                        style={styles.inputIcon} 
                      />
                      <View style={styles.countryCodeContainer}>
                        <Text style={[styles.countryCode, { fontFamily: 'Poppins_600SemiBold' }]}>+62</Text>
                      </View>
                      <TextInput
                        placeholder="81234567890"
                        value={formData.phone_number}
                        onChangeText={value => handleChange('phone_number', value)}
                        onFocus={() => setFocusedField('phone_number')}
                        onBlur={() => setFocusedField(null)}
                        style={[styles.phoneInput, { fontFamily: 'Poppins_400Regular' }]}
                        keyboardType="phone-pad"
                        maxLength={13}
                        editable={!loading}
                        placeholderTextColor="#9E9E9E"
                      />
                      {formData.phone_number.length > 0 && (
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      )}
                    </LinearGradient>
                  </View>
                </View>

                {/* Email */}
                {renderInputField('email', 'user@example.com', 'Email', 'mail-outline', 'email-address')}

                {/* Password */}
                {renderInputField('password', '••••••••', 'Kata Sandi', 'lock-closed-outline', 'default', true)}

                {/* Konfirmasi Password */}
                {renderInputField('password_confirmation', '••••••••', 'Konfirmasi Kata Sandi', 'lock-closed-outline', 'default', true)}

                {/* Checkbox Syarat */}
                <View style={styles.termsSection}>
                  <TouchableOpacity 
                    onPress={() => setAgreeToTerms(!agreeToTerms)} 
                    style={styles.checkboxContainer} 
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                      {agreeToTerms && (
                        <LinearGradient
                          colors={['#4CAF50', '#388E3C']}
                          style={styles.checkboxGradient}
                        >
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </LinearGradient>
                      )}
                    </View>
                    <Text style={[styles.termsText, { fontFamily: 'Poppins_400Regular' }]}>
                      Saya menyetujui{' '}
                      <Text style={[styles.termsLink, { fontFamily: 'Poppins_600SemiBold' }]}>
                        Syarat dan Ketentuan
                      </Text>
                      {'\n'}yang berlaku
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Tombol Daftar */}
                <TouchableOpacity 
                  onPress={handleRegister} 
                  disabled={loading || !isFormValid} 
                  style={[
                    styles.registerButtonWrapper,
                    (!isFormValid || loading) && styles.registerButtonDisabled
                  ]}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isFormValid && !loading ? 
                      ['#66BB6A', '#4CAF50', '#388E3C'] : 
                      ['#E0E0E0', '#BDBDBD']
                    }
                    style={styles.registerButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Text style={[
                          styles.registerButtonText, 
                          { fontFamily: 'Poppins_600SemiBold' },
                          isFormValid && !loading && styles.registerButtonTextActive
                        ]}>
                          Selesai
                        </Text>
                        <Ionicons 
                          name="checkmark-circle" 
                          size={20} 
                          color={isFormValid && !loading ? "#FFFFFF" : "#757575"} 
                          style={styles.buttonIcon}
                        />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <TouchableOpacity 
                onPress={() => router.push('/login')} 
                style={styles.loginLink}
                activeOpacity={0.7}
              >
                <Text style={[styles.loginText, { fontFamily: 'Poppins_400Regular' }]}>
                  Sudah punya akun?{' '}
                  <Text style={[styles.loginTextBold, { fontFamily: 'Poppins_600SemiBold' }]}>
                    Masuk Sekarang
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContentContainer: { 
    paddingHorizontal: 24, 
    paddingBottom: 40,
    paddingTop: 20,
  },
  content: { 
    flex: 1, 
    paddingTop: 28 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F8F9FA'
  },

  headerBackContainer: { 
    marginBottom: 20 
  },
  backButton: { 
    width: 48, 
    height: 48, 
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  backButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
  },

  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  logoSection: {
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  header: { 
    alignItems: 'center' 
  },
  title: {
    fontSize: 26, 
    textAlign: 'center',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 14, 
    color: '#666666', 
    textAlign: 'center',
    lineHeight: 20,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  form: {},

  inputGroup: { 
    marginBottom: 24 
  },
  label: { 
    fontSize: 14, 
    color: '#4CAF50', 
    marginBottom: 8,
    fontWeight: '500',
  },

  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  inputContainerFocused: {
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  inputContainerFilled: {
    borderColor: '#81C784',
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
    paddingVertical: 12,
  },

  phoneContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  phoneGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 56,
  },
  countryCodeContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  countryCode: { 
    fontSize: 16, 
    color: '#4CAF50',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
    paddingVertical: 12,
  },

  eyeIcon: {
    padding: 8,
  },

  termsSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: 'transparent',
  },
  checkboxGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#4CAF50',
  },

  registerButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  registerButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  registerButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#757575',
    fontSize: 16,
  },
  registerButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: 8,
  },

  loginSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  loginLink: {
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
  },
  loginTextBold: {
    color: '#4CAF50',
  },
});