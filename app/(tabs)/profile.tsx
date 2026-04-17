// File: app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Phone, Mail, Car, UserCircle, LogOut } from 'lucide-react-native';

const ProfileScreen = () => {
  const { userProfile, handleLogout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: userProfile?.photoUrl || 'https://placehold.co/100x100' }} 
            style={styles.profileImage} 
          />
          <Text style={styles.name}>{userProfile?.fullName || 'User'}</Text>
          <View style={[styles.roleBadge, userProfile?.role === 'OWNER' ? styles.ownerBadge : styles.tenantBadge]}>
            <Text style={styles.roleText}>{userProfile?.role || 'Resident'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Phone color="#6B7280" size={20} />
            <Text style={styles.infoText}>{userProfile?.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Mail color="#6B7280" size={20} />
            <Text style={styles.infoText}>{userProfile?.email}</Text>
          </View>
        </View>

        {userProfile?.role === 'OWNER' && userProfile.flats && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>My Properties</Text>
            {userProfile.flats.map((flat: any) => (
              <View key={flat.id} style={styles.propertyRow}>
                <View>
                  <Text style={styles.propertyText}>Tower {flat.tower}, Flat {flat.flatNumber}</Text>
                  <Text style={styles.subPropertyText}>Parking: {flat.parkingNumber}</Text>
                </View>
                {/* Display the status of the flat */}
                <View style={
                  flat.id === userProfile.primaryResidenceFlatId ? styles.statusOccupied : 
                  flat.tenantId ? styles.statusRented : styles.statusVacant
                }>
                  <Text style={styles.statusText}>
                    {
                      flat.id === userProfile.primaryResidenceFlatId ? 'Self-Occupied' :
                      flat.tenantId ? 'Rented Out' : 'Vacant'
                    }
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}


        {userProfile?.role === 'TENANT' && userProfile.flat && (
           <View style={styles.card}>
            <Text style={styles.cardTitle}>My Rented Flat</Text>
            <View style={styles.propertyRow}>
              <Text style={styles.propertyText}>Tower {userProfile.flat.tower}, Flat {userProfile.flat.flatNumber}</Text>
              <Text style={styles.subPropertyText}>Move-in: {new Date(userProfile.moveInDate).toLocaleDateString()}</Text>
            </View>
          </View>
        )}

        {userProfile?.vehicles && userProfile.vehicles.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle Details</Text>
            {userProfile.vehicles.map((vehicle: any, index: number) => (
              <View key={index} style={styles.propertyRow}>
                <Text style={styles.propertyText}>{vehicle.number}</Text>
                <Text style={styles.subPropertyText}>{vehicle.type} - {vehicle.model}</Text>
              </View>
            ))}
          </View>
        )}

        {userProfile?.emergencyContact && (
          <View style={[styles.card, styles.emergencyCard]}>
            <Text style={[styles.cardTitle, { color: '#DC2626' }]}>Emergency Contact</Text>
            <View style={styles.infoRow}>
              <UserCircle color="#DC2626" size={20} />
              <Text style={styles.infoText}>{userProfile.emergencyContact.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone color="#DC2626" size={20} />
              <Text style={styles.infoText}>{userProfile.emergencyContact.phone}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#FFFFFF" size={20} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusOccupied: { backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusRented: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusVacant: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#1F2937' },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#111827',
  },
  roleBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ownerBadge: { backgroundColor: '#DBEAFE' },
  tenantBadge: { backgroundColor: '#D1FAE5' },
  roleText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#1E40AF', // Default for owner
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#374151',
  },
  propertyRow: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subPropertyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProfileScreen;
