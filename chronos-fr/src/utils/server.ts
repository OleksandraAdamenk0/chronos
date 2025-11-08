import axios from 'axios';

const base = import.meta.env.VITE_API_URL;

console.log('base', base);

const server = axios.create({
  baseURL: base,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default server;