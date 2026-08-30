import React from 'react';

export const StatisticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="glass-card rounded-2xl p-4 flex items-center space-x-3.5"
          >
            <div className={`rounded-xl p-2.5 bg-slate-900 border border-slate-800 ${stat.color || 'text-slate-400'}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </p>
              <p className="text-xl font-bold font-display text-white mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default StatisticsCards;
