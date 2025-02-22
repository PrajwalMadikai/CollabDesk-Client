'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentSuccess() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      setStatus('success');
    }
  }, [sessionId]);

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
          </>
        )}
        {status === 'error' && (
          <p className="text-red-500">There was an error processing your payment.</p>
        )}
      </div>
    </div>
  );
}