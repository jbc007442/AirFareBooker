'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Send, ShieldCheck, DollarSign} from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: '', // 👈 ADD THIS
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    amount: '',
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert('Email sent successfully ✅');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ShieldCheck size={80} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Secure Payment Link</h2>
          <p className="text-slate-400 text-sm italic">
            Generate a professional payment request for your client.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="Business Name"
              name="businessName"
              icon={<ShieldCheck size={18} />}
              placeholder="Reservation Desk"
              onChange={handleChange}
            />
            
            <InputGroup
              label="First Name"
              name="firstName"
              icon={<User size={18} />}
              placeholder="John"
              onChange={handleChange}
            />
            <InputGroup
              label="Last Name"
              name="lastName"
              icon={<User size={18} />}
              placeholder="Doe"
              onChange={handleChange}
            />
          </div>

          <InputGroup
            label="Email Address"
            name="email"
            type="email"
            icon={<Mail size={18} />}
            placeholder="john@example.com"
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="Phone Number"
              name="phone"
              icon={<Phone size={18} />}
              placeholder="+91 98765 43210"
              onChange={handleChange}
            />
            <InputGroup
              label="Amount"
              name="amount"
              icon={<DollarSign size={18} />}
              placeholder="5,000"
              onChange={handleChange}
            />
          </div>

          <button
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-200 ${
              loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300'
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                Send Payment Link
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
            Verified Secure Transaction
          </p>
        </form>
      </div>
    </div>
  );
};

/* --- Reusable Input Component --- */
const InputGroup = ({ label, name, icon, placeholder, onChange, type = 'text' }: any) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="group relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
        <input
          required
          type={type}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all text-slate-700 placeholder:text-slate-300 font-medium"
        />
      </div>
    </div>
  );
};

export default Page;
