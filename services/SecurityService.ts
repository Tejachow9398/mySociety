// File: services/SecurityService.ts
import { API_BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Visitor } from './VisitorService'; // We can reuse the Visitor type from the resident's service

export const getTodaysVisitors = async (): Promise<Visitor[]> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/security/visitors/today`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok){
        console.error(`API call failed with status: ${response.status}`);
         throw new Error("Failed to fetch visitors.");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching today's visitors:", error);
    return [];
  }
};

export const checkInVisitor = async (visitorId: string): Promise<Visitor | null> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/security/visitors/${visitorId}/checkin`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to check in visitor.");
    return response.json();
  } catch (error) {
    console.error("Error checking in visitor:", error);
    return null;
  }
};

export const checkOutVisitor = async (visitorId: string): Promise<Visitor | null> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/security/visitors/${visitorId}/checkout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to check out visitor.");
      return response.json();
    } catch (error) {
      console.error("Error checking out visitor:", error);
      return null;
    }
  };