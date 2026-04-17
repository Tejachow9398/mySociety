// File: app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading spinner while we check for a logged-in user
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  if (token) {
    // If the user is logged in, redirect them to the homie screen
    return <Redirect href="/home" />;
  } else {
    // If the user is not logged in, redirect them to the login screen
    return <Redirect href="/login" />;
  }
}