'use client';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import PaymentForm from "../../../../components/Landing Page/PaymentForm";
import { RootState } from "../../../../store/store";

const PaymentPage = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC) {
    throw new Error('No stripe public key');
  }
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC);

  const { planId } = useParams();

  const plans = useSelector((state: RootState) => state.plan.plans);

  const plan = plans.find((p) => p.id === planId);

  if (!plan) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm plan={plan} />
    </Elements>
  );
};

export default PaymentPage;