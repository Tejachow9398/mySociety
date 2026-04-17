import { API_BASE_URL } from '../constants/api';

interface UserProfile {
  fullName: string;
  role: string;
  photoUrl: string;
  phone?: string;
  email?: string;
  vehicles?: { type: string; model: string; number: string }[];
  emergencyContact?: { name: string; phone: string };
  flats?: any[]; // For Owner
  primaryResidenceFlatId?: string;
  flat?: any;    // For Tenant
  moveInDate?: string; // For Tenant
}

interface ErrorResponse {
  error: string;
}

// This function now takes the token as an argument
export const getUserProfile = async (token: string): Promise<UserProfile | ErrorResponse> => {
  try {
    if (!token) {
      return { error: "No token provided." };
    }
    const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
      headers: {
        // Send the token in the Authorization header
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { error: 'Could not connect to the server to fetch profile.' };
  }
};