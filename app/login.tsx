import { Eye, EyeOff } from 'lucide-react-native';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchable = styled(TouchableOpacity);

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <StyledView className="flex-1 bg-white px-6 justify-center">
      <StyledText className="text-2xl font-bold text-center mb-1">Masuk</StyledText>
      <StyledText className="text-sm text-center text-gray-500 mb-8">
        Selamat datang, silahkan login untuk masuk!
      </StyledText>

      {/* Email */}
      <StyledText className="text-sm mb-1">Email</StyledText>
      <StyledTextInput
        className="border rounded-md p-2 mb-4"
        placeholder="Email"
        keyboardType="email-address"
      />

      {/* Kata Sandi */}
      <StyledText className="text-sm mb-1">Kata Sandi</StyledText>
      <StyledView className="flex-row border rounded-md items-center px-2 mb-6">
        <StyledTextInput
          className="flex-1 py-2"
          placeholder="Kata Sandi"
          secureTextEntry={!showPassword}
        />
        <StyledTouchable onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Eye className="w-5 h-5 text-gray-500" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-500" />
          )}
        </StyledTouchable>
      </StyledView>

      {/* Tombol Masuk */}
      <StyledTouchable className="border py-2 rounded-md items-center">
        <StyledText className="font-bold">Masuk</StyledText>
      </StyledTouchable>
    </StyledView>
  );
}
