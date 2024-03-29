import { useContext } from 'react';
import UserContext from './UserContext';
import axios from 'axios';

function AxiosInstance() {
  let user = JSON.parse(localStorage.getItem("user")) || undefined;

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
      'Access-Control-Allow-Origin': import.meta.env.VITE_SERVER_URL,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    }, async (err) => {
      const originalConfig = err.config;
      console.log(originalConfig)
      if (originalConfig.url !== '/api/login' && err.response) {
        if ((err.response.status == 401 || err.response.status == 403) && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const refresh = await axiosInstance.post('/api/refresh', {
              refreshToken: user.refreshToken,
            });
            const { accessToken } = refresh.data;
            user = { ...user, accessToken: accessToken },
            
              localStorage.setItem("user", JSON.stringify({ ...user, accessToken: accessToken }))
            originalConfig.headers.Authorization = `Bearer ${accessToken}`
            return axiosInstance(originalConfig);
          } catch (_error) {
            localStorage.clear()
            return Promise.reject(_error);
          }
        }
      } 
      localStorage.clear()
      return Promise.reject(err)
    }
  )

  return axiosInstance;
}

export default AxiosInstance;
