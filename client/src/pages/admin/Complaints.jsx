import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, ArrowRight, ShieldAlert, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge.jsx';

const DEPARTMENTS = ['', 'Administration', 'IT Department', 'Maintenance', 'Hostel', 'Transportation', 'Housekeeping', 'Laboratory'];
const STATUSES = ['', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['', 'Low', 'Medium', 'High', 'Critical'];
const CATEGORIES = ['', 'Classroom', 'Laboratory', 'Hostel', 'Wi-Fi / Internet', 'Infrastructure', 'Transportation', 'Cleanliness', 'Other'];

export const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (department) params.department = department;
      if (category) params.category = category;
      if (sort) params.sort = sort;

      const { data } = await api.get('/admin/complaints', { params });
      setComplaints(data);
    } catch (err) {
      setError('Failed to load complaints.');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search/filters changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchComplaints();
    }, 300); // Debounce typing

    return () => clearTimeout(delayDebounce);
  }, [search, status, priority, department, category, sort]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white font-display">Manage Campus Complaints</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review, assign department/staff, add updates, set priority, and resolve student complaints
        </p>
      </div>

      {/* Advanced search and filtering widget */}
      <div className="glass-card rounded-2xl p-4.5 space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search ID, title, student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Filters Selector row */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="">All Statuses</option>
              {STATUSES.filter(s => s).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Priority */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="">All Priorities</option>
              {PRIORITIES.filter(p => p).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Department */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.filter(d => d).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.filter(c => c).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort select row */}
        <div className="flex justify-between items-center border-t border-slate-800/80 pt-3 text-[10px] text-slate-400 font-semibold uppercase">
          <div>
            {loading ? 'Fetching...' : `Found ${complaints.length} complaints`}
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-slate-800 bg-[#0d1324] px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
            >
              <option value="newest">Newest Logged</option>
              <option value="oldest">Oldest Logged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {error && (
        <div className="flex items-center space-x-2 rounded-xl border border-red-800/60 bg-red-950/20 p-4 text-xs text-red-400">
          <AlertCircle className="h-4.5 w-4.5" />
          <span>{error}</span>
        </div>
      )}

      {loading && complaints.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-500">
          <Search className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium">No complaints found matching selection.</p>
          <p className="text-xs text-slate-500 mt-0.5">Try resetting search or dropdown filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-[#0c111e]/90 shadow-xl">
          <table className="w-full border-collapse text-left text-xs text-slate-300">
            <thead className="bg-[#0b0f19] border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Complaint Title</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Department / Staff</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {complaints.map(comp => (
                <tr key={comp._id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4.5 font-mono font-bold text-brand-400">
                    <div className="flex items-center space-x-1.5">
                      <span>{comp.complaintId}</span>
                      {comp.isEscalated && (
                        <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" title="Escalated due to SLA timeout"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="max-w-[200px] truncate">
                      <p className="font-semibold text-slate-100 truncate">{comp.title}</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{comp.category} at {comp.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div>
                      <p className="font-semibold text-slate-200">{comp.studentId?.name || 'N/A'}</p>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">{comp.studentId?.department || ''}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    {comp.department ? (
                      <div>
                        <p className="font-semibold text-slate-300">{comp.department}</p>
                        <p className="text-[10px] text-slate-500">{comp.assignedStaff || 'Unassigned Staff'}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 uppercase italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4.5">
                    <PriorityBadge priority={comp.priority} />
                  </td>
                  <td className="px-6 py-4.5">
                    <StatusBadge status={comp.status} />
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <Link
                      to={`/admin/complaints/${comp._id}`}
                      className="inline-flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 hover:bg-slate-800/60 text-slate-300 transition-colors"
                    >
                      <span>Manage</span>
                      <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Complaints;
