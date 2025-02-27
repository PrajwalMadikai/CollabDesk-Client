import { API } from '@/app/api/handle-token-expire';
import { setPlanType } from '@/store/slice/userSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export function useHandlePayment(sessionId: string | null, isPaymentStored: boolean, user: any) {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [sessionDetails, setSessionDetails] = useState<any>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;

        const fetchSessionDetails = async () => {
            try {
                if (!sessionId || isPaymentStored) return;

                const response = await fetch(`/api/payment/session?session_id=${sessionId}`);
                const data = await response.json();

                if (!isMounted) return;
                if (!response.ok) throw new Error(data.error);

                console.log("Session details fetched successfully:", data.session);
                setSessionDetails(data.session);
                setStatus('success');

                await handlePaymentStore(data.session);
            } catch (error) {
                if (!isMounted) return;
                console.error("Error fetching session details:", error);
                setStatus('error');
            }
        };

        fetchSessionDetails();

        return () => {
            isMounted = false;
        };
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

            dispatch(setPlanType(userData.paymentType));
        } catch (error) {
            console.error("Error storing payment details:", error);
        }
    };

    return { status, sessionDetails };
}