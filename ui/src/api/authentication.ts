// src/app/api/authentication.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { withApiErrorHandling, generateBackendUrl } from '@/api/apiUtils';

export const signupUser = withApiErrorHandling(async (
  email: string, password: string, first_name: string, middle_name: string,
  last_name: string, phone: string) => {
  console.log('signupUser called with email: ' + email + ', password: ' + password + ', first_name: ' + first_name + ', last_name: ' + last_name + ', phone: ' + phone);
  const response = await axios.post(generateBackendUrl(`signup`), {
    email,
    password,
    first_name,
    middle_name,
    last_name,
    phone
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  localStorage.setItem('accessToken', response.data.access_token);
  localStorage.setItem('refreshToken', response.data.refresh_token);
  return response.data;
});

export const signinUser = withApiErrorHandling(async (email: string, password: string) => {
  const response = await axios.post(generateBackendUrl(`signin`), {
    email,
    password
  });
  localStorage.setItem('accessToken', response.data.access_token);
  localStorage.setItem('refreshToken', response.data.refresh_token);
  return response.data.user;
});

export const isAuthenticated = withApiErrorHandling(async () => {
  try {
    let accessToken = localStorage.getItem('accessToken') || '';
    if (!accessToken) {
      const refreshToken = localStorage.getItem('refreshToken') || '';
      if (refreshToken) {
        // Decode the refresh token to check its expiration
        const decodedRefreshToken = jwtDecode(refreshToken);
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decodedRefreshToken.exp && decodedRefreshToken.exp < currentTime) {
          // If the refresh token is expired
          console.log('Refresh token is expired');
          return false;
        }
        return true;
      } else {
        return false;
      }
    }

    // Now, verify the new or existing access token with the backend
    const response = await axios.post(generateBackendUrl('refresh_token'), {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    localStorage.setItem('refreshToken', response.data.refresh_token);
    localStorage.setItem('accessToken', response.data.access_token);
    return true;
  } catch (error) {
    console.error('Error authenticating user tokens:', error);
    throw error;
  }
});
