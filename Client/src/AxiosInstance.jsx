import axios from 'axios';
import { useContext } from 'react';
import UserContext from './UserContext';

function AxiosInstance() {
  const { user } = useContext(UserContext);

  const axiosInstance = axios.create({
    baseURL: 'https://clarababette-movies.herokuapp.com/',
    headers: {
      Authorization: user?.accessToken,
      'Access-Control-Allow-Origin': 'https://clarababette-movies.herokuapp.com/',
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  return axiosInstance;
}

export default AxiosInstance;
