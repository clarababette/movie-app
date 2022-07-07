import axios from 'axios';
import { useContext } from 'react';
import UserContext from './UserContext';

function AxiosInstance() {
  const { user, setUser } = useContext(UserContext);

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
      Authorization: user?.accessToken,
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
      if (originalConfig.url !== '/api/login' && err.response) {
        if ((err.response.status == 401 || err.response.status == 403) && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const refresh = await axiosInstance.post('/api/refresh', {
              refreshToken: JSON.parse(localStorage.getItem("user"))?.refreshToken,
            });
            const { accessToken } = refresh.data;
            setUser({ ...user, accessToken: accessToken });
            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      } 
      return Promise.reject(err)
    }
  )

  return axiosInstance;
}

export default AxiosInstance;
