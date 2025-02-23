'use client';
import { API } from '@/app/api/handle-token-expire';
import { RootState } from '@/store/store';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function PaymentSuccess() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [isPaymentStored, setIsPaymentStored] = useState(false);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [sessionDetails, setSessionDetails] = useState<any>(null);
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        console.log("useEffect triggered with sessionId:", sessionId);

        const fetchSessionDetails = async () => {
            try {
                console.log("Fetching session details for sessionId:", sessionId);
                const response = await fetch(`/api/payment/session?session_id=${sessionId}`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.error);

                console.log("Session details fetched successfully:", data.session);
                setSessionDetails(data.session);
                setStatus('success');
                await handlePaymentStore(data.session);
            } catch (error) {
                console.error("Error fetching session details:", error);
                setStatus('error');
            }
        };

        if (sessionId && !isPaymentStored) {
            fetchSessionDetails();
        }
    }, [sessionId, isPaymentStored]);

    const handlePaymentStore = async (sessionDetails: any) => {
        if (!sessionDetails || isPaymentStored) return;

        const userData = {
            email: user.email,
            paymentType: sessionDetails.metadata?.planType,
            amount: sessionDetails.amount_total,
        };

        try {
            const response = await API.post(
                '/payment-details',
                { userData },
                { withCredentials: true }
            );
            console.log("Payment details stored successfully:", response.data);
            setIsPaymentStored(true); // Mark as completed
        } catch (error) {
            console.error("Error storing payment details:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
                {status === 'loading' && <p>Processing your payment...</p>}
                {status === 'success' && (
                    <>
                        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                        <p className="text-gray-400">
                            Thank you for your subscription. You can now access all the features of your plan.
                        </p>
                        <Link href="/">
                            <button>Redirect to Home</button>
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <p className="text-red-500">There was an error processing your payment.</p>
                )}
            </div>
        </div>
    );
}