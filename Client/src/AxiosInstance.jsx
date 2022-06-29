import axios from 'axios';

function AxiosInstance(secondaryBaseURL = '') {
  const baseURL = 'https://taskshepherd.herokuapp.com/api'

  const axiosInstance = axios.create({
    baseURL: baseURL + secondaryBaseURL,
  });

  return axiosInstance;
}

export default AxiosInstance;
