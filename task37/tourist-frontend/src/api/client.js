import axios from 'axios';

// Set VITE_API_URL for production. On a private LAN, use the device's host
// instead of 127.0.0.1 so a phone can reach the development API.
const browserHost = window.location.hostname;
const isPrivateHost = browserHost === 'localhost'
  || browserHost === '127.0.0.1'
  || browserHost.startsWith('192.168.')
  || browserHost.startsWith('10.')
  || browserHost.startsWith('172.');
const localApiUrl = `${window.location.protocol}//${browserHost}:8000/api`;
const API_BASE_URL = import.meta.env.VITE_API_URL
  || (isPrivateHost ? localApiUrl : 'http://127.0.0.1:8000/api');

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default client;
