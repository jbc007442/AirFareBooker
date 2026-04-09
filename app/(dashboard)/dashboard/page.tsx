'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      return toast.error('Please enter a valid amount');
    }

    setLoading(true);
    const id = toast.loading('Securing your fare...');

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) * 100 }),
      });

      const data = await res.json();
      if (!data.clientSecret) throw new Error('Could not initialize payment');

      const cardElement = elements?.getElement(CardElement);
      if (!stripe || !cardElement) throw new Error('Payment system offline');

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        toast.update(id, {
          render: result.error.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(id, {
          render: '✈️ Ticket Booked Successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        setAmount('');
        cardElement.clear();
      }
    } catch (err: any) {
      toast.update(id, {
        render: err.message || 'Payment Failed',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="w-full max-w-md space-y-6">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Total Fare (INR)
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
            ₹
          </span>
          <input
            type="number"
            placeholder="Enter amount"
            className="pl-10 pr-4 py-3 w-full border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg font-medium"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Payment Details
        </label>
        <div className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50 shadow-inner focus-within:border-blue-500 transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1e293b',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#94a3b8' },
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className={`w-full py-4 px-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98]
          ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100'}`}
      >
        {loading ? 'Processing Fare...' : `Confirm & Pay ₹${amount || '0'}`}
      </button>

      <div className="flex items-center justify-center gap-2">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Guaranteed Secure by
        </span>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
          alt="Stripe"
          className="h-4 opacity-50 hover:opacity-100 transition-opacity"
        />
      </div>
    </form>
  );
};

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) router.push('/login');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast.info('Session ended safely');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
      <ToastContainer position="bottom-center" theme="dark" />

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 p-10 border border-gray-50 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-50 rounded-full blur-3xl" />

        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4 rotate-3">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Air Care Booker</h1>
          <p className="text-slate-500 font-medium mt-2">Ready for your next adventure?</p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>

        <button
          onClick={handleLogout}
          className="mt-10 w-full text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors border-t border-slate-50 pt-6"
        >
          Sign Out
        </button>
      </div>

      <footer className="mt-8 flex flex-col items-center gap-2">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          © 2026 Air Care Booker Inc.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
