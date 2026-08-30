import React from 'react';

const STATUS_STYLING = {
  Submitted: 'bg-blue-950/45 text-blue-400 border-blue-800/60',
  'Under Review': 'bg-purple-950/45 text-purple-400 border-purple-800/60',
  Assigned: 'bg-amber-950/45 text-amber-400 border-amber-800/60',
  'In Progress': 'bg-orange-950/45 text-orange-400 border-orange-800/60',
  Resolved: 'bg-emerald-950/45 text-emerald-400 border-emerald-800/60',
  Closed: 'bg-slate-900/60 text-slate-400 border-slate-700/60',
};

export const StatusBadge = ({ status }) => {
  const styles = STATUS_STYLING[status] || 'bg-slate-900 text-slate-400 border-slate-800';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
export default StatusBadge;
