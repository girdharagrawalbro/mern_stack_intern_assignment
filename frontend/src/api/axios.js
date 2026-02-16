import axios from "axios";

const API = axios.create({
  baseURL: "/api",
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
