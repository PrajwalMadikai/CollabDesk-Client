import axios from "axios";
import { clearUser } from "../../store/slice/userSlice";
import { store } from "../../store/store";
import { baseUrl } from "./urlconfig";

const API = axios.create({
      baseURL: `${baseUrl}`,
      withCredentials: true
});

const ADMIN_API=axios.create({
      baseURL:`${baseUrl}/admin`,
      withCredentials:true,
})

const refreshAccess = async (isAdmin = false) => {
      try {
          const endPoint = isAdmin ? '/admin/refreshtoken' : '/refreshtoken';
          
          console.log('Attempting to refresh token...');
          const response = await API.post(endPoint);  
          
          console.log('Refresh response:', response.data);
  
          if (response.data?.accessToken) {
              const newAccessToken = response.data.accessToken;
              localStorage.setItem(
                  isAdmin ? "adminAccessToken" : "accessToken", 
                  newAccessToken
              );
              return newAccessToken;
          }
          
          throw new Error('No access token received');
      } catch (error: unknown) {
        if(axios.isAxiosError(error)){
        if ( error.response?.status === 403) {
            localStorage.removeItem(isAdmin ? "adminAccessToken" : "accessToken");
            window.location.href = isAdmin ? "/admin/login" : "/login";
        }
          console.error("Refresh token failed:", {
              status: error.response?.status,
              message: error.response?.data?.message,
              error
          });
        }
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
          const originalRequest = error.config;
          
          // Don't retry if already retried or if it's the refresh token endpoint
          if (originalRequest._retry || originalRequest.url?.includes('refreshtoken')) {
            return Promise.reject(error);
          }
          
          // if (error.response?.status === 401) {
          //   return Promise.reject(error);
          // }
  
          //Blocked user
          if (error.response?.status === 403 && error.response?.data?.message === "Your account is blocked") {
              store.dispatch(clearUser());
              localStorage.clear();
              window.location.href = "/blocked";
              return Promise.reject(error);
          }
          
          // Only try refresh on 401 errors
          if (error.response?.status === 401) {
              originalRequest._retry = true;
              try {
                  const newAccessToken = await refreshAccess();
                  if (newAccessToken) {
                      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                      return API(originalRequest);
                  }
              } catch (refreshError) {
                  return Promise.reject(refreshError);
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


    export { ADMIN_API, API };

