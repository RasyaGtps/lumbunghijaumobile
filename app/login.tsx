import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import { loginUser } from '../api/auth';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const handleLogin = async () => {
    if (!formData.login || !formData.password) {
      Alert.alert('Error', 'Email dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      console.log('Mencoba login dengan:', formData);
      const response = await loginUser(formData);
      console.log('Response login:', response);

      if (response.status && response.data) {
        // Simpan token
        await AsyncStorage.setItem('token', response.data.token);
        
        // Cek status verifikasi email
        if (!response.data.user.email_verified) {
          console.log('Email belum terverifikasi, mengarahkan ke halaman OTP');
          router.replace('/verify-otp');
        } else {
          console.log('Login berhasil, mengarahkan ke home');
          router.replace('/');
        }
      } else {
        Alert.alert('Error', response.message || 'Gagal login');
      }
    } catch (error) {
      console.error('Error saat login:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat login');
    }
    setLoading(false);
  };

  const isFormValid = formData.login.length > 0 && formData.password.length > 0;

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern} />
      
      {/* Header Section with Enhanced Gradient */}
      <LinearGradient
        colors={['#81C784', '#66BB6A', '#4CAF50', '#388E3C']}
        style={styles.headerSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
        
        <Animated.View 
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Animated.View
            style={[
              styles.logoContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <LinearGradient
              colors={['white', 'white']}
              style={styles.logoGradient}
            >
              <Image
                source={require('../assets/images/icon/logo.png')} // Ganti dengan path yang benar ke logo Anda
                style={styles.logoImage} // Style untuk gambar logo Anda
              />
            </LinearGradient>
          </Animated.View>
          <Text style={[styles.appName, { fontFamily: 'Poppins_600SemiBold' }]}>
            Lumbung Hijau
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Form Section */}
      <KeyboardAvoidingView
        style={styles.formSection}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  // opacity: fadeAnim,
                  // transform: [
                  //   { translateY: slideAnim },
                  //   { scale: scaleAnim }
                  // ]
                }
              ]}
            >
              {/* Welcome Card */}
              <View style={styles.welcomeCard}>
                <View style={styles.titleSection}>
                  <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
                    Masuk
                  </Text>
                  <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>
                    Masukkan email dan password Anda
                  </Text>
                </View>

                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { fontFamily: 'Poppins_400Regular' }]}>
                    Email
                  </Text>
                  <View style={[
                    styles.inputContainer,
                    emailFocused && styles.inputContainerFocused,
                    formData.login.length > 0 && styles.inputContainerFilled
                  ]}>
                    <LinearGradient
                      colors={emailFocused ? ['#E8F5E8', '#F1F8E9'] : ['#FAFAFA', '#FAFAFA']}
                      style={styles.inputGradient}
                    >
                      <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={emailFocused ? '#4CAF50' : '#9E9E9E'} 
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        placeholder="Masukkan email Anda"
                        value={formData.login}
                        onChangeText={(text) => setFormData({ ...formData, login: text })}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                        placeholderTextColor="#9E9E9E"
                      />
                      {formData.login.length > 0 && (
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      )}
                    </LinearGradient>
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { fontFamily: 'Poppins_400Regular' }]}>
                    Password
                  </Text>
                  <View style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputContainerFocused,
                    formData.password.length > 0 && styles.inputContainerFilled
                  ]}>
                    <LinearGradient
                      colors={passwordFocused ? ['#E8F5E8', '#F1F8E9'] : ['#FAFAFA', '#FAFAFA']}
                      style={styles.inputGradient}
                    >
                      <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color={passwordFocused ? '#4CAF50' : '#9E9E9E'} 
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        placeholder="Masukkan kata sandi"
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        secureTextEntry={!showPassword}
                        style={[styles.passwordInput, { fontFamily: 'Poppins_400Regular' }]}
                        editable={!loading}
                        placeholderTextColor="#9E9E9E"
                      />
                      <TouchableOpacity 
                        onPress={() => setShowPassword(!showPassword)} 
                        style={styles.eyeIcon}
                        activeOpacity={0.7}
                      >
                        <Ionicons 
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                          size={20} 
                          color={passwordFocused ? '#4CAF50' : '#9E9E9E'} 
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity 
                  onPress={handleLogin} 
                  disabled={loading || !isFormValid} 
                  style={[
                    styles.continueButton,
                    (loading || !isFormValid) && styles.continueButtonDisabled
                  ]}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isFormValid && !loading ? 
                      ['#66BB6A', '#4CAF50', '#388E3C'] : 
                      ['#E0E0E0', '#BDBDBD']
                    }
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Text style={[
                          styles.continueButtonText, 
                          { fontFamily: 'Poppins_600SemiBold' },
                          isFormValid && !loading && styles.continueButtonTextActive
                        ]}>
                          Masuk
                        </Text>
                        <Ionicons 
                          name="arrow-forward" 
                          size={20} 
                          color={isFormValid && !loading ? "#FFFFFF" : "#757575"} 
                          style={styles.buttonIcon}
                        />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Register Link */}
              <View style={styles.registerSection}>
                <TouchableOpacity 
                  onPress={() => router.push('/register')} 
                  style={styles.registerLink}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.registerText, { fontFamily: 'Poppins_400Regular' }]}>
                    Belum punya akun? 
                    <Text style={[styles.registerTextBold, { fontFamily: 'Poppins_600SemiBold' }]}>
                      {' '}Daftar Sekarang
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
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
  logoImage: {
    width: 50,
    height: 50,
  },
  headerSection: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    overflow: 'hidden',
    // Shadow for elevation
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 50,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    // Inner shadow effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  appName: {
    fontSize: 34,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
  },
  formSection: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: -20,
  },
  scrollView: { 
    flex: 1 
  },
  scrollContentContainer: { 
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    // Enhanced shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
    // Border for subtle definition
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  titleSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputGroup: { 
    marginBottom: 24 
  },
  label: { 
    fontSize: 14, 
    color: '#4CAF50', 
    marginBottom: 8,
    letterSpacing: -0.1,
    fontWeight: '500',
  },
  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    // transition: 'all 0.3s ease',
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
  passwordInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#2C2C2C',
    paddingVertical: 12,
  },
  eyeIcon: { 
    padding: 8,
  },
  continueButton: {
    borderRadius: 16,
    marginTop: 32,
    overflow: 'hidden',
    // Enhanced shadow
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  continueButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    letterSpacing: -0.2,
    color: '#757575',
  },
  continueButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  registerSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  registerLink: {
    paddingVertical: 8,
  },
  registerText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
  },
  registerTextBold: {
    color: '#4CAF50',
  },
  termsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 18,
    textAlign: 'center',
  },
  linkText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});