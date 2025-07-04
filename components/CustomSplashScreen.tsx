import React from 'react'
import { View, Image, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native'

const { width, height } = Dimensions.get('window')

interface CustomSplashScreenProps {
  error?: string | null
}

export default function CustomSplashScreen({ error }: CustomSplashScreenProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        onError={() => console.log('Error loading logo')}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <ActivityIndicator size="large" color="#4CAF50" style={styles.spinner} />
          <Text style={styles.text}>Loading...</Text>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    maxWidth: 200,
    maxHeight: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  spinner: {
    marginTop: 20,
  }
})