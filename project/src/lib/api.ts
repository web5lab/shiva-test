import axios from 'axios';
import { encodeBase64, decodeBase64 } from './encoding';

// Create two axios instances - one for our backend, one for GitHub API
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
});

// Helper to set GitHub token
export const setGithubToken = (token: string) => {
  githubApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getUser = async () => {
  const { data } = await api.get('/api/user');
  // Set token for future GitHub API calls
  if (data.access_token) {
    setGithubToken(data.access_token);
  }
  return data;
};

// Re-export all functionality from modular files
export * from './auth';
export * from './repositories';
export * from './files';
export * from './fileChanges';
