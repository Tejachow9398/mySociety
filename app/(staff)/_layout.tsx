import { Stack } from 'expo-router';
import React from 'react';

export default function StaffLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="security" />
      <Stack.Screen name="admin" /> 
    </Stack>
  );
}