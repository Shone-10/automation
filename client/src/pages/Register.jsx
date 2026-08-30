import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../store/authStore.jsx';

const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Business Administration',
  'Basic Sciences'
];

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    year: '',
    role: 'student', // default
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.role === 'student' && (!formData.studentId || !formData.year || !formData.department)) {
      setError('Please fill in Student ID, Department, and Year');
      return;
    }

    setLoading(true);

    const res = await register(formData);
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
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800/80 bg-[#0c111e]/90 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Branding header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center space-x-1 rounded-full bg-brand-950/40 border border-brand-900/60 px-3 py-1 text-[11px] font-semibold text-brand-400">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Registration Form</span>
          </span>
          
          <h2 className="text-2xl font-extrabold text-white mt-4 font-display">
            Create an account
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Register to submit facility complaints to college administration
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl border border-red-800/60 bg-red-950/20 p-4 text-xs font-semibold text-red-400 mb-5">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@college.edu"
                className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
              />
            </div>

            {/* Role Select (for easy local setup) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="admin">Administrator (Dev Mode)</option>
              </select>
            </div>
          </div>

          {/* Student Fields */}
          {formData.role === 'student' && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 p-4.5 space-y-4 animate-fade-in">
              <p className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Student Profile Fields</p>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Student ID / Roll No</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU10293"
                  className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Academic Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-sm text-slate-100 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/10 hover:from-brand-500 hover:to-brand-400 focus:outline-none disabled:opacity-50 transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
