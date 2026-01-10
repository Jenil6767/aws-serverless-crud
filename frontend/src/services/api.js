/**
 * API service for making HTTP requests to the backend
 * @module services/api
 */

import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 400) {
        // Validation error
        const errorMessage = data.error || 'Validation failed';
        const details = data.details || [];
        return Promise.reject(new Error(details.length > 0 ? `${errorMessage}: ${details.join(', ')}` : errorMessage));
      } else if (status === 404) {
        return Promise.reject(new Error(data.error || 'Resource not found'));
      } else if (status === 409) {
        return Promise.reject(new Error(data.error || 'Email already exists'));
      } else if (status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
    
    return Promise.reject(error);
  }
);

/**
 * Fetches all users with pagination
 * @param {Object} params - Query parameters (limit, lastEvaluatedKey)
 * @returns {Promise<Object>} Response data containing users and pagination info
 */
export const fetchUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Gets a user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a user by ID
 * @param {string} id - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    throw error;
  }
};

export default api;

