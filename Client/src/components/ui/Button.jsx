import React from 'react';

export const Button = React.forwardRef(({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, ghost, error, success
  size = 'md',        // sm, md, lg
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': 
        return 'bg-[#4F46E5] hover:bg-[#4338CA] text-white border border-[#4F46E5] hover:border-[#4338CA]';
      case 'secondary': 
        return 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#E2E8F0]';
      case 'outline': 
        return 'bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0]';
      case 'ghost': 
        return 'bg-transparent hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A]';
      case 'error': 
        return 'bg-[#EF4444] hover:bg-[#DC2626] text-white border border-[#EF4444]';
      case 'success': 
        return 'bg-[#22C55E] hover:bg-[#16A34A] text-white border border-[#22C55E]';
      default: 
        return 'bg-[#4F46E5] hover:bg-[#4338CA] text-white border border-[#4F46E5]';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-sm rounded-md';
      case 'lg': return 'px-6 py-3 text-base rounded-lg';
      case 'md':
      default: 
        return 'px-4 py-2 text-sm rounded-md';
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/25 gap-2 select-none active:scale-[0.98] ${getVariantClass()} ${getSizeClass()} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 text-current shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
