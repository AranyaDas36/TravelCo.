import axios from 'axios';

const API_URL = 'http://localhost:5001/api';  // Change to your backend URL

const api = axios.create({
  baseURL: API_URL,
});

export const createPackage = async (packageData) => {
  try {
    const response = await api.post('/packages', packageData);  // Use the 'api' instance here
    return response.data;
  } catch (error) {
    console.error('Error creating package', error);
    throw error;
  }
};

export const getPackages = () => api.get('/packages');
export const getPackageDetails = (id) => api.get(`/packages/${id}`);
export const postBooking = (data) => api.post('/booking', data);
export const postLogin = (data) => api.post('/auth/login', data);
export const postRegister = (data) => api.post('/auth/register', data);

// OTP-related methods
export const postRequestOTP = (data) => api.post('/auth/request-otp', data); // Request OTP
export const postVerifyOTP = (data) => api.post('/auth/verify-otp', data);   // Verify OTP

const token = localStorage.getItem('authToken');
if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export default api;
