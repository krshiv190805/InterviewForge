import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulatedToken, setSimulatedToken] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgotpassword', { email });
      if (res.data.success) {
        addToast('Password reset token generated!', 'success');
        if (res.data.resetToken) {
          setSimulatedToken(res.data.resetToken);
        }
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to request reset.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090D16] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl glass-card relative z-10 border border-slate-800">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
          <p className="text-sm text-slate-400 mt-2">Enter your email to request a simulated reset token</p>
        </div>

        {!simulatedToken ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  placeholder="developer@interviewforge.ai"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/10 btn-transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <span>Request Reset Code</span>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm leading-relaxed">
              <p className="font-bold mb-1">📬 Local Simulation Successful!</p>
              An email containing your password reset link was simulated. Here is the reset token:
              <div className="mt-3 p-3 font-mono bg-slate-950 rounded-xl text-center select-all border border-slate-800 text-xs break-all text-white">
                {simulatedToken}
              </div>
            </div>

            <button
              onClick={() => navigate(`/reset-password/${simulatedToken}`)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-600/10 btn-transition"
            >
              <KeyRound size={16} />
              <span>Go to Password Reset Page</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
