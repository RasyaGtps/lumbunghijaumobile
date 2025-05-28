import { CheckCircle, Circle } from 'lucide-react-native';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);

export default function RegisterScreen() {
  const [agreeTerms, setAgreeTerms] = useState(true);

  return (
    <StyledView className="flex-1 bg-white px-6 justify-center">
      {/* Judul */}
      <StyledText className="text-2xl font-bold text-center mb-1">Buat Akun</StyledText>
      <StyledText className="text-sm text-center text-gray-500 mb-6">
        Masuk ke akun Anda untuk mulai menggunakan layanan kami!
      </StyledText>

      {/* Input Nama Lengkap */}
      <StyledText className="text-sm mb-1">Nama Lengkap</StyledText>
      <StyledTextInput className="border rounded-md p-2 mb-3" placeholder="Nama Lengkap" />

      {/* Input Nomor Telepon */}
      <StyledText className="text-sm mb-1">Nomer Telepon</StyledText>
      <StyledTextInput className="border rounded-md p-2 mb-3" placeholder="08xxxxxxxxxx" keyboardType="phone-pad" />

      {/* Input Email */}
      <StyledText className="text-sm mb-1">Email</StyledText>
      <StyledTextInput className="border rounded-md p-2 mb-3" placeholder="Email" keyboardType="email-address" />

      {/* Input Kata Sandi */}
      <StyledText className="text-sm mb-1">Kata Sandi</StyledText>
      <StyledTextInput className="border rounded-md p-2 mb-4" placeholder="Kata Sandi" secureTextEntry />

      {/* Checkbox Syarat */}
      <StyledTouchable onPress={() => setAgreeTerms(!agreeTerms)} className="flex-row items-center mb-6">
        {agreeTerms ? (
          <CheckCircle className="w-5 h-5 text-black mr-2" />
        ) : (
          <Circle className="w-5 h-5 text-black mr-2" />
        )}
        <StyledText className="text-sm">Menyetujui Syarat dan Ketentuan</StyledText>
      </StyledTouchable>

      {/* Tombol Buat Akun */}
      <StyledTouchable className="border py-2 rounded-md items-center">
        <StyledText className="font-bold">Buat Akun</StyledText>
      </StyledTouchable>
    </StyledView>
  );
}
