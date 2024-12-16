import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

export const getUser = async () => {
  const { data } = await api.get('/api/user');
  return data;
};

export const getRepositories = async () => {
  const { data } = await api.get('/api/repos');
  return data;
};

export const logout = async () => {
  await api.get('/api/logout');
};

export const getRepositoryContents = async (owner: string, repo: string, path: string = '') => {
  const { data } = await api.get(`/api/repos/${owner}/${repo}/contents/${path}`);
  return data;
};

export const getFileContent = async (url: string) => {
  const { data } = await api.get(url);
  return data;
};

export const updateFile = async (owner: string, repo: string, path: string, content: string, sha: string) => {
  const { data } = await api.put(`/api/repos/${owner}/${repo}/contents/${path}`, {
    content: Buffer.from(content).toString('base64'),
    message: `Update ${path}`,
    sha
  });
  return data;
};