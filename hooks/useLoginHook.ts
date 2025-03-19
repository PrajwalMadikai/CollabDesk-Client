import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { baseUrl } from '../app/api/urlconfig';
import { ResponseStatus } from '../enums/responseStatus';
import getResponseStatus from '../lib/responseStatus';
import { googleLogin, loginEmail, resetPasswordFunc } from '../services/AuthApi';
import { setUser } from '../store/slice/userSlice';
import { AppDispatch } from '../store/store';

interface ValidationErrors {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  fullname: string;
  email: string;
  workSpaces: any[];
  isAuthenticated: boolean;
  planType: string | null;
  workspaceCount: number;
  folders: any[];
  folderCount: number;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const useEmailLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      email: '',
      password: '',
    };

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const login = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {

      const response = await loginEmail(email,password)

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        const userData = response.data.user;
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        dispatch(setUser({
          id: userData.id,
          fullname: userData.fullname,
          email: userData.email,
          workSpaces: userData.workSpaces,
          isAuthenticated: true,
          planType: userData.paymentDetail.paymentType,
          avatar:userData.avatar
        }));
        
        toast.success('Login successful!', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#166534',  
            color: '#d1fae5',    
            borderRadius: '8px',    
            padding: '12px',        
            fontSize: '14px',      
          },
        });

        setTimeout(() => {
          router.push('/');
        }, 2100);
      } else {
        console.error('Login failed:', response.data.message);
        toast.error(response.data.message || 'Unknown error', {
          position: 'top-right',
          duration: 3000,
        });
      }
    } catch (error: any) {
      handleLoginError(error, router);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    login,
  };
};

export const useGoogleLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    const idToken = credentialResponse.credential;

    try {
      const response = await googleLogin(idToken)
      
      const responseStatus = getResponseStatus(response.status);
      
      if (responseStatus === ResponseStatus.SUCCESS) {
        toast.success(response.data.message, {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#166534',  
            color: '#d1fae5',    
            borderRadius: '8px',    
            padding: '12px',        
            fontSize: '14px',      
          },
        });

        const userData = response.data.user;
        const accessToken = response.data.accessToken;
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
      
        dispatch(setUser({
          id: userData.id,
          fullname: userData.fullname,
          email: userData.email,
          workSpaces: userData.workSpaces,
          isAuthenticated: true,
          planType: userData.paymentDetail.paymentType,
          avatar:userData.avatar
        }));

        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error: any) {
      handleLoginError(error, router);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleGoogleLoginSuccess,
    isLoading,
  };
};

export const useGithubLogin = () => {
  const handleGitHubLogin = (mode: 'login' | 'signup') => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${baseUrl}/auth/github/callback`;
    const state = encodeURIComponent(JSON.stringify({ mode }));
    const scope = 'read:user user:email';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  };

  return {
    handleGitHubLogin,
  };
};

const handleLoginError = (error: any, router: any) => {
  const responseStatus = error.response?.status ? 
    getResponseStatus(error.response.status) : 
    ResponseStatus.ERROR;

  if (
    responseStatus === ResponseStatus.FORBIDDEN && 
    error.response?.data?.message === "Your account is blocked"
  ) {
    router.push('/');
    toast.error("Your account has been blocked", {
      duration: 2000,
      position: 'top-right',
      style: {
        background: '#e74c3c',
        color: '#fff',
      },
    });
  } else if (
    responseStatus === ResponseStatus.NOT_FOUND && 
    error.response?.data?.message === "No User Found!"
  ) {
    toast.error("User not found!", {
      position: 'top-right',
      duration: 3000,
    });
  } else if (error.response?.data?.message) {
    toast.error(error.response.data.message, {
      position: 'top-right',
      duration: 3000,
    });
  } else {
    toast.error("Error during login", {
      position: 'top-right',
      duration: 3000,
    });
  }
  
  console.error("Login error:", error.response?.data?.message || error.message);
};

export const useResetPasswordHook = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('resetEmail');

  if (!email) return null;

  const resetPassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const response = await resetPasswordFunc(email, newPassword);
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        toast.success('Password updated successfully!', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#166534',  
            color: '#d1fae5',    
            borderRadius: '8px',    
            padding: '12px',        
            fontSize: '14px',      
          },
        });

        localStorage.removeItem('resetEmail');

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, resetPassword };

}