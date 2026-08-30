import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge.jsx';
import PriorityBadge from '../PriorityBadge/PriorityBadge.jsx';

export const ComplaintCard = ({ complaint, role }) => {
  const detailPath = role === 'admin' 
    ? `/admin/complaints/${complaint._id}` 
    : `/student/complaints/${complaint._id}`;

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-card flex flex-col justify-between rounded-2xl p-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-brand-400 font-mono tracking-wider">
            {complaint.complaintId}
          </span>
          <PriorityBadge priority={complaint.priority} />
        </div>
        
        <h3 className="text-base font-semibold text-slate-100 line-clamp-1 mb-2 font-display">
          {complaint.title}
        </h3>
        
        <p className="text-xs text-slate-400 line-clamp-2 mb-4">
          {complaint.summary || complaint.description}
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-4 mt-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 space-y-1">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="truncate max-w-[120px]">{complaint.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={complaint.status} />
          
          <Link
            to={detailPath}
            className="inline-flex items-center text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Details
            <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ComplaintCard;
