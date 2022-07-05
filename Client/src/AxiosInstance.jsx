import axios from 'axios';
import { useContext } from 'react';
import UserContext from './UserContext';

function AxiosInstance() {
  const { user } = useContext(UserContext);

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: user?.accessToken,
      'Access-Control-Allow-Origin': import.meta.env.VITE_SERVER_URL,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  return axiosInstance;
}

export default AxiosInstance;
