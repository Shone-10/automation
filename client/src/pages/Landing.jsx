import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, MessageSquare, Clock } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-between text-slate-100">
      {/* Navbar */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 font-display text-lg font-bold text-white shadow-md">
            C
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Campus<span className="bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">Voice</span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="rounded-xl border border-slate-800 bg-slate-900/40 px-4.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-brand-600 px-4.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-500 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-xl text-center lg:text-left space-y-6">
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-brand-950/45 px-3 py-1 text-xs font-semibold text-brand-400 border border-brand-800/40">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Assisted Issue Classifier</span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Simplify Campus Issues,{' '}
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-cyan-400 bg-clip-text text-transparent">
              Elevate Student Voice.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Report infrastructure, IT, hostel, cleanliness, and transportation problems directly to administration. Track complaint progress, receive real-time updates, and participate in resolving college issues.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto text-center rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/10 hover:bg-brand-500 transition-colors"
            >
              Get Started (Student Portal)
            </Link>
            <Link
              to="/login?admin=true"
              className="w-full sm:w-auto text-center rounded-xl border border-slate-800 bg-slate-900/40 px-8 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-900 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        {/* Feature widgets mockup grid */}
        <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="rounded-xl bg-brand-950/40 p-2.5 text-brand-400 border border-brand-900/60 w-fit">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-slate-200 text-sm">Smart Suggestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit description details and watch our AI model automatically categorize and summarize your issue.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="rounded-xl bg-purple-950/40 p-2.5 text-purple-400 border border-purple-900/60 w-fit">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-slate-200 text-sm">Real-time Updates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant alerts and dashboard updates whenever administration re-prioritizes, re-assigns, or resolves your problem.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="rounded-xl bg-red-950/40 p-2.5 text-red-400 border border-red-900/60 w-fit">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-slate-200 text-sm">Auto Escalation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unresolved priority complaints automatically escalate to management if not handled within resolution thresholds.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3 flex flex-col justify-center border-dashed border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-center">Lifecycle</p>
            <p className="text-xl font-bold font-display text-slate-300 text-center mt-1">Submitted → Closed</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} College Complaint Management System. Built for Antigravity environment.
      </footer>
    </div>
  );
};
export default Landing;
