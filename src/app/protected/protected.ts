
import axios from 'axios';
import Cookies from 'js-cookie';
import { installAuthInterceptors } from './auth-interceptors';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
  },
});

installAuthInterceptors(api, Cookies);
export default api;
