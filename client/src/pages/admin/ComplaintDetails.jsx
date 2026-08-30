import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, User, ShieldAlert, Sparkles, Loader2, AlertCircle, Save, Star } from 'lucide-react';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge.jsx';
import ComplaintTimeline from '../../components/ComplaintTimeline/ComplaintTimeline.jsx';

const DEPARTMENTS = ['Administration', 'IT Department', 'Maintenance', 'Hostel', 'Transportation', 'Housekeeping', 'Laboratory'];
const STATUSES = ['', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const PRIORITIES = ['', 'Low', 'Medium', 'High', 'Critical'];


const DEPT_STAFF_MAP = {
  'Administration': ['Admin Manager', 'Registrar', 'Principal Office'],
  'IT Department': ['IT Administrator', 'Network Technician', 'SysAdmin'],
  'Maintenance': ['Maintenance Officer', 'Electrician', 'Plumber', 'Carpenter'],
  'Hostel': ['Hostel Warden', 'Mess Supervisor', 'Hostel Caretaker'],
  'Transportation': ['Transport Head', 'Bus Coordinator', 'Fleet Driver'],
  'Housekeeping': ['Housekeeping Supervisor', 'Sanitation Lead', 'Cleanliness Staff'],
  'Laboratory': ['Lab Assistant', 'Lab In-Charge', 'Equipment Coordinator']
};

export const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states for updates
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchDetails = async () => {
    try {
      const { data } = await api.get(`/admin/complaints/${id}`);
      setComplaint(data.complaint);
      setTimeline(data.timeline);
      
      // Pre-fill form values
      setStatus(data.complaint.status);
      setPriority(data.complaint.priority);
      setDepartment(data.complaint.department || '');
      setAssignedStaff(data.complaint.assignedStaff || '');
      setResolutionDetails(data.complaint.resolutionDetails || '');
      setAdminComment('');
    } catch (err) {
      setError('Failed to fetch complaint details.');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Handle department change to pre-fill staff dropdown recommendation
  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setDepartment(dept);
    if (dept && DEPT_STAFF_MAP[dept]) {
      setAssignedStaff(DEPT_STAFF_MAP[dept][0]); // select default recommended staff
    } else {
      setAssignedStaff('');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaveSuccess(false);
    setSaveLoading(true);

    if (status === 'Resolved' && !resolutionDetails.trim()) {
      setError('Resolution details are required to mark this complaint as Resolved.');
      setSaveLoading(false);
      return;
    }

    try {
      const { data } = await api.put(`/admin/complaints/${id}`, {
        status,
        priority,
        department,
        assignedStaff,
        adminComment: adminComment.trim() || undefined,
        resolutionDetails: status === 'Resolved' ? resolutionDetails.trim() : undefined,
      });

      setSaveSuccess(true);
      
      // Re-fetch timeline logs
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update complaint.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEscalationToggle = async () => {
    setError('');
    try {
      const targetEscalation = !complaint.isEscalated;
      const { data } = await api.put(`/admin/complaints/${id}`, {
        isEscalated: targetEscalation,
        escalatedAt: targetEscalation ? new Date() : null,
        adminComment: targetEscalation 
          ? 'Ticket escalated manually by Administrator.' 
          : 'Ticket de-escalated manually by Administrator.'
      });
      await fetchDetails();
    } catch (err) {
      setError('Failed to toggle escalation status.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="rounded-2xl border border-red-800 bg-red-950/20 p-6 text-center text-red-400">
        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
        <p className="font-semibold">{error}</p>
        <Link to="/admin/complaints" className="text-xs text-brand-400 hover:underline mt-2 inline-block">
          Go back to manage list
        </Link>
      </div>
    );
  }

  const staffOptions = department ? DEPT_STAFF_MAP[department] || [] : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
        <ChevronLeft className="h-4.5 w-4.5" />
        <Link to="/admin/dashboard" className="hover:text-slate-300">Dashboard</Link>
        <span>/</span>
        <Link to="/admin/complaints" className="hover:text-slate-300">Manage Complaints</Link>
        <span>/</span>
        <span className="text-slate-400 font-mono">{complaint.complaintId}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: admin update forms & data info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <span className="text-xs font-bold text-brand-400 font-mono tracking-wider">
                  {complaint.complaintId}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-1">
                  {complaint.title}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            {/* Student metadata info */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-4 space-y-2 text-xs">
              <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Student Filer Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                <p className="text-slate-300">Name: <span className="text-slate-100 font-semibold">{complaint.studentId?.name || 'N/A'}</span></p>
                <p className="text-slate-300">Email: <span className="text-slate-100 font-semibold">{complaint.studentId?.email || 'N/A'}</span></p>
                <p className="text-slate-300">Student ID: <span className="text-slate-100 font-mono font-semibold">{complaint.studentId?.studentId || 'N/A'}</span></p>
                <p className="text-slate-300">Dept/Year: <span className="text-slate-100 font-semibold">{complaint.studentId?.department || 'N/A'} (Year {complaint.studentId?.year || 'N/A'})</span></p>
              </div>
            </div>

            {/* AI Summary banner */}
            {complaint.summary && (
              <div className="rounded-xl border border-brand-900/40 bg-brand-950/20 p-4 text-xs">
                <p className="font-bold text-brand-400 uppercase tracking-widest text-[9px] mb-1">AI Generated Summary</p>
                <p className="text-slate-300 font-medium italic">"{complaint.summary}"</p>
              </div>
            )}

            {/* Detail description */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-y-3 gap-x-6 text-xs text-slate-400 border-b border-slate-800/60 pb-3">
                <span className="flex items-center">
                  <MapPin className="mr-1.5 h-4 w-4 text-slate-500" />
                  {complaint.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1.5 h-4 w-4 text-slate-500" />
                  Logged: {new Date(complaint.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-400">Description</h4>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>

              {/* Attached Image reference */}
              {complaint.imageUrl && (
                <div className="space-y-2 pt-2 border-t border-slate-800/40">
                  <h4 className="text-xs font-semibold text-slate-400">Student Uploaded Image</h4>
                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 max-w-md">
                    <a href={complaint.imageUrl} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={complaint.imageUrl} 
                        alt="Complaint attachment" 
                        className="w-full max-h-72 object-cover object-center hover:scale-102 transition-transform duration-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Action Management Panel Form */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-slate-100 font-display">Update Operations</h3>
              
              {/* Escalation Toggle button */}
              <button
                type="button"
                onClick={handleEscalationToggle}
                className={`inline-flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  complaint.isEscalated 
                    ? 'bg-red-950/40 border-red-800 text-red-400 hover:bg-slate-900'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>{complaint.isEscalated ? 'De-escalate Ticket' : 'Escalate Ticket'}</span>
              </button>
            </div>

            {saveSuccess && (
              <div className="rounded-xl border border-emerald-800 bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-400">
                Complaint details updated and notifications broadcasted successfully!
              </div>
            )}
            
            {error && (
              <div className="flex items-center space-x-2 rounded-xl border border-red-800/60 bg-red-950/20 p-4 text-xs text-red-400">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                  >
                    {STATUSES.filter(s => s).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                  >
                    {PRIORITIES.filter(p => p).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Assign Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Assign Department</label>
                  <select
                    value={department}
                    onChange={handleDepartmentChange}
                    className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Assign Staff */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Assign Responsible Staff</label>
                  {staffOptions.length > 0 ? (
                    <select
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                    >
                      <option value="">Select staff</option>
                      {staffOptions.map(staff => (
                        <option key={staff} value={staff}>{staff}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                      placeholder="e.g. IT Administrator"
                      className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Resolution Details (required if Resolved status) */}
              {status === 'Resolved' && (
                <div className="space-y-1.5 rounded-xl border border-brand-500/20 bg-brand-950/5 p-4 animate-fade-in">
                  <label className="text-xs font-bold text-brand-400">Resolution Message (Will be shown to student)</label>
                  <textarea
                    rows={3}
                    required
                    value={resolutionDetails}
                    onChange={(e) => setResolutionDetails(e.target.value)}
                    placeholder="Provide details on how the issue was fixed (e.g. replaced the broken network cable in Room 204)..."
                    className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none mt-1.5"
                  />
                </div>
              )}

              {/* Progress Update Comment (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Progress Update Comment (Log to timeline history)</label>
                <textarea
                  rows={2}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Provide a status update comment (e.g. forwarded request to electrician)..."
                  className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saveLoading}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 text-xs font-semibold text-white shadow-lg hover:from-brand-500 hover:to-brand-400 disabled:opacity-50 transition-all duration-300"
              >
                {saveLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Update Details</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Display feedback from student if Closed */}
          {complaint.status === 'Closed' && complaint.rating && (
            <div className="glass-card rounded-2xl p-6 space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-300 font-display">Student Satisfaction Review</h3>
              <div className="flex items-center space-x-1 font-semibold text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4.5 w-4.5 ${
                      star <= complaint.rating ? 'fill-current' : 'text-slate-800'
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-400 pl-1">({complaint.rating} / 5)</span>
              </div>
              {complaint.feedback ? (
                <p className="text-xs text-slate-300 italic leading-relaxed">"{complaint.feedback}"</p>
              ) : (
                <p className="text-xs text-slate-500 italic">No feedback message provided.</p>
              )}
            </div>
          )}
        </div>

        {/* Right column: Interactive Status Timeline component */}
        <div className="lg:col-span-1">
          <ComplaintTimeline currentStatus={complaint.status} updates={timeline} />
        </div>
      </div>
    </div>
  );
};
export default ComplaintDetails;
