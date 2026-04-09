'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1a1f36',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#ef4444', iconColor: '#ef4444' },
  },
};

const CheckoutPage = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [data, setData] = useState({ name: '', phone: '', amount: '' });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    // ✅ Safe query param handling (client only)
    const params = new URLSearchParams(window.location.search);

    setData({
      name: params.get('name') || 'Guest Passenger',
      phone: params.get('phone') || '',
      amount: params.get('amount') || '0',
    });

    setChecking(false);
  }, [router]);

  if (checking) return null;

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#1a1f36]">
      <Elements stripe={stripePromise}>
        <CheckoutUI data={data} />
      </Elements>
    </div>
  );
};

const CheckoutUI = ({ data }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  /* ---------------- ADD THIS TO YOUR BILLING STATE ---------------- */
  const [billing, setBilling] = useState({
    name: data.name,
    email: '',
    address: '',
    city: '',
    zip: '',
  });

  useEffect(() => {
    if (!data.amount || data.amount === '0') return;
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: data.amount,
        email: billing.email,
        name: billing.name,
      }),
    })
      .then((res) => res.json())
      .then((res) => setClientSecret(res.clientSecret));
  }, [data.amount]);

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    // ✅ Validation
    if (!billing.name || !billing.email || !billing.address || !billing.city || !billing.zip) {
      alert('Please complete all passenger and billing address details.');
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        alert('Card element not found');
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billing.name,
            email: billing.email,
            address: {
              line1: billing.address,
              city: billing.city,
              postal_code: billing.zip,
              country: 'IN', // ✅ change dynamically if needed
            },
          },
        },
      });

      // ❌ Stripe error (card declined etc.)
      if (result.error) {
        alert(result.error.message);
        return;
      }

      // ✅ Success
      if (result.paymentIntent?.status === 'succeeded') {
        router.push('/confirmation');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false); // ✅ always runs
    }
  };
  return (
    
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* LEFT SIDE: AirfareBooker Itinerary Summary */}
      <div className="w-full md:w-[45%] bg-[#0F172A] p-8 md:p-16 flex flex-col justify-between text-white">
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white mb-12 flex items-center gap-2 text-sm font-medium transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Review Flights
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path
                  d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z"
                  opacity=".3"
                />
                <path d="M10,19L13,11L21,9L13,7L10,2L7,7L2,9L10,11L10,19Z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">AirfareBooker</span>
          </div>

          <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2">
            Amount Due
          </p>
          <h1 className="text-5xl font-extrabold mb-10 text-white flex items-baseline gap-1">
            <span className="text-2xl font-light text-slate-400">₹</span>
            {data.amount}
          </h1>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 uppercase">Passenger</p>
                <p className="font-medium">{data.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase">Ticket Type</p>
                <p className="font-medium">Economy Class</p>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 flex justify-between text-sm">
              <span className="text-slate-400">Airfare Subtotal</span>
              <span>₹{data.amount}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Taxes & Fees</span>
              <span className="text-emerald-400">Included</span>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full pt-10 text-slate-500">
          <p className="text-[10px] uppercase tracking-widest">Secure Checkout via Stripe API</p>
        </div>
      </div>

      {/* RIGHT SIDE: Payment Form */}
      <div className="w-full md:w-[55%] p-8 md:p-16 flex items-center justify-center bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2">Secure Payment</h2>
          <p className="text-slate-500 mb-8 text-sm">
            Enter your payment details to issue your e-ticket.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Receipt
              </label>
              <input
                type="email"
                placeholder="traveler@example.com"
                className="w-full p-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all shadow-sm"
                onChange={(e) => setBilling({ ...billing, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Card Information
              </label>
              <div className="p-4 border border-slate-200 rounded-lg shadow-sm bg-slate-50/30">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  defaultValue={data.name}
                  className="w-full p-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none shadow-sm"
                  onChange={(e) => setBilling({ ...billing, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Country
              </label>
              <select className="w-full p-3.5 border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-sky-500 outline-none appearance-none">
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>United Arab Emirates</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Billing Address
              </label>
              <div className="space-y-3">
                {/* Street Address */}
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full p-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none shadow-sm transition-all"
                  onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                />

                {/* City and Zip Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full p-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none shadow-sm transition-all"
                    onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="ZIP / Postal"
                    className="w-full p-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none shadow-sm transition-all"
                    onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || !stripe}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-sky-600/20 transform active:scale-[0.99] transition-all mt-4 flex justify-center items-center gap-3 text-lg"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                `Confirm & Book ₹${data.amount}`
              )}
            </button>

            <div className="flex items-center gap-2 justify-center mt-6">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.908-3.367 9.132-8 10.625C5.367 16.133 2 11.908 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                PCI-DSS Compliant 256-bit SSL Encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};;

export default CheckoutPage;
