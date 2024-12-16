import axios from 'axios';

// Create axios instance for our backend API
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});
