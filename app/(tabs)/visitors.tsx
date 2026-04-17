import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, User, Package, Car, Wrench } from 'lucide-react-native';
import { getMyVisitors, Visitor } from '../../services/VisitorService';
import { useIsFocused } from '@react-navigation/native';

// Helper component to show the correct icon based on visitor type
const VisitorIcon = ({ type }: { type: Visitor['visitorType'] }) => {
  const iconMap = {
    GUEST: <User color="#EC4899" size={24} />,
    DELIVERY: <Package color="#F59E0B" size={24} />,
    CAB: <Car color="#8B5CF6" size={24} />,
    SERVICE: <Wrench color="#22C55E" size={24} />,
  };
  const colorMap = {
    GUEST: '#FCE7F3',
    DELIVERY: '#FFFBEB',
    CAB: '#F5F3FF',
    SERVICE: '#F0FDF4',
  };
  return <View style={[styles.iconWrapper, {backgroundColor: colorMap[type]}]}>{iconMap[type]}</View>;
};

// Helper component to show a styled status badge
const StatusBadge = ({ status }: { status: Visitor['status'] }) => {
    const statusStyles = {
        EXPECTED: { bg: '#DBEAFE', text: '#1E40AF' },
        LATE: { bg: '#FEF3C7', text: '#92400E' },
        CHECKED_IN: { bg: '#D1FAE5', text: '#065F46' },
        COMPLETED: { bg: '#E5E7EB', text: '#374151' },
        CANCELLED: { bg: '#FEE2E2', text: '#991B1B' },
    };
    const style = statusStyles[status] || statusStyles.COMPLETED;
    return (
        <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
            <Text style={[styles.statusText, { color: style.text }]}>{status.replace('_', ' ')}</Text>
        </View>
    );
};

// Helper to format time strings
const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const ManageVisitorsScreen = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upcoming, setUpcoming] = useState<Visitor[]>([]);
  const [history, setHistory] = useState<Visitor[]>([]);

  const isFocused = useIsFocused();

  const fetchVisitors = useCallback(async () => {
    setIsLoading(true);
    const data = await getMyVisitors();
    setUpcoming(data.upcoming);
    setHistory(data.history);
    setIsLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchVisitors();
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVisitors();
  };

  const visitorsToShow = activeTab === 'Upcoming' ? upcoming : history;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Visitors</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'Upcoming' && styles.activeTabButton]} onPress={() => setActiveTab('Upcoming')}>
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'History' && styles.activeTabButton]} onPress={() => setActiveTab('History')}>
          <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : (
        <ScrollView 
          style={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {visitorsToShow.length === 0 ? (
            <View style={styles.emptyState}>
               <User color="#9CA3AF" size={48} />
               <Text style={styles.emptyText}>No visitors in this list.</Text>
            </View>
          ) : (
            visitorsToShow.map(visitor => (
              <View key={visitor.id} style={styles.visitorCard}>
                <View style={styles.cardHeader}>
                    <VisitorIcon type={visitor.visitorType} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.visitorName}>{visitor.primaryDetail}</Text>
                        <Text style={styles.visitorType}>{visitor.visitorType}</Text>
                    </View>
                    <StatusBadge status={visitor.status} />
                </View>
                <View style={styles.cardFooter}>
                   <Text style={styles.timeText}>
                       {visitor.status === 'CHECKED_IN' && `In: ${formatTime(visitor.checkInTime)}`}
                       {visitor.status === 'COMPLETED' && `In: ${formatTime(visitor.checkInTime)}, Out: ${formatTime(visitor.checkOutTime)}`}
                   </Text>
                   {activeTab === 'Upcoming' && visitor.status !== 'CHECKED_IN' &&
                     <TouchableOpacity><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                   }
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab}>
        <Plus color="white" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { paddingVertical: 16, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: 'white' },
  tabButton: { flex: 1, paddingBottom: 12, alignItems: 'center' },
  activeTabButton: { borderBottomWidth: 3, borderBottomColor: '#3B82F6' },
  tabText: { paddingTop: 12, fontSize: 16, color: 'gray', fontWeight: '600' },
  activeTabText: { color: '#3B82F6' },
  listContainer: { flex: 1, paddingTop: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 16, color: '#9CA3AF', marginTop: 16 },
  visitorCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 12, marginHorizontal: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 1 } },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconWrapper: { padding: 12, borderRadius: 999, marginRight: 16 },
  visitorName: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  visitorType: { fontSize: 14, color: '#6B7280', textTransform: 'capitalize' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  cardFooter: { borderTopWidth: 1, borderColor: '#F3F4F6', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cancelText: { color: '#EF4444', fontWeight: '600' },
  timeText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
});

export default ManageVisitorsScreen;
