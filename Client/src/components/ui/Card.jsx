import React from 'react';

export const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', icon: Icon }) => (
  <h3 className={`text-base font-semibold flex items-center gap-2 text-[#0F172A] ${className}`}>
    {Icon && <Icon className="h-4.5 w-4.5 text-[#64748B] shrink-0" />}
    {children}
  </h3>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-slate-50/50 border-t border-[#E2E8F0] flex items-center justify-end gap-3 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
