// src/app/api/apiUtils.ts
import axios, { AxiosError } from 'axios';
import { ApiError } from '@/types/apiError';
import dotenv from 'dotenv';


// This is a higher-order function that takes an API call function and returns a new function that wraps the original one with error handling.
export function withApiErrorHandling<T, Args extends any[]>(apiCall: (...args: Args) => Promise<T>): (...args: Args) => Promise<T> {
  return async (...args: Args) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      console.log('Error:', error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          console.error('Network error, please try again.');
          throw { code: 'NETWORK_ERROR', message: 'Network error, please try again.' } as ApiError;
        }

        const serverError = error.response?.data as ApiError;
        if (serverError && serverError.message) {
          console.error('API call failed:', serverError.message);
          throw serverError;
        }
      }
      console.error('Unexpected error:', error);
      throw { code: 'GENERIC_ERROR', message: 'Unexpected error occurred.' } as ApiError;
    }
  };
}

export function generateBackendUrl(backendRoute: string): string {
  const backend_mode = process.env.NEXT_PUBLIC_BACKEND_MODE;
  if (backend_mode === 'development') {
    return `http://localhost:7071/api/${backendRoute}`;
  } else {
    return `http://sunuxu-test-functions.azurewebsites.net/api/${backendRoute}?${process.env.NEXT_PUBLIC_FUNCTION_APP_HOST_KEY}`;
  }
}
