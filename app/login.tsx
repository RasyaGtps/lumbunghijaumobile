import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
} from 'react-native';
import { loginUser } from '../api/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ login: email, password });

      if (response.status && response.data) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        router.replace('/');
      } else {
        Alert.alert('Error', response.message || 'Login gagal');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
                Masuk
              </Text>
              <Text style={[styles.subtitle, styles.highlight, { fontFamily: 'Poppins_400Regular' }]}>
                Selamat datang, Silahkan masuk untuk 
              </Text>
                <Text style={[styles.subtitle, styles.highlight, { fontFamily: 'Poppins_400Regular' }]}>
               melanjutkan
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>Email</Text>
                <TextInput
                  placeholder="user@example.com"
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold' }]}>Kata Sandi</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={[styles.passwordInput, { fontFamily: 'Poppins_400Regular' }]}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>


              <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.registerButtonWrapper}>
                <LinearGradient
                  colors={['#1B9C41', '#91D68D']} // gradasi hijau dari atas ke bawah
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.registerButton}
                >
                  <Text style={[styles.registerButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
                    {loading ? 'Loading...' : 'Selesai'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerRedirect}>
                <Text style={[styles.registerRedirectText, { fontFamily: 'Poppins_400Regular' }]}>
                  Belum punya akun? Daftar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContentContainer: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 10 },
  content: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 110, },
  header: { marginBottom: 30, alignItems: 'center' },
  title: {fontSize:26, color: '#000000'},
  subtitle: { fontSize: 12, color: '#999999', textAlign: 'center' },
  highlight: { fontWeight: 'bold' },
  form: { width: '100%', paddingTop: 25 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, color: '#000000', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 2,
  },
  passwordInput: { flex: 1, fontSize: 14, color: '#000' },
  eyeIcon: { marginLeft: 10 },
  registerButtonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  registerButton: {
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  registerRedirect: { marginTop: 20, alignItems: 'center' },
  registerRedirectText: {
    color: '#0A529F',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
