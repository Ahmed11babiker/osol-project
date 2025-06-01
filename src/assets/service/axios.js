import axios from 'axios';
import { getToken, redirectToLogin } from './auth';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
});


instance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error); 
  }
);


instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      redirectToLogin();
    } else if (error.response) {
      console.error('Error response:', error.response);
    }
    return Promise.reject(error);
  }
);

export default instance;