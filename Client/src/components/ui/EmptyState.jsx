import React from 'react';
import Button from './Button';

export const EmptyState = ({
  title = 'No records found',
  description = 'There are no active records in this list. Create a new one to get started.',
  icon: Icon,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border border-[#E2E8F0] rounded-xl bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] ${className}`}>
      {Icon && (
        <div className="p-3 bg-slate-50 text-[#64748B] rounded-lg mb-4 shrink-0 border border-[#E2E8F0]">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[#0F172A]">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-sm mt-1 mb-5">{description}</p>
      
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="sm" className="font-semibold shadow-sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
