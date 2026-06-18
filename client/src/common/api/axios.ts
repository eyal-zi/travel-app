import axios from "axios";

// No default Content-Type: axios infers it per request
// (application/json for plain objects, multipart/form-data with the
// correct boundary for FormData bodies).
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export default api;
