// components/CustomSplashScreen.js
import React from 'react'
import { View, Image, StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

export default function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Sesuaikan dengan warna background yang diinginkan
  },
  logo: {
    width: width * 0.6, // 60% dari lebar layar
    height: height * 0.3, // 30% dari tinggi layar
    maxWidth: 200,
    maxHeight: 200,
  }
})