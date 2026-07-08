import axios from "axios";
import {
  AUTH_UNAUTHENTICATED_EVENT,
  AUTH_UNAUTHORIZED_EVENT,
} from "../../features/Auth/utils/authEvents";
import { clearToken, getToken } from "../../features/Auth/utils/tokenStorage";




const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});


api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});




api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      clearToken();
      window.dispatchEvent(new Event(AUTH_UNAUTHENTICATED_EVENT));
    } else if (status === 403) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default api;
