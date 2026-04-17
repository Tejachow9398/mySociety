// File: app/(tabs)/home.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

interface FeatureButtonProps {
  label: string;
  color: string;
}

const FeatureButton = ({ label, color }: FeatureButtonProps) => (
    <TouchableOpacity style={styles.featureButton}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
      <Text style={{ color, fontSize: 24 }}>{label.charAt(0)}</Text>
    </View>
    <Text style={styles.featureLabel}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const { userProfile } = useAuth();

  const getPrimaryFlatDisplay = () => {
    if (!userProfile) return 'Loading...';
    if (userProfile.role === 'OWNER' && userProfile.flats && userProfile.flats.length > 0) {
      const flat = userProfile.flats[0];
      return `Tower ${flat.tower}, Flat ${flat.flatNumber}`;
    }
    if (userProfile.role === 'TENANT' && userProfile.flat) {
      const flat = userProfile.flat;
      return `Tower ${flat.tower}, Flat ${flat.flatNumber}`;
    }
    return 'No flat information available.';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerWelcome}>Welcome Home,</Text>
            <Text style={styles.headerName}>{userProfile?.fullName || 'User'}</Text>
            <View style={styles.roleContainer}>
              <Text style={styles.headerFlat}>{getPrimaryFlatDisplay()}</Text>
              {userProfile?.role && <Text style={styles.roleBadge}>{userProfile.role}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Tasks</Text>
          <TouchableOpacity style={styles.priorityCard}>
            <View style={[styles.priorityIcon, { backgroundColor: '#EFF6FF' }]}>
              <Text style={{fontSize: 24}}>🛡️</Text>
            </View>
            <View>
              <Text style={styles.priorityTitle}>Manage Visitors</Text>
              <Text style={styles.prioritySubtitle}>Pre-approve guests & deliveries.</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.priorityCard}>
            <View style={[styles.priorityIcon, { backgroundColor: '#F0FDF4' }]}>
              <Text style={{fontSize: 24}}>👥</Text>
            </View>
            <View>
              <Text style={styles.priorityTitle}>Daily Help</Text>
              <Text style={styles.prioritySubtitle}>Track attendance & payments.</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Features</Text>
          <View style={styles.featureGrid}>
            <FeatureButton label="Notices" color="#3B82F6" />
            <FeatureButton label="Help Desk" color="#EF4444" />
            <FeatureButton label="Payments" color="#22C55E" />
            <FeatureButton label="Groceries" color="#F59E0B" />
            <FeatureButton label="Bookings" color="#8B5CF6" />
            <FeatureButton label="Market" color="#EC4899" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles are the same
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { paddingBottom: 100 },
  header: { padding: 24 },
  headerWelcome: { fontSize: 16, color: '#6B7280' },
  headerName: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  headerFlat: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  roleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  roleBadge: { backgroundColor: '#DBEAFE', color: '#1E40AF', fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8, overflow: 'hidden' },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  priorityCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  priorityIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  priorityTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  prioritySubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureButton: { width: '30%', alignItems: 'center', marginBottom: 20 },
  iconContainer: { width: 64, height: 64, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  featureLabel: { marginTop: 8, fontSize: 14, fontWeight: '500', color: '#374151' },
});

export default HomeScreen;