import React from 'react';
import { Check, Dot, Circle } from 'lucide-react';

const STEPS = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

export const ComplaintTimeline = ({ currentStatus, updates = [] }) => {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-8">
      {/* Visual Status Step Indicator */}
      <div className="rounded-2xl bg-slate-900/35 border border-slate-800/80 p-6">
        <h3 className="text-sm font-semibold text-slate-300 font-display mb-6">Status Timeline</h3>
        
        {/* Horizontal timeline for medium+ screens, vertical for mobile */}
        <div className="hidden md:flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-slate-800 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 h-[2px] bg-brand-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%` }}
          ></div>

          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <div key={step} className="flex flex-col items-center relative z-10 flex-1">
                <div 
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-brand-500 border-brand-500 text-white shadow-[0_0_12px_rgba(14,143,227,0.3)]' 
                      : isActive 
                        ? 'bg-[#0f172a] border-brand-400 text-brand-400 ring-4 ring-brand-500/10'
                        : 'bg-[#0f172a] border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isActive ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-400 animate-pulse"></span>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-700"></span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold mt-2.5 ${isActive ? 'text-brand-400 font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Vertical timeline for Mobile screens */}
        <div className="flex flex-col space-y-4 md:hidden">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <div key={step} className="flex items-center space-x-3">
                <div 
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-brand-500 border-brand-500 text-white' 
                      : isActive 
                        ? 'bg-slate-900 border-brand-400 text-brand-400 ring-2 ring-brand-500/15'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : isActive ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400"></span>
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                  )}
                </div>
                <span className={`text-xs font-semibold ${isActive ? 'text-brand-400' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step} {isActive && ' (Current)'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronological History Log */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 font-display">Timeline Logs</h3>
        {updates.length === 0 ? (
          <p className="text-xs text-slate-500">No logs logged yet.</p>
        ) : (
          <div className="relative border-l border-slate-800 pl-4 ml-3 space-y-5">
            {updates.map((upd, idx) => (
              <div key={upd._id || idx} className="relative">
                {/* Visual marker */}
                <span className="absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-700 ring-4 ring-[#0b0f19]"></span>
                
                <div className="rounded-xl bg-slate-900/20 border border-slate-800/40 p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center rounded-md bg-slate-800/60 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                      {upd.status}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(upd.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{upd.message}</p>
                  {upd.adminId && (
                    <span className="text-[9px] text-slate-500 font-semibold block mt-1">
                      Updated By: {upd.adminId.name} ({upd.adminId.role})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ComplaintTimeline;
