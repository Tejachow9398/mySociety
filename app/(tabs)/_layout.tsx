// File: app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

// This is a custom component for our central SOS button
const SosTabBarButton = () => (
  <TouchableOpacity style={styles.sosButtonContainer}>
    <View style={styles.sosButton}>
      <Text style={{ color: '#FFFFFF', fontSize: 18 }}>SOS</Text>
    </View>
  </TouchableOpacity>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 80,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>, // Using an emoji
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>💬</Text>, // Using an emoji
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: '',
          tabBarButton: () => <SosTabBarButton />,
        }}
      />
      <Tabs.Screen
        name="visitors"
        options={{
          title: 'Visitors',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🛡️</Text>, // Using an emoji
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👤</Text>, // Using an emoji
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sosButtonContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -25 }],
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'white',
  },
});