import React from 'react';

export const AnalyticsCharts = ({ data }) => {
  const { categories = {}, priorities = {}, statuses = {} } = data || {};

  const renderProgressBar = (label, count, total, colorClass = 'bg-brand-500') => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div key={label} className="space-y-1">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-300">{label}</span>
          <span className="text-slate-400">
            {count} <span className="text-[10px] text-slate-500 font-normal">({percentage}%)</span>
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const getSum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

  const totalCategories = getSum(categories);
  const totalPriorities = getSum(priorities);
  const totalStatuses = getSum(statuses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Category Chart */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 font-display mb-4">Category Distribution</h3>
        {totalCategories === 0 ? (
          <p className="text-xs text-slate-500">No category data logged.</p>
        ) : (
          <div className="space-y-3.5">
            {Object.entries(categories).map(([category, count]) =>
              renderProgressBar(category, count, totalCategories, 'bg-gradient-to-r from-brand-500 to-cyan-500')
            )}
          </div>
        )}
      </div>

      {/* Priority Chart */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 font-display mb-4">Priority Distribution</h3>
        {totalPriorities === 0 ? (
          <p className="text-xs text-slate-500">No priority data logged.</p>
        ) : (
          <div className="space-y-3.5">
            {['Low', 'Medium', 'High', 'Critical'].map((prio) => {
              const count = priorities[prio] || 0;
              const color = 
                prio === 'Critical' ? 'bg-red-500' :
                prio === 'High' ? 'bg-orange-500' :
                prio === 'Medium' ? 'bg-amber-500' : 'bg-slate-500';
              return renderProgressBar(prio, count, totalPriorities, color);
            })}
          </div>
        )}
      </div>

      {/* Status Chart */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 font-display mb-4">Status Distribution</h3>
        {totalStatuses === 0 ? (
          <p className="text-xs text-slate-500">No status data logged.</p>
        ) : (
          <div className="space-y-3.5">
            {['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((stat) => {
              const count = statuses[stat] || 0;
              const color = 
                stat === 'Resolved' ? 'bg-emerald-500' :
                stat === 'Closed' ? 'bg-slate-500' :
                stat === 'In Progress' ? 'bg-orange-500' : 'bg-brand-500';
              return renderProgressBar(stat, count, totalStatuses, color);
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default AnalyticsCharts;
