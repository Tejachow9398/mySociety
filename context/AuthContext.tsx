// File: context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../constants/firebase';
import { useRouter } from 'expo-router';

// Define the shape of the user profile data we expect from the backend
interface UserProfile {
  fullName: string;
  role: string;
  [key: string]: any; // Allows for other properties like designation, flats, etc.
}

// Define the shape of our global context
interface AuthContextType {
  token: string | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  handleLogin: (newToken: string) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userProfile: null,
  isLoading: true,
  handleLogin: async () => {},
  handleLogout: async () => {},
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter(); // Initialize the router here
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  

  useEffect(() => {
    // When the app starts, check if a token was saved from a previous session
    const bootstrapAsync = async () => {
      let savedToken: string | null = null;
      try {
        savedToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      if (savedToken) {
        setToken(savedToken);
        // If we found a token, fetch the user's profile
        const profile = await getUserProfile(savedToken);
        if (!('error' in profile)) {
          setUserProfile(profile);
        } else {
          // The saved token might be expired or invalid
          await AsyncStorage.removeItem('userToken');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  // This function is called after any successful login (resident or staff)
  const handleLogin = async (newToken: string) => {
    setIsLoading(true);
    setToken(newToken);
    await AsyncStorage.setItem('userToken', newToken);
    const profile = await getUserProfile(newToken);

    if (!('error' in profile)) {
      setUserProfile(profile);
      // --- THIS IS THE NEW LOGIC ---
      // After fetching the profile, navigate based on the role
      if (profile.role === 'SECURITY') {
        router.replace('/security');
      } else if (profile.role === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/home');
      }
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    console.log("Logout button pressed. handleLogout function is running!");
  // 1. Erase the details from the app's state
  setToken(null);
  setUserProfile(null);

  // 2. Erase the saved token from the phone's permanent storage
  await AsyncStorage.removeItem('userToken');

  // 3. If the user was logged in with Firebase, sign them out there too
  if (firebase.auth().currentUser) {
    await firebase.auth().signOut();
  }

  // 4. Send the user back to the login page
  router.replace('/login'); 
};

  return (
    <AuthContext.Provider value={{ token, userProfile, isLoading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
