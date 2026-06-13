import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  size = 'md' // sm, md, lg, xl
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '5xl': 'max-w-5xl'
  }[size] || 'max-w-md';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 transition-opacity duration-200"
      />

      {/* Modal Dialog container */}
      <div className={`relative bg-white rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E2E8F0] w-full overflow-hidden transition-all duration-200 ${sizeClass} z-10 ${className}`}>
        
        {/* Header bar */}
        {title && (
          <div className="px-6 py-4.5 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
            <button 
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {/* Content body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
