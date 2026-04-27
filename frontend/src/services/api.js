import axios from "axios";
const api = axios.create({ 
  baseURL: process.env.REACT_APP_BACKEND_URL || "/api" 
});
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export default api;
