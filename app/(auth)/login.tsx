// File: app/(auth)/login.tsx
import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView,
  StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { checkPhoneRegistration, loginUser } from '../../services/AuthService';
import firebase from '../../constants/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useAuth } from '../../context/AuthContext';

type RecaptchaVerifier = import('expo-firebase-recaptcha').FirebaseRecaptchaVerifierModal;

const AppLogo = () => ( <View style={styles.logoContainer}><Text style={styles.logoText}>MS</Text></View> );

const LoginScreen = () => {
  // --- THIS IS THE FIX ---
  // We rename the function from the context to avoid a name collision.
  const { handleLogin: loginWithContext } = useAuth(); 
  const router = useRouter();
  const recaptchaVerifier = useRef<RecaptchaVerifier>(null);
  const [isStaffLogin, setIsStaffLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This is the component's own function that is called when the button is pressed.
  const handleLogin = async () => {
  setIsLoading(true);
  try {
    if (isStaffLogin) {
      const response = await loginUser({ username, password });
      if ('error' in response || !response.token) {
        Alert.alert('Login Failed', response.error || 'An unknown error occurred.');
        setIsLoading(false);
      } else {
        // On success, the context will fetch the profile and navigate
        await loginWithContext(response.token);
      }
    } else {
      // Resident login flow
      const checkResponse = await checkPhoneRegistration(phone);
      if (checkResponse.isRegistered) {
        try {
          const phoneProvider = new firebase.auth.PhoneAuthProvider();
          const verificationId = await phoneProvider.verifyPhoneNumber(
            `+91${phone}`,
            recaptchaVerifier.current!
          );
          router.push({ pathname: '/verify-otp', params: { verificationId } });
        } catch (error: any) {
          Alert.alert('Verification Failed', 'Please complete the security check.');
        }
      } else {
        Alert.alert('Registration Error', checkResponse.message || 'An error occurred.');
      }
    }
  } finally {
    // This will run no matter what, ensuring the spinner always hides
    // (except for the resident flow, which handles it separately after navigation)
    if (isStaffLogin) {
        setIsLoading(false);
    }
  }
};

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebase.app().options}
          title="Prove you are not a robot"
          cancelLabel="Close"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <AppLogo />
            <Text style={styles.title}>My Society</Text>
            <Text style={styles.subtitle}>Your community, connected.</Text>
          </View>

          <View style={styles.formContainer}>
            {isStaffLogin ? (
              <>
                <Text style={styles.formTitle}>Staff Login</Text>
                <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true}  />
              </>
            ) : (
              <>
                <Text style={styles.formTitle}>Welcome Resident!</Text>
                <TextInput style={styles.input} placeholder="Enter your 10-digit mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} />
              </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isStaffLogin ? 'Login' : 'Get OTP'}</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => setIsStaffLogin(!isStaffLogin)}>
              <Text style={styles.footerText}>
                {isStaffLogin ? 'Are you a Resident? Login here.' : 'Are you Staff or Admin? Login here.'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8fa' },
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingTop: 60 },
  logoContainer: { width: 80, height: 80, backgroundColor: '#3b82f6', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1f2937' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 8 },
  formContainer: { width: '100%' },
  formTitle: { fontSize: 22, fontWeight: '600', color: '#1f2937', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  button: { backgroundColor: '#3b82f6', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { alignItems: 'center', paddingBottom: 40 },
  footerText: { color: '#3b82f6', fontSize: 14, fontWeight: '500' },
});

export default LoginScreen;
