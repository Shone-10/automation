import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, User, ShieldAlert, Star, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge.jsx';
import ComplaintTimeline from '../../components/ComplaintTimeline/ComplaintTimeline.jsx';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const fetchDetails = async () => {
    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data.complaint);
      setTimeline(data.timeline);
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackLoading(true);

    try {
      const { data } = await api.post(`/complaints/${id}/feedback`, {
        rating,
        feedback: feedbackText
      });
      // Refresh details
      setComplaint(data.complaint);
      // Re-fetch timeline
      await fetchDetails();
    } catch (err) {
      setFeedbackError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="rounded-2xl border border-red-800 bg-red-950/20 p-6 text-center text-red-400">
        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
        <p className="font-semibold">{error || 'Complaint not found.'}</p>
        <Link to="/student/complaints" className="text-xs text-brand-400 hover:underline mt-2 inline-block">
          Go back to my complaints
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
        <ChevronLeft className="h-4.5 w-4.5" />
        <Link to="/student/dashboard" className="hover:text-slate-300">Dashboard</Link>
        <span>/</span>
        <Link to="/student/complaints" className="hover:text-slate-300">My Complaints</Link>
        <span>/</span>
        <span className="text-slate-400 font-mono">{complaint.complaintId}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complaint details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Title & IDs */}
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

            {/* Description & metadata details */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-y-3 gap-x-6 text-xs text-slate-400">
                <span className="flex items-center">
                  <MapPin className="mr-1.5 h-4 w-4 text-slate-500" />
                  {complaint.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1.5 h-4 w-4 text-slate-500" />
                  {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="flex items-center">
                  <User className="mr-1.5 h-4 w-4 text-slate-500" />
                  Category: {complaint.category}
                </span>
              </div>

              {/* AI generated summary banner */}
              {complaint.summary && (
                <div className="rounded-xl border border-brand-900/40 bg-brand-950/20 p-4 text-xs">
                  <p className="font-bold text-brand-400 uppercase tracking-widest text-[9px] mb-1">AI Generated Summary</p>
                  <p className="text-slate-300 font-medium italic">"{complaint.summary}"</p>
                </div>
              )}

              {/* Escalated notification */}
              {complaint.isEscalated && (
                <div className="flex items-start space-x-2.5 rounded-xl border border-red-900/60 bg-red-950/15 p-4 text-xs text-red-400 animate-pulse">
                  <ShieldAlert className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">⚠ Ticket Escalated</p>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      This complaint has exceeded the resolution time threshold for its priority and has been flagged for immediate administrator attention.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400">Description</h4>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>

              {/* Attached Image */}
              {complaint.imageUrl && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400">Attached Reference Image</h4>
                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 max-w-md">
                    <img 
                      src={complaint.imageUrl} 
                      alt="Complaint attachment" 
                      className="w-full max-h-72 object-cover object-center"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.log('Image failed to load');
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Assignment & Resolution metadata info */}
            {(complaint.department || complaint.assignedStaff || complaint.resolutionDetails) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/80 pt-6">
                {complaint.department && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-4">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned Department</h5>
                    <p className="text-sm font-semibold text-slate-300 mt-1">{complaint.department}</p>
                    {complaint.assignedStaff && (
                      <p className="text-xs text-slate-400 mt-0.5">Staff: {complaint.assignedStaff}</p>
                    )}
                  </div>
                )}

                {complaint.status === 'Resolved' || complaint.status === 'Closed' ? (
                  <div className="rounded-xl border border-emerald-900 bg-emerald-950/10 p-4 md:col-span-2">
                    <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Resolution Details</h5>
                    <p className="text-sm text-slate-200 mt-1">{complaint.resolutionDetails || 'Resolved successfully.'}</p>
                    {complaint.resolvedAt && (
                      <p className="text-[10px] text-emerald-500 font-semibold mt-2">
                        Resolved On: {new Date(complaint.resolvedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Feedback Form Panel (shows if Resolved) */}
          {complaint.status === 'Resolved' && (
            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border border-brand-500/20">
              <h3 className="text-base font-semibold text-slate-100 font-display">Resolution Review & Rating</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The administrator has marked your ticket as resolved. Please rate the quality of the resolution to close the ticket.
              </p>

              {feedbackError && (
                <div className="flex items-center space-x-2 rounded-xl border border-red-800/60 bg-red-950/20 p-4 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{feedbackError}</span>
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Star rating selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Resolution Rating</label>
                  <div className="flex items-center space-x-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform active:scale-95"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Feedback */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Comments/Feedback (Optional)</label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write a message explaining if the resolution solved your problem..."
                    className="w-full rounded-xl border border-slate-800 bg-[#0d1324] px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={feedbackLoading}
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 text-xs font-semibold text-white hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 transition-all duration-300"
                >
                  {feedbackLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Feedback...
                    </>
                  ) : (
                    'Submit Feedback & Close Complaint'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Statically display rating if Closed */}
          {complaint.status === 'Closed' && complaint.rating && (
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 font-display">Your Feedback</h3>
              <div className="flex items-center space-x-1.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4.5 w-4.5 ${
                      star <= complaint.rating ? 'fill-current' : 'text-slate-800'
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-400 font-semibold pl-1">({complaint.rating} / 5)</span>
              </div>
              {complaint.feedback ? (
                <p className="text-xs text-slate-300 leading-relaxed italic">"{complaint.feedback}"</p>
              ) : (
                <p className="text-xs text-slate-500 italic">No feedback comment left.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Status Timeline component */}
        <div className="lg:col-span-1">
          <ComplaintTimeline currentStatus={complaint.status} updates={timeline} />
        </div>
      </div>
    </div>
  );
};
export default ComplaintDetails;
