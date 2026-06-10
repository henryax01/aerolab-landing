import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = async ({ method, endpoint, data, params, headers, token }) => {
  const response = await axios({
    method,
    url: `${API_URL}${endpoint}`,
    data,
    params,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  return response.data;
};

export default api;
