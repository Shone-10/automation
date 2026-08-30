import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, CheckCircle, Clock, Archive, Loader2 } from 'lucide-react';
import { useAuth } from '../../store/authStore.jsx';
import api from '../../services/api.js';
import StatisticsCards from '../../components/StatisticsCards/StatisticsCards.jsx';
import ComplaintCard from '../../components/ComplaintCard/ComplaintCard.jsx';

export const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints/my');
        setComplaints(data);
      } catch (error) {
        console.error('Failed to load student complaints', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Compute counts
  const total = complaints.length;
  const submitted = complaints.filter(c => c.status === 'Submitted').length;
  const underReview = complaints.filter(c => c.status === 'Under Review').length;
  const assigned = complaints.filter(c => c.status === 'Assigned').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const closed = complaints.filter(c => c.status === 'Closed').length;

  const pending = submitted + underReview + assigned + inProgress;

  const stats = [
    { title: 'Total Logged', value: total, icon: FileText, color: 'text-brand-400' },
    { title: 'Pending Actions', value: pending, icon: Clock, color: 'text-amber-400' },
    { title: 'In Progress', value: inProgress, icon: Clock, color: 'text-orange-400' },
    { title: 'Resolved Issues', value: resolved, icon: CheckCircle, color: 'text-emerald-400' },
    { title: 'Closed / Archive', value: closed, icon: Archive, color: 'text-slate-400' },
  ];

  const recentComplaints = complaints.slice(0, 3);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-tr from-[#0e172a] via-[#1e293b]/40 to-[#0e172a] border border-slate-800/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            Welcome back, {user.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Need to report a campus facility issue? Get fast updates on your logged tickets.
          </p>
        </div>
        <Link
          to="/student/complaints/new"
          className="flex items-center space-x-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/10 hover:bg-brand-500 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Submit Complaint</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatisticsCards stats={stats} />

      {/* Bottom Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 font-display">Recent Submissions</h3>
            <Link to="/student/complaints" className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              View History
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-500">
              <FileText className="h-10 w-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium">No complaints logged yet.</p>
              <Link to="/student/complaints/new" className="text-xs text-brand-400 hover:text-brand-300 mt-1 inline-block">
                File your first complaint
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentComplaints.map(comp => (
                <ComplaintCard key={comp._id} complaint={comp} role="student" />
              ))}
            </div>
          )}
        </div>

        {/* Instructions / Info Panel */}
        <div className="glass-card rounded-2xl p-5 space-y-4 h-fit">
          <h3 className="text-sm font-semibold text-slate-300 font-display">Quick Support Info</h3>
          <div className="space-y-3 text-xs leading-relaxed text-slate-400">
            <div className="border-l-2 border-brand-500 pl-3">
              <p className="font-semibold text-slate-200">How to report?</p>
              <p className="mt-0.5">Click "Submit Complaint", fill in details and description. AI will categorize it automatically.</p>
            </div>
            <div className="border-l-2 border-amber-500 pl-3">
              <p className="font-semibold text-slate-200">Checking duplicates</p>
              <p className="mt-0.5">Our system matches new submissions with existing complaints in the same location to prevent duplicate spam.</p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3">
              <p className="font-semibold text-slate-200">Providing feedback</p>
              <p className="mt-0.5">Once resolved, verify the resolution and rate the quality. Providing rating closes the ticket automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
