import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../store/authStore.jsx';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(searchParams.get('admin') === 'true');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else navigate('/student/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      if (res.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-[#0c111e]/90 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center space-x-1 rounded-full bg-brand-950/40 border border-brand-900/60 px-3 py-1 text-[11px] font-semibold text-brand-400">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Secure JWT Encryption</span>
          </span>
          
          <h2 className="text-2xl font-extrabold text-white mt-4 font-display">
            Welcome back
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access the College Complaint Management System
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            onClick={() => {
              setIsAdmin(false);
              setError('');
            }}
            className={`flex-1 pb-3 text-center text-xs font-bold transition-all border-b-2 ${
              !isAdmin ? 'border-brand-500 text-brand-400 font-extrabold' : 'border-transparent text-slate-500'
            }`}
          >
            Student Portal
          </button>
          <button
            onClick={() => {
              setIsAdmin(true);
              setError('');
            }}
            className={`flex-1 pb-3 text-center text-xs font-bold transition-all border-b-2 ${
              isAdmin ? 'border-brand-500 text-brand-400 font-extrabold' : 'border-transparent text-slate-500'
            }`}
          >
            Admin Dashboard
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl border border-red-800/60 bg-red-950/20 p-4 text-xs font-semibold text-red-400 mb-5">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAdmin ? "admin@college.edu" : "student@college.edu"}
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/10 hover:from-brand-500 hover:to-brand-400 focus:outline-none disabled:opacity-50 transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              isAdmin ? 'Sign In as Administrator' : 'Sign In as Student'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            {isAdmin ? (
              <span>Admin account missing? Registration allows admin flag.</span>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
