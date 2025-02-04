import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Replace with your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    // If the request URL includes "auth/login", skip redirection
    if (response && response.status === 401 && !config.url.includes("auth/login")) {
      localStorage.removeItem("access_token");
      window.location.href = "/"; // Redirect only for non-login endpoints
    }
    return Promise.reject(error);
  }
);

  

export default api;
