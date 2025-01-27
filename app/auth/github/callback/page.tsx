'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { setUser } from '@/store/slice/userSlice';
import { useAppDispatch } from '@/store/store';

const GitHubCallback = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const dispath=useAppDispatch()

    useEffect(() => {
        const data = searchParams.get('data');
        const errorMessage = searchParams.get('error');

        const handleCallback = async () => {
            try {
                if (errorMessage) {
                    throw new Error(decodeURIComponent(errorMessage));
                }

                if (!data) {
                    throw new Error('No user data received');
                }

                const userData = JSON.parse(decodeURIComponent(data));
                 
                 dispath(setUser{name:userData.name,avatar:userData.avatar,email:userData.email,_id:userData._id})

                router.push('/');
            } catch (err: any) {
                console.error('Callback error:', err);
                setError(err.message);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } finally {
                setLoading(false);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                {loading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Processing GitHub authentication...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                        <p className="mt-2">Redirecting to login page...</p>
                    </div>
                ) : (
                    <div className="text-center text-green-600">
                        <p>Authentication successful!</p>
                        <p className="mt-2">Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GitHubCallback;
