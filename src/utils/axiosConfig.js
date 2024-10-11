import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://3.39.251.48:8080",
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use((config) => {
  const jwtToken = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
  if (jwtToken) {
    config.headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const event = new CustomEvent("unauthorized", { detail: error });
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;