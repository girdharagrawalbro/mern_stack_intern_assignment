import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const data = localStorage.getItem("user");
  if (data) {
    const { token } = JSON.parse(data);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
