// components/CustomSplashScreen.js
import React from 'react'
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native'

const { width, height } = Dimensions.get('window')

export default function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        onError={() => console.log('Error loading logo')}
      />
      <Text style={styles.text}>Loading...</Text>
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
    marginTop: 20,
  }
})