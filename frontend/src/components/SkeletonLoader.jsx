import React from 'react';

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
        {items.map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-800/60 rounded-lg flex-1"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800/60 rounded-lg w-28"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800/60 rounded-lg w-20"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800/60 rounded-lg w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800/80 rounded-2xl border border-slate-300/10 p-6 space-y-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800/80 rounded-2xl p-6 flex flex-col justify-between border border-slate-300/10">
          <div className="space-y-3">
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
          <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded-xl w-full"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
