  import axios from "axios";

  const API = axios.create({
    baseURL: "http://localhost:5713",
    withCredentials: true,
  });

  const ADMIN_API=axios.create({
    baseURL:'http://localhost:5713/admin',
    withCredentials:true
  })
  const refreshAccess = async (isAdmin=false) => {
    try {
      const endPoint=isAdmin?'/admin/refreshToken' : '/refreshtoken'
      const response = await axios.post(`http://localhost:5713${endPoint}`, {
        withCredentials: true, 
      });
      const newAccessToken = response.data.accessToken;
      localStorage.setItem(isAdmin ? "adminAccessToken" : "accessToken", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Refresh token failed:", error);
      localStorage.removeItem(isAdmin ? "adminAccessToken" : "accessToken");
      window.location.href = isAdmin?"/admin/login":"/login";  
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

  // Interceptors for admin API
  ADMIN_API.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("adminAccessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ADMIN_API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newAccessToken = await refreshAccess(true);
      if (newAccessToken) {
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return ADMIN_API.request(error.config); 
      }
    }
    return Promise.reject(error);
  }
);


  export default {API,ADMIN_API};
