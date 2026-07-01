import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { KeyRound, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { getAuthErrorMessage } from '../utils/apiError';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      const message = getAuthErrorMessage(err, 'Login failed. Please verify credentials.');
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    try {
      const res = await googleLogin(tokenResponse.access_token);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      const message = getAuthErrorMessage(err, 'Google authentication failed.');
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    addToast('Google Sign-in failed. Please try again.', 'error');
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090D16] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl glass-card relative z-10 border border-slate-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mb-4 shadow-lg shadow-indigo-500/20">
            <span className="text-2xl">⚒️</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome to InterviewForge</h2>
          <p className="text-sm text-slate-400 mt-2">Forge your way to top tier software companies</p>
        </div>

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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </Link>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/10 btn-transition mt-8"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#090D16] px-2 text-slate-500 font-semibold tracking-wider">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-2xl text-sm font-bold shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.26620003,9.7651794 C6.19875199,6.97756194 8.81484218,5 11.8901734,5 C13.7225434,5 15.3757225,5.69364162 16.6473988,6.84971098 L20.2312139,3.26589595 C18.0346821,1.24277457 15.1156069,0 11.8901734,0 C7.19075145,0 3.14450867,2.71676301 1.24277457,6.67052023 L5.26620003,9.7651794 Z"
              />
              <path
                fill="#4285F4"
                d="M23.4913295,12.2023121 C23.4913295,11.3352601 23.416185,10.5086705 23.2774566,9.71098266 L11.8901734,9.71098266 L11.8901734,14.3352601 L18.4046243,14.3352601 C18.1271676,15.8265896 17.283237,17.0867052 16.0231214,17.9306358 L20.0465434,21.0505794 C22.4046243,18.8786127 23.7687861,15.6531792 23.7687861,12.2023121 C23.7687861,12.2023121 23.4913295,12.2023121 23.4913295,12.2023121 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.26620003,14.2348206 L1.24277457,17.3294798 C3.14450867,21.283237 7.19075145,24 11.8901734,24 C15.1156069,24 18.0346821,22.7572254 20.0465434,20.734104 L16.0231214,17.6141604 C14.9248555,18.3410405 13.5260116,18.8208092 11.8901734,18.8208092 C8.81484218,18.8208092 6.19875199,16.8432473 5.26620003,14.2348206 Z"
              />
              <path
                fill="#34A853"
                d="M5.26620003,9.7651794 L1.24277457,6.67052023 C1.24277457,6.67052023 1.24277457,6.67052023 1.24277457,6.67052023 C0.439306358,8.34682081 0,10.2222543 0,12.2023121 C0,14.1823699 0.439306358,16.0578035 1.24277457,17.734104 L5.26620003,14.6394448 C5.26620003,14.6394448 5.26620003,14.6394448 5.26620003,14.6394448 C4.98872832,13.8763006 4.8150289,13.0560694 4.8150289,12.2023121 C4.8150289,11.3485549 4.98872832,10.5283237 5.26620003,9.7651794 Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          New developer?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            Forge Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
