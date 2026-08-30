import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, ArrowUpDown, MapPin, Eye } from 'lucide-react';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge.jsx';

const CATEGORIES = ['All', 'Classroom', 'Laboratory', 'Hostel', 'Wi-Fi / Internet', 'Infrastructure', 'Transportation', 'Cleanliness', 'Other'];
const STATUSES = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

export const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints/my');
        setComplaints(data);
      } catch (error) {
        console.error('Failed to load complaints list', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(comp => {
    const matchesSearch =
      comp.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || comp.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || comp.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort complaints
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title section */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white font-display">My Complaints</h2>
        <p className="text-xs text-slate-400 mt-1">
          Search, filter, and track details of all complaints submitted by you
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search ID, title, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#0d1324] pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="w-full md:w-44 flex flex-col space-y-1">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
          >
            <option value="" disabled>Category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat} {cat === 'All' ? 'Categories' : ''}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="w-full md:w-40 flex flex-col space-y-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
          >
            <option value="" disabled>Status</option>
            {STATUSES.map(stat => (
              <option key={stat} value={stat}>{stat} {stat === 'All' ? 'Statuses' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      {sortedComplaints.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-500">
          <Search className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium">No matching complaints found.</p>
          <p className="text-xs text-slate-500 mt-0.5">Try clearing your filters or check search query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-[#0c111e]/90 shadow-xl">
          <table className="w-full border-collapse text-left text-xs text-slate-300">
            <thead className="bg-[#0b0f19] border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              <tr>
                <th 
                  onClick={() => handleSort('complaintId')} 
                  className="px-6 py-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th 
                  onClick={() => handleSort('priority')} 
                  className="px-6 py-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th 
                  onClick={() => handleSort('createdAt')} 
                  className="px-6 py-4 cursor-pointer hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Logged Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedComplaints.map(comp => (
                <tr key={comp._id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4.5 font-mono font-bold text-brand-400">
                    {comp.complaintId}
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="max-w-[200px] truncate">
                      <p className="font-semibold text-slate-100 truncate">{comp.title}</p>
                      <span className="flex items-center text-[10px] text-slate-500 mt-0.5">
                        <MapPin className="mr-0.5 h-3 w-3" /> {comp.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-slate-300">{comp.category}</td>
                  <td className="px-6 py-4.5">
                    <PriorityBadge priority={comp.priority} />
                  </td>
                  <td className="px-6 py-4.5">
                    <StatusBadge status={comp.status} />
                  </td>
                  <td className="px-6 py-4.5 text-slate-400">
                    {new Date(comp.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <Link
                      to={`/student/complaints/${comp._id}`}
                      className="inline-flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900/40 px-2.5 py-1.5 hover:bg-slate-800/60 text-slate-300 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
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
