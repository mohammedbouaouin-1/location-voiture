import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function StripePaymentForm({ onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Avoids automatic redirect if possible
    });

    if (error) {
      toast.error(error.message || "Le paiement a échoué");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess();
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col pt-1">
      <div className="bg-white p-5 rounded-2xl border border-gray-100 mb-5 min-h-[150px]">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 mt-2 bg-[#111827] text-white rounded-[16px] font-black tracking-widest text-xs uppercase hover:bg-[#0D1321] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-black/10"
      >
        {isProcessing ? "Validation en cours..." : "Payer & Confirmer"}
        {!isProcessing && <FaArrowRight size={12} />}
      </button>
    </form>
  );
}
