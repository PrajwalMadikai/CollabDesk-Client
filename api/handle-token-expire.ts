import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5713",
  withCredentials: true,
});

const refreshAccess = async () => {
  try {
    const response = await axios.post("http://localhost:5713/refreshtoken", {
      withCredentials: true, 
    });
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    localStorage.removeItem("accessToken");
    window.location.href = "/login";  
    return null;
  }
};

API.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response, 
  async (error) => {
    if (error.response?.status === 401) {
      const newAccessToken = await refreshAccess();
      if (newAccessToken) {
        // Retry the request with the new access token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return API.request(error.config); // Retry the failed request
      }
    }
    return Promise.reject(error);  
  }
);

export default API;
