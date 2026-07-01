import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { KeyRound, ArrowLeft, Loader2 } from 'lucide-react';

export const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      addToast('Please enter password and confirm it', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`/api/auth/resetpassword/${token}`, { password });
      if (res.data.success) {
        addToast('Password reset successfully! Please sign in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Password reset failed. Invalid or expired token.', 'error');
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
          <h2 className="text-2xl font-bold tracking-tight text-white">Choose New Password</h2>
          <p className="text-sm text-slate-400 mt-2">Enter your new secure password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">New Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Confirm New Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                placeholder="••••••••"
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
              <span>Reset Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
