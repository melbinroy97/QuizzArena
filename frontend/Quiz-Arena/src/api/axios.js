import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // IMPORTANT for httpOnly cookies
});

export default api;
