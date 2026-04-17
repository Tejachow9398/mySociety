// File: app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import React from 'react';

export default function RootLayout() {
  return (
    // The AuthProvider now handles all the logic for checking the
    // user's login status and navigating them to the correct screen.
    <AuthProvider>
      <Stack>
        {/* These names MUST match your folder names */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(staff)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}