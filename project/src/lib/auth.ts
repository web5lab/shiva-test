import { api } from './apiClient';

export async function getUser() {
  const { data } = await api.get('/api/user');
  return data;
}

export async function logout() {
  await api.get('/api/logout');
}