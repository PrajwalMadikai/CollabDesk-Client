'use client';
import { useHandlePayment } from '@/hooks/Api call hook/useHandlePayment';
import { RootState } from '@/store/store';
import { CheckCircle2 as Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [isPaymentStored, setIsPaymentStored] = useState(false);
    const user = useSelector((state: RootState) => state.user);

    const { status, sessionDetails } = useHandlePayment(sessionId, isPaymentStored, user);

    useEffect(() => {
        if (status === 'success') {
            setIsPaymentStored(true);
        }
    }, [status]);

    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
            <div className="w-full bg-gray-900/50 backdrop-blur-sm shadow-2xl overflow-hidden">
                <div className="flex min-h-screen flex-col md:flex-row">
                    <div className="w-full p-8 flex items-center justify-center bg-gradient-to-br">
                        {status === 'loading' ? (
                            <div className="relative">
                                <div className="w-32 h-32 border-4 border-blue-500/20 rounded-full animate-spin">
                                    <div className="w-32 h-32 border-4 border-t-blue-500 rounded-full absolute top-0 left-0"></div>
                                </div>
                                <Loader2 className="w-12 h-12 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                        ) : status === 'success' ? (
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                                        <Loader2 className="w-16 h-16 text-green-500" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-red-500">
                                <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M15 9l-6 6M9 9l6 6" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="w-full p-8 flex flex-col justify-center">
                        {status === 'loading' ? (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    Processing Payment
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    Please wait while we confirm your payment details...
                                </p>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-progress rounded-full"></div>
                                </div>
                            </>
                        ) : status === 'success' ? (
                            <>
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    Payment Successful!
                                </h2>
                                <p className="text-gray-400 mb-8">
                                    Thank you for your subscription. Your account has been upgraded and you now have access to all premium features.
                                </p>
                                <Link href="/" className="inline-block">
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                                        Return to Dashboard
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-red-500 mb-4">
                                    Payment Failed
                                </h2>
                                <p className="text-gray-400 mb-8">
                                    There was an error processing your payment. Please try again or contact support if the problem persists.
                                </p>
                                <Link href="/" className="inline-block">
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                        Try Again
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}