import React from 'react';
import { View, Text, Image, ScrollView, TextInput } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledInput = styled(TextInput);

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Header */}
      <StyledView className="flex-row justify-between items-center mb-4">
        <StyledText className="text-sm text-gray-500">Selamat datang,</StyledText>
        <StyledImage
          className="w-8 h-8 rounded-full border"
          source={{ uri: 'https://via.placeholder.com/32' }}
        />
      </StyledView>

      <StyledText className="text-lg font-bold -mt-2 mb-4">User!</StyledText>

      {/* Card Poin */}
      <StyledView className="border rounded-lg p-4 mb-6">
        <StyledText className="text-xs text-gray-500 mb-1">Point Yang Terkumpul</StyledText>
        <StyledText className="text-xl font-bold mb-2">Poin</StyledText>
        <StyledInput
          className="border rounded px-2 py-1 w-20 text-center"
          placeholder="0"
          keyboardType="numeric"
        />
      </StyledView>

      {/* Kotak Icon Menu */}
      <StyledView className="flex-row justify-between">
        {[...Array(5)].map((_, index) => (
          <StyledView
            key={index}
            className="w-12 h-12 border rounded-md"
          />
        ))}
      </StyledView>
    </ScrollView>
  );
}
