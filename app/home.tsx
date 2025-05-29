import React from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm text-gray-500">Selamat datang,</Text>
        <Image
          className="w-8 h-8 rounded-full border"
          source={{ uri: 'placeholder' }}
        />
      </View>

      <Text className="text-lg font-bold -mt-2 mb-4">User!</Text>

      {/* Card Poin */}
      <View className="border rounded-lg p-4 mb-6">
        <Text className="text-xs text-gray-500 mb-1">Point Yang Terkumpul</Text>
        <Text className="text-xl font-bold mb-2">Poin</Text>
        <TextInput
          className="border rounded px-2 py-1 w-20 text-center"
          placeholder="0"
          keyboardType="numeric"
        />
      </View>

      {/* Kotak Icon Menu */}
      <View className="flex-row justify-between">
        {[...Array(5)].map((_, index) => (
          <View
            key={index}
            className="w-12 h-12 border rounded-md"
          />
        ))}
      </View>
    </ScrollView>
  );
}
