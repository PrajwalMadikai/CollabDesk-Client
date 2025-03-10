import { ResponseStatus } from '@/enums/responseStatus';
import getResponseStatus from '@/lib/responseStatus';
import { emailCheck, emailVerify, sendVerificationEmailAPI } from '@/services/emailApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
export type VerificationStatus = 'loading' | 'success' | 'error';

export function useVerifyEmail(email: string | null, token: string | null) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!email || !token) {
        setStatus('error');
        setErrorMessage('Invalid email or token');
        return;
      }

      try {
        const response = await emailVerify(email,token)

        const responseStatus = getResponseStatus(response.status);

        if (responseStatus === ResponseStatus.SUCCESS) {
          setStatus('success');
        }
      } catch (error: any) {
        setStatus('error');
        const message = error.response?.data?.message || 'Verification failed';
        setErrorMessage(message);
      }
    };

    verifyEmail();
  }, [email, token]);

  return { status, errorMessage };
}

export function useSendVerificationEmail() {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
  
    const sendVerificationEmail = async (email: string) => {
      setLoading(true);
      setEmailSent(false);  
      try {
        const response = await sendVerificationEmailAPI(email)
        const responseStatus = getResponseStatus(response.status);
  
        if (responseStatus === ResponseStatus.SUCCESS) {
          setEmailSent(true);
          toast.success('Verification email has been sent', {
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
        }
      } catch (error: any) {
        console.log('rtt:',error);
        
        if(error.response.status==404&&error.response.data.message=='user email is not exists!')
        {
          toast.error(error.response.data.message,{
            position:'top-right'
          });
        }else{
        console.error('Error sending email:', error.response?.data );
        toast.error('Failed to send email',{
          position:'top-right'
        });
        }
      } finally {
        setLoading(false);
      }
    };
  
    return { loading, emailSent, sendVerificationEmail };
  }

 

export function useEmailCheck(email: string | null, token: string | null) {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
 
  useEffect(() => {
    const verifyEmail = async () => {
      if (email && token) {
        try {
          const response = await emailCheck(email,token)
          
          localStorage.setItem('resetEmail', response.data.userEmail);
          setStatus('success');
          toast.success('Email verified successfully!',{
            position:'top-right',
            style: {
              background: '#166534',  
              color: '#d1fae5',    
              borderRadius: '8px',    
              padding: '12px',        
              fontSize: '14px',      
            },
          });
          setTimeout(() => {
            router.push('/reset-password');
          }, 2000);
        } catch (error: any) {
          setStatus('error');
          const message = error.response?.data?.message || 'Verification failed';
          setErrorMessage(message);
          toast.error(message, {
            position: 'top-right'
          });
        }
      } else {
        setStatus('error');
        setErrorMessage('Missing email or verification token');
        toast.error('Missing email or verification token', {
          position: 'top-right'
        });
      }
    };
  
    verifyEmail();
  }, [email, token, router]);

  const redirectToEmailVerification = () => {
    router.push('/email-verification');
  };

  return {
    status,
    errorMessage,
    redirectToEmailVerification
  };
}