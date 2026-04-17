// File: app/verify-otp.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator, Pressable, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import firebase from '../../constants/firebase';
import { loginUser } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';

const OTPScreen = () => {
  const { handleLogin } = useAuth();
  const router = useRouter();
  const { verificationId } = useLocalSearchParams<{ verificationId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW LOGIC FOR BOX INPUTS ---
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  const handleOtpChange = (text: string, index: number) => {
    if (!/^[0-9]$/.test(text) && text !== '') return; // Allow only single digits

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input if a digit is entered
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to the previous input if backspace is pressed on an empty box
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };
  // --- END OF NEW LOGIC ---

  const handleVerifyOtp = async () => {
    const finalOtp = otp.join('');
    if (finalOtp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }
    if (!verificationId) {
      Alert.alert("Error", "Verification process failed. Please try again.");
      router.back();
      return;
    }

    setIsLoading(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, finalOtp);
      const userCredential = await firebase.auth().signInWithCredential(credential);

      if (!userCredential.user) {
        throw new Error("Authentication failed: User data is not available.");
      }

      const idToken = await userCredential.user.getIdToken();
      /*
      const response = await loginUser({ idToken });

      if ('error' in response) {
        Alert.alert("Login Failed", response.error);
      } else {
        router.replace('/home');
      }*/
     await handleLogin(idToken);
    } catch (error: any) {
      Alert.alert("Verification Failed", "The OTP you entered is incorrect or an error occurred.");
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>A 6-digit code was sent to your phone.</Text>

        {/* --- NEW UI FOR OTP BOXES --- */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) {
                  inputs.current[index] = ref;
                }
              }}  
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              value={digit}
            />
          ))}
        </View>
        {/* --- END OF NEW UI --- */}

        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & Login</Text>}
        </TouchableOpacity>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f7f8fa' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 12, color: '#1f2937' },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 40 },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpBox: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  button: { backgroundColor: '#3b82f6', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default OTPScreen;