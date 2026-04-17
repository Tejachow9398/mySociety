
import { API_BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Defines the shape of a single visitor object from the backend
export interface Visitor {
  id: string;
  flatId: string;
  primaryDetail: string;
  visitorType: 'GUEST' | 'DELIVERY' | 'CAB' | 'SERVICE';
  status: 'EXPECTED' | 'LATE' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  checkInTime?: string; // These are ISO date strings from the backend
  checkOutTime?: string;
}

// Defines the shape of the full API response
interface VisitorAPIResponse {
  upcoming: Visitor[];
  history: Visitor[];
}

// This function calls the backend to get both lists
export const getMyVisitors = async (): Promise<VisitorAPIResponse> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error("No user token found");
    }

    const response = await fetch(`${API_BASE_URL}/visitors/my-visitors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch visitors from the server.");
    }

    return response.json();
  } catch (error) {
    console.error('Error in getMyVisitors:', error);
    // Return empty lists on failure so the app doesn't crash
    return { upcoming: [], history: [] };
  }
};
