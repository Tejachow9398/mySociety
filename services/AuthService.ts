import { API_BASE_URL } from '../constants/api';

// Define the shape of our expected API responses
interface CheckPhoneResponse {
  isRegistered: boolean;
  message: string;
  error?: string;
}

interface LoginResponse {
  message: string;
  userId: string;
  name: string;
  role: string;
  token?: string; // Add this optional token property
  error?: string;
}

interface ErrorResponse {
  error: string;
}

/**
 * Checks if a phone number is registered with the backend.
 * @param {string} phone The user's 10-digit phone number.
 * @returns {Promise<CheckPhoneResponse>} The JSON response from the server.
 */
export const checkPhoneRegistration = async (phone: string): Promise<CheckPhoneResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phone }), // Assuming Indian numbers
    });
    return response.json();
  } catch (error) {
    console.error('Error checking phone registration:', error);
    return { isRegistered: false, message: '', error: 'Could not connect to the server.' };
  }
};

/**
 * Logs in a user (either resident or staff).
 * @param {object} credentials Can be { idToken } for residents or { username, password } for staff.
 * @returns {Promise<LoginResponse | ErrorResponse>} The JSON response from the server.
 */
export const loginUser = async (credentials: object): Promise<LoginResponse | ErrorResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  } catch (error) {
    console.error('Error during login:', error);
    return { error: 'Could not connect to the server.' };
  }
};