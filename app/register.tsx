import { CheckCircle, Circle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [agreeTerms, setAgreeTerms] = useState(true);

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      {/* Judul */}
      <Text className="text-2xl font-bold text-center mb-1">Buat Akun</Text>
      <Text className="text-sm text-center text-gray-500 mb-6">
        Masuk ke akun Anda untuk mulai menggunakan layanan kami!
      </Text>

      {/* Input Nama Lengkap */}
      <Text className="text-sm mb-1">Nama Lengkap</Text>
      <TextInput className="border rounded-md p-2 mb-3" placeholder="Nama Lengkap" />

      {/* Input Nomor Telepon */}
      <Text className="text-sm mb-1">Nomer Telepon</Text>
      <TextInput
        className="border rounded-md p-2 mb-3"
        placeholder="08xxxxxxxxxx"
        keyboardType="phone-pad"
      />

      {/* Input Email */}
      <Text className="text-sm mb-1">Email</Text>
      <TextInput
        className="border rounded-md p-2 mb-3"
        placeholder="Email"
        keyboardType="email-address"
      />

      {/* Input Kata Sandi */}
      <Text className="text-sm mb-1">Kata Sandi</Text>
      <TextInput
        className="border rounded-md p-2 mb-4"
        placeholder="Kata Sandi"
        secureTextEntry
      />

      {/* Checkbox Syarat */}
      <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)} className="flex-row items-center mb-6">
        {agreeTerms ? (
          <CheckCircle className="w-5 h-5 text-black mr-2" />
        ) : (
          <Circle className="w-5 h-5 text-black mr-2" />
        )}
        <Text className="text-sm">Menyetujui Syarat dan Ketentuan</Text>
      </TouchableOpacity>

      {/* Tombol Buat Akun */}
      <TouchableOpacity className="border py-2 rounded-md items-center">
        <Text className="font-bold">Buat Akun</Text>
      </TouchableOpacity>
    </View>
  );
}
