'use client';
import { CreditCard, Shield } from 'lucide-react';
import { usePayment } from '../../hooks/useHandlePayment';
import { Plan } from '../../store/slice/planSlice';

const PaymentForm = ({ plan }: {plan:Plan}) => {
  const { loading, initiatePayment } = usePayment();

  const handlePayment = () => {
    initiatePayment(plan.paymentType, plan.amount);
  };

  const paymentType = plan.paymentType === 'base' ? 'Base' : 'Premium';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-2">{paymentType} Plan</h3>
          <p className="text-gray-400">Complete your subscription</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Subscription</span>
            <span className="text-2xl font-bold">
              ₹{plan.amount}
              <span className="text-sm text-gray-400">/month</span>
            </span>
          </div>
          <hr className="border-gray-600 my-4" />
          <ul className="space-y-3">
            <li className="flex items-center text-gray-300">
              <span className="mr-2">✔️</span>
              {plan.FolderNum} Folder slots
            </li>
            <li className="flex items-center text-gray-300">
              <span className="mr-2">✔️</span>
              {plan.WorkspaceNum} Workspace slots
            </li>
            <li className="flex items-center text-gray-300">
              <span className="mr-2">✔️</span>
              Text Editor access
            </li>
            <li className="flex items-center text-gray-300">
              <span className="mr-2">✔️</span>
              Whiteboard access
            </li>
          </ul>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="mr-2 text-blue-400" />
            <span className="text-gray-400">Secure payment with Stripe</span>
          </div>
          <div className="flex items-center justify-center text-sm text-gray-400 mb-6">
            <Shield className="w-4 h-4 mr-2" />
            <span>Your payment information is encrypted</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg font-semibold flex items-center justify-center"
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Redirecting to secure checkout...
            </div>
          ) : (
            'Proceed to Secure Checkout'
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;