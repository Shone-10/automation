import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, ShieldAlert, Zap, Landmark, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import StatisticsCards from '../../components/StatisticsCards/StatisticsCards.jsx';
import AnalyticsCharts from '../../components/AnalyticsCharts/AnalyticsCharts.jsx';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge.jsx';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [escalatedList, setEscalatedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/statistics');
        setStats(data);
        
        // Also fetch escalated complaints
        const escRes = await api.get('/admin/complaints?status=Submitted,Under Review,Assigned,In Progress');
        const activeEscalated = escRes.data.filter(c => c.isEscalated);
        setEscalatedList(activeEscalated);
      } catch (error) {
        console.error('Failed to load admin stats:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const { summary = {}, charts = {}, departmentStats = [], resolutionTimes = {} } = stats || {};

  const cardStats = [
    { title: 'Total Tickets', value: summary.total || 0, icon: FileText, color: 'text-brand-400' },
    { title: 'Pending Actions', value: summary.pending || 0, icon: Clock, color: 'text-amber-400' },
    { title: 'Critical Issues', value: summary.critical || 0, icon: ShieldAlert, color: 'text-red-500 font-extrabold' },
    { title: 'Escalated Tickets', value: summary.escalated || 0, icon: Zap, color: 'text-red-400' },
    { title: 'Resolved / Closed', value: (summary.resolved || 0) + (summary.closed || 0), icon: CheckCircle, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white font-display">Administrator Dashboard</h2>
        <p className="text-xs text-slate-400 mt-1">
          Complete metrics on campus complaints, department status, and resolution performance
        </p>
      </div>

      {/* Analytics Cards */}
      <StatisticsCards stats={cardStats} />

      {/* Resolution Times Grid */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 font-display mb-4">Resolution Speed Tracking</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-4 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Time</p>
            <p className="text-base font-semibold text-slate-200 mt-1">{resolutionTimes.avg || 'N/A'}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-4 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fastest Time</p>
            <p className="text-base font-semibold text-emerald-400 mt-1">{resolutionTimes.fastest || 'N/A'}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-4 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Longest Time</p>
            <p className="text-base font-semibold text-red-400 mt-1">{resolutionTimes.longest || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts (Distribution Graphs) */}
      <AnalyticsCharts data={charts} />

      {/* Grid: Escalations and Department Wise statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Stats Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <Landmark className="h-4.5 w-4.5 text-brand-400" />
            <h3 className="text-sm font-semibold text-slate-300 font-display">Department-Wise Statistics</h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#0d1222]/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#090d16] text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5 text-center">Total Logged</th>
                  <th className="px-5 py-3.5 text-center text-amber-400">Pending Actions</th>
                  <th className="px-5 py-3.5 text-center text-emerald-400">Resolved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {departmentStats.map((dept, index) => (
                  <tr key={index} className="hover:bg-slate-900/10 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-200">{dept.department}</td>
                    <td className="px-5 py-3 text-center">{dept.total}</td>
                    <td className="px-5 py-3 text-center font-semibold text-amber-500">{dept.pending}</td>
                    <td className="px-5 py-3 text-center font-semibold text-emerald-500">{dept.resolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Escalated list widget */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 font-display">Escalated Tickets ({escalatedList.length})</h3>
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>

          {escalatedList.length === 0 ? (
            <div className="flex h-44 flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <CheckCircle className="h-8 w-8 text-slate-700 mb-1.5" />
              <p className="text-xs font-semibold text-slate-400">No active escalations</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Unresolved items are within deadlines.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {escalatedList.map(comp => (
                <div key={comp._id} className="rounded-xl border border-red-900/60 bg-red-950/15 p-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-red-400 font-mono tracking-widest">{comp.complaintId}</span>
                    <h4 className="text-xs font-semibold text-slate-200 truncate max-w-[140px] mt-0.5">{comp.title}</h4>
                    <span className="inline-flex text-[9px] text-slate-400 mt-1">Age: {Math.round((new Date() - new Date(comp.createdAt)) / (1000 * 60 * 60))} hrs</span>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5">
                    <PriorityBadge priority={comp.priority} />
                    <Link to={`/admin/complaints/${comp._id}`} className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center">
                      Manage <ArrowRight className="ml-0.5 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
