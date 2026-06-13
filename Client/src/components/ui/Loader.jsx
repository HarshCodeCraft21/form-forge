import React from 'react';

export const Loader = ({ fullPage = false, size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'h-4 w-4 stroke-[3]',
    md: 'h-8 w-8 stroke-[2]',
    lg: 'h-12 w-12 stroke-[2]'
  }[size] || 'h-8 w-8';

  const spinner = (
    <svg 
      className={`animate-spin text-[#4F46E5] ${sizeClass} ${className}`} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-[#F8FAFC]/90 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 select-none">
          {spinner}
          <span className="text-xs font-semibold text-[#64748B] tracking-wide animate-pulse">Loading FormForge...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6 select-none">
      {spinner}
    </div>
  );
};

export default Loader;
