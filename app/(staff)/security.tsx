import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { getTodaysVisitors, checkInVisitor, checkOutVisitor } from '../../services/SecurityService';
import { Visitor } from '../../services/VisitorService'; // Reuse the Visitor type
import {
  UserPlus,
  ClipboardList,
  Search,
  Siren,
  LogOut,
} from 'lucide-react-native';

const SecurityDashboard = () => {
  const { userProfile, handleLogout } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  // Function to fetch the latest visitor list from the backend
  const fetchVisitors = useCallback(async () => {
    console.log("Attempting to fetch visitors from the backend...");
    setIsLoading(true);
    const fetchedVisitors = await getTodaysVisitors();
    setVisitors(fetchedVisitors);
    setIsLoading(false);
    setRefreshing(false);
  }, []);

  // Fetch data every time the screen comes into focus
  useEffect(() => {
    if (isFocused) {
      fetchVisitors();
    }
    // Clock timer
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, [isFocused]);

  // Function to handle the check-in action
  const handleCheckIn = async (visitorId: string) => {
    // Optimistic UI update: Instantly change status to CHECKED_IN
    setVisitors(currentVisitors =>
      currentVisitors.map(v => v.id === visitorId ? { ...v, status: 'CHECKED_IN' } : v)
    );
    await checkInVisitor(visitorId);
    // Re-fetch data for full consistency
    fetchVisitors();
  };

  // Function to handle the check-out action
  const handleCheckOut = async (visitorId: string) => {
     // Optimistic UI update: Instantly remove from the active list
    setVisitors(currentVisitors =>
      currentVisitors.filter(v => v.id !== visitorId)
    );
    await checkOutVisitor(visitorId);
    fetchVisitors();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header - Displays dynamic data */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{userProfile?.fullName || 'Security'}</Text>
          <Text style={styles.headerSubtitle}>
            {userProfile?.assignedGate || 'Main Gate'} - {currentTime}
          </Text>
        </View>
        {userProfile?.photoUrl && (
          <Image source={{ uri: userProfile.photoUrl }} style={styles.profileImage} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchVisitors} tintColor="#fff" />}
      >
        {/* Main Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <UserPlus color="#FFFFFF" size={24} />
            <Text style={styles.actionButtonText}>Announce Visitor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#16A34A' }]}>
            <ClipboardList color="#FFFFFF" size={24} />
            <Text style={styles.actionButtonText}>Daily Help Log</Text>
          </TouchableOpacity>
        </View>

        {/* Live Visitor Feed */}
        <View style={styles.feedContainer}>
          <Text style={styles.feedTitle}>Today's Active Visitors</Text>
          {isLoading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            visitors.map((visitor) => (
              <View key={visitor.id} style={styles.visitorCard}>
                <View style={styles.visitorDetails}>
                    <View>
                        <Text style={styles.visitorName}>{visitor.primaryDetail}</Text>
                        <Text style={styles.visitorSubText}>To: Flat {visitor.flatId}</Text>
                    </View>
                    <Text style={styles.visitorStatus}>{visitor.status.replace('_', ' ')}</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                    {visitor.status === 'CHECKED_IN' ? (
                        <TouchableOpacity style={styles.checkOutButton} onPress={() => handleCheckOut(visitor.id)}>
                            <Text style={styles.buttonText}>Check Out</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.checkInButton} onPress={() => handleCheckIn(visitor.id)}>
                            <Text style={styles.buttonText}>Check In</Text>
                        </TouchableOpacity>
                    )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Utility Bar */}
      <View style={styles.utilityBar}>
        <TouchableOpacity style={styles.utilityButton}>
          <Search color="#FFFFFF" size={24} />
          <Text style={styles.utilityButtonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.utilityButton}>
          <Siren color="#F87171" size={24} />
          <Text style={[styles.utilityButtonText, { color: '#F87171' }]}>Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.utilityButton} onPress={handleLogout}>
          <LogOut color="#FFFFFF" size={24} />
          <Text style={styles.utilityButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1F2937' },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#9CA3AF', fontSize: 14, marginTop: 2 },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'white',
  },
  scrollView: { backgroundColor: '#111827', padding: 16 },
  actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  actionButton: { backgroundColor: '#2563EB', flex: 1, marginHorizontal: 8, paddingVertical: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5, },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  feedContainer: {},
  feedTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  visitorCard: { backgroundColor: '#1F2937', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#374151' },
  visitorDetails: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  visitorName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  visitorSubText: { fontSize: 14, color: '#9CA3AF', marginTop: 2 },
  visitorStatus: { color: '#E5E7EB', fontWeight: '600', textTransform: 'capitalize' },
  buttonContainer: { backgroundColor: '#374151', padding: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  checkInButton: { backgroundColor: '#16A34A', padding: 12, borderRadius: 8, alignItems: 'center' },
  checkOutButton: { backgroundColor: '#EF4444', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  utilityBar: { backgroundColor: '#1F2937', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#374151', },
  utilityButton: { alignItems: 'center', padding: 4 },
  utilityButtonText: { color: '#FFFFFF', fontSize: 12, marginTop: 4 },
});

export default SecurityDashboard;
