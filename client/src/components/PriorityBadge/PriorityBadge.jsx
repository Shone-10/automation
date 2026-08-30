import React from 'react';

const PRIORITY_STYLING = {
  Low: 'bg-slate-900/60 text-slate-400 border-slate-700/60',
  Medium: 'bg-amber-950/45 text-amber-400 border-amber-800/60',
  High: 'bg-orange-950/45 text-orange-400 border-orange-800/60',
  Critical: 'bg-red-950/50 text-red-400 border-red-800/80 shadow-[0_0_8px_rgba(239,68,68,0.2)] animate-pulse-slow',
};

export const PriorityBadge = ({ priority }) => {
  const styles = PRIORITY_STYLING[priority] || 'bg-slate-900 text-slate-400 border-slate-800';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {priority}
    </span>
  );
};
export default PriorityBadge;
