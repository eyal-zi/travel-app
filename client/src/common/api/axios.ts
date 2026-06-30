import axios from "axios";
import {
  AUTH_UNAUTHENTICATED_EVENT,
  AUTH_UNAUTHORIZED_EVENT,
} from "../../features/Auth/utils/authEvents";
import { clearToken, getToken } from "../../features/Auth/utils/tokenStorage";

// No default Content-Type: axios infers it per request
// (application/json for plain objects, multipart/form-data with the
// correct boundary for FormData bodies).
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Attach the app JWT (when present) to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Translate auth failures into app-wide events the AuthProvider listens for:
// 401 (missing/invalid/expired token) -> sign the user out;
// 403 (authenticated but missing the required group) -> the Unauthorized page.
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
