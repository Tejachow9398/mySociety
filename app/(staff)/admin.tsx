// File: app/(staff)/admin.tsx
import React, { useState } from 'react'; // Import useState
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Pressable, // Import Pressable
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Megaphone,
  Wrench,
  CalendarCheck,
  BarChart3,
  Shield,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';

// --- Interfaces remain the same ---
interface MetricCardProps {
  title: string;
  value: string;
  color: string;
}

interface ActionButtonProps {
  title: string;
  icon: React.ElementType;
  color: string;
}

// --- Components remain the same ---
const MetricCard = ({ title, value, color }: MetricCardProps) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
  </View>
);

const ActionButton = ({ title, icon: Icon, color }: ActionButtonProps) => (
  <TouchableOpacity style={styles.actionButton}>
    <View style={styles.actionIconContainer}>
      <Icon color={color} size={24} />
    </View>
    <Text style={styles.actionTitle}>{title}</Text>
    <ChevronRight color="#9CA3AF" size={24} />
  </TouchableOpacity>
);

const AdminDashboard = () => {
  const { userProfile, handleLogout } = useAuth();
  // State to control the visibility of the popover menu
  const [isMenuVisible, setMenuVisible] = useState(false);

  
  // Use the real photoUrl if it exists, otherwise use our placeholder
const imageUrl = userProfile?.photoUrl || 'https://placehold.co/100x100/4B5563/FFFFFF?text=Admin';;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Pressable wrapper to close the menu when tapping outside */}
      <Pressable style={{ flex: 1 }} onPress={() => setMenuVisible(false)}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Welcome, {userProfile?.fullName || 'Admin'}</Text>
            <Text style={styles.headerSubtitle}>
              {userProfile?.designation || 'Society Manager'}
            </Text>
          </View>
          {/* Tappable Profile Image */}
         <TouchableOpacity onPress={() => setMenuVisible(true)}>
  <Image 
    source={{ uri: imageUrl }} // <-- Use the new dynamic URL
    style={styles.profileImage} 
  />
</TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Key Metrics */}
          <View style={styles.metricsGrid}>
            <MetricCard title="Open Tickets" value="12" color="#EF4444" />
            <MetricCard title="Pending Bookings" value="3" color="#F59E0B" />
            <MetricCard title="Maintenance Paid" value="85%" color="#22C55E" />
            <MetricCard title="Visitors Today" value="47" color="#3B82F6" />
          </View>

          {/* Management Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Management Actions</Text>
            <ActionButton title="Manage Residents" icon={Users} color="#3B82F6" />
            <ActionButton title="Post a Notice" icon={Megaphone} color="#10B981" />
            <ActionButton title="View Help Desk" icon={Wrench} color="#EF4444" />
            <ActionButton title="Approve Bookings" icon={CalendarCheck} color="#8B5CF6" />
            <ActionButton title="View Financials" icon={BarChart3} color="#F59E0B" />
            <ActionButton title="Security Log" icon={Shield} color="#4B5563" />
          </View>
        </ScrollView>
      </Pressable>

      {/* Popover Menu - Renders only when isMenuVisible is true */}
      {isMenuVisible && (
        <View style={styles.popover}>
          <Text style={styles.popoverName}>{userProfile?.fullName}</Text>
          <Text style={styles.popoverEmail}>{userProfile?.email}</Text>
          <View style={styles.popoverDivider} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10, // Keep header on top
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  scrollView: { padding: 16 },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricTitle: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  metricValue: { fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  actionsContainer: {},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIconContainer: {
    marginRight: 16,
  },
  actionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  // --- New Popover Menu Styles ---
  popover: {
    position: 'absolute',
    top: 90, // Position it right below the header
    right: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    width: 250,
    zIndex: 20, // Ensure it's on top of everything
  },
  popoverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  popoverEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  popoverDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AdminDashboard;