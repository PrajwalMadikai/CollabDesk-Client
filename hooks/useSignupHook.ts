import { baseUrl } from '@/app/api/urlconfig';
import { ResponseStatus } from '@/enums/responseStatus';
import getResponseStatus from '@/lib/responseStatus';
import { googleSignUp, signupEmail } from '@/services/AuthApi';
import { setUser } from '@/store/slice/userSlice';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuthSignup = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<SignupCredentials>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const updateField = (field: keyof SignupCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors: ValidationErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
      isValid = false;
    }
  
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
      isValid = false;
    }
  
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number.';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character.';
      isValid = false;
    }
  
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required.';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
    

      const response=await signupEmail(formData.fullName,formData.email,formData.password)
      
      const responseStatus = getResponseStatus(response.status);
      
      if (responseStatus === ResponseStatus.CREATED) {
        toast.success('Email verification sented!',{
                duration:2000,
                position:'top-right',
                style: {
                  background: '#166534',  
                  color: '#d1fae5',    
                  borderRadius: '8px',    
                  padding: '12px',        
                  fontSize: '14px',      
                },
              });
        setIsLoading(false);
        router.push('/email-sent');
        
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (error: any) {
      const responseStatus = error.response?.status ? 
        getResponseStatus(error.response.status) : 
        ResponseStatus.ERROR;
        
      if (responseStatus === ResponseStatus.BAD_REQUEST) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
          },
        });
      } else {
        toast.error('Signup failed. Please try again.', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignup = async (credentialResponse: any) => {
    setIsLoading(true);
    const idToken = credentialResponse.credential;
    
    try {
      const response = await googleSignUp(idToken)
      
      const userData = response.data.user;
      const accessToken = response.data.accessToken;
      
      const responseStatus = getResponseStatus(response.status);
      
      if (responseStatus === ResponseStatus.CREATED) {
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('accessToken', accessToken);
          dispatch(setUser({
            id: userData.id,
            fullname: userData.fullname,
            email: userData.email,
            workSpaces: userData.workSpaces,
            isAuthenticated: true,
            planType: null,
            avatar:userData.avatar
          }));
        }
        
        toast.success('User registered successfully!', {
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
        }, 2000);
      }
    } catch (error: any) {
      const responseStatus = error.response?.status ? 
        getResponseStatus(error.response.status) : 
        ResponseStatus.ERROR;
        
      const errorMessage = responseStatus === ResponseStatus.NOT_FOUND
        ? 'Account already exists'
        : 'Google signup failed. Please try again.';
          
      toast.error(errorMessage, {
        duration: 2000,
        position: 'top-right',
        style: { background: '#f44336', color: '#fff' },
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGithubSignup = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${baseUrl}/auth/github/callback`;
    const state = encodeURIComponent(JSON.stringify({ mode: 'signup' }));
    const scope = 'read:user user:email';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  };
  
  return {
    formData,
    errors,
    isLoading,
    updateField,
    handleSignup,
    handleGoogleSignup,
    handleGithubSignup
  };
};