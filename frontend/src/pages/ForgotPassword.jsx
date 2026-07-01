import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { getAuthErrorMessage } from '../utils/apiError';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

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
        addToast(res.data.message || 'Password reset link sent!', 'success');
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || getAuthErrorMessage(err, 'Failed to request reset.'), 'error');
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
          <p className="text-sm text-slate-400 mt-2">
            Enter your account email to receive a password reset link.
          </p>
        </div>

        {!submitted ? (
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
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm leading-relaxed text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="text-emerald-400" size={24} />
              </div>
              <p className="font-bold text-base mb-2">Check your email</p>
              If an account is registered with <strong>{email}</strong>, you will receive an email shortly containing a link to reset your password.
              
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 leading-normal text-left">
                <strong>Local Development Note:</strong><br />
                Real emails are not sent unless SMTP is configured. You can find the reset URL in the **backend terminal console** logs.
              </div>
            </div>

            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 border border-slate-800 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all duration-200 text-center"
            >
              <span>Return to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
