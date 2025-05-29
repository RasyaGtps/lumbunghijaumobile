import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl font-bold text-center mb-1">Masuk</Text>
      <Text className="text-sm text-center text-gray-500 mb-8">
        Selamat datang, silahkan login untuk masuk!
      </Text>

      {/* Email */}
      <Text className="text-sm mb-1">Email</Text>
      <TextInput
        className="border rounded-md p-2 mb-4"
        placeholder="Email"
        keyboardType="email-address"
      />

      {/* Kata Sandi */}
      <Text className="text-sm mb-1">Kata Sandi</Text>
      <View className="flex-row border rounded-md items-center px-2 mb-6">
        <TextInput
          className="flex-1 py-2"
          placeholder="Kata Sandi"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Eye className="w-5 h-5 text-gray-500" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-500" />
          )}
        </TouchableOpacity>
      </View>

      {/* Tombol Masuk */}
      <TouchableOpacity className="border py-2 rounded-md items-center">
        <Text className="font-bold">Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}
