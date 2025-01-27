"use client";
import axios from 'axios';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (email && token) {
        try {
          const response = await axios.post('http://localhost:5713/verify-email', {
            email,
            token
          });
          
          setStatus('success');
          toast.success('Email verified successfully!');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } catch (error: any) {
          setStatus('error');
          const message = error.response?.data?.message || 'Verification failed';
          setErrorMessage(message);
          toast.error(message);
        }
      }
    };
  
    verifyEmail();
  }, [email, token]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#020817] text-white p-4">
      {/* Main Container */}
      <div className="w-full max-w-3xl mx-auto text-center space-y-12">
        {/* Illustration */}
        <div className="relative w-full max-w-lg mx-auto">
          <svg className="w-full h-auto" viewBox="0 0 786 466" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M457.722 465H39.2777C17.5862 465 0 447.414 0 425.722V39.2777C0 17.5862 17.5862 0 39.2777 0H457.722C479.414 0 497 17.5862 497 39.2777V425.722C497 447.414 479.414 465 457.722 465Z" fill="#1E293B"/>
            <rect x="63" y="127" width="371" height="85" rx="8" fill="#334155"/>
            <rect x="63" y="241" width="371" height="85" rx="8" fill="#334155"/>
            <circle cx="107" cy="73" r="20" fill="#334155"/>
            <path d="M785.722 425H367.278C345.586 425 328 407.414 328 385.722V129.278C328 107.586 345.586 90 367.278 90H785.722C807.414 90 825 107.586 825 129.278V385.722C825 407.414 807.414 425 785.722 425Z" fill="#1E293B"/>
            <rect x="391" y="217" width="371" height="85" rx="8" fill="#334155"/>
            <circle cx="435" cy="163" r="20" fill="#334155"/>
            {status === 'loading' && (
              <path className="animate-spin origin-center" d="M556 90L696 230M696 90L556 230" stroke="#60A5FA" strokeWidth="24" strokeLinecap="round"/>
            )}
            {status === 'success' && (
              <path d="M556 160L616 220L696 140" stroke="#4ADE80" strokeWidth="24" strokeLinecap="round"/>
            )}
            {status === 'error' && (
              <path d="M556 90L696 230M696 90L556 230" stroke="#EF4444" strokeWidth="24" strokeLinecap="round"/>
            )}
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {status === 'loading' && 'Verifying your email'}
            {status === 'success' && 'Email verified!'}
            {status === 'error' && 'Verification failed'}
          </h1>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            {status === 'loading' && 'Please wait while we verify your email address...'}
            {status === 'success' && 'Your email has been successfully verified. Redirecting to login...'}
            {status === 'error' && errorMessage}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          {status === 'loading' && (
            <button 
              disabled
              className="group px-6 py-3 rounded-lg bg-blue-600/50 flex items-center gap-2 min-w-[200px]"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying user
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {status === 'error' && (
            <button
              onClick={() => router.push('/login')}
              className="group px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 min-w-[200px]"
            >
              Return to login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    </div>
  );
}