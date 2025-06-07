import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Circle, Defs, Path, RadialGradient, Stop, Svg } from 'react-native-svg';

// Success Icon Component
const SuccessIcon = () => (
  <View style={styles.iconContainer}>
    <Svg width={200} height={200} viewBox="0 0 200 200">
      <Defs>
        <RadialGradient id="gradient" cx="50%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#4ADE80" />
          <Stop offset="100%" stopColor="#166534" />
        </RadialGradient>
      </Defs>
      <Circle cx={100} cy={100} r={100} fill="url(#gradient)" />
      
      {/* Card/Receipt Shape */}
      <Path
        d="M60 60 L140 60 Q150 60 150 70 L150 75 Q145 80 140 80 L135 80 Q130 85 125 80 L115 80 Q110 85 105 80 L95 80 Q90 85 85 80 L75 80 Q70 85 65 80 L60 80 Q50 80 50 70 L50 70 Q50 60 60 60 Z"
        fill="white"
        opacity={0.9}
      />
      <Path
        d="M50 80 L50 160 Q50 170 60 170 L140 170 Q150 170 150 160 L150 80"
        fill="white"
        opacity={0.9}
      />
      
      {/* Check Circle */}
      <Circle cx={100} cy={125} r={20} fill="#4ADE80" opacity={0.3} />
      <Circle cx={100} cy={125} r={15} fill="#22C55E" />
      
      {/* Check Mark */}
      <Path
        d="M92 125 L98 131 L108 119"
        stroke="white"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

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
      <SuccessIcon />
      
      <Text style={[styles.title, { fontFamily: 'Poppins_600SemiBold' }]}>
        Akun Berhasil ditambahkan
      </Text>
      
      <Text style={[styles.subtitle, { fontFamily: 'Poppins_400Regular' }]}>
        Ayo kita mulai kurangi limbah{'\n'}makanan mulai sekarang!
      </Text>
      
      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={() => router.replace('/login')}
      >
        <Text style={[styles.continueButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>
          Selanjutnya
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
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    textAlign: 'center',
  },
});