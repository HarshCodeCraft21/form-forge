import React from 'react';

export const Input = React.forwardRef(({
  label,
  type = 'text', // text, password, email, phone, number, date, textarea, select, checkbox, toggle
  error,
  helperText,
  options = [], // for type="select"
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const renderField = () => {
    const baseInputClass = `w-full rounded-md border text-sm px-3 py-2 text-[#0F172A] bg-white transition-all focus:outline-none focus:ring-2`;
    const borderClass = error 
      ? 'border-[#EF4444] focus:ring-[#EF4444]/15 focus:border-[#EF4444]' 
      : 'border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-[#4F46E5]/15';

    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          ref={ref}
          required={required}
          className={`${baseInputClass} ${borderClass} min-h-[100px] leading-relaxed ${className}`}
          {...props}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={inputId}
          ref={ref}
          required={required}
          className={`${baseInputClass} ${borderClass} bg-no-repeat bg-right ${className}`}
          defaultValue=""
          {...props}
        >
          <option value="" disabled>
            Choose option...
          </option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'checkbox' || type === 'toggle') {
      const isToggle = type === 'toggle';
      return (
        <label className="flex items-start gap-2.5 py-1 cursor-pointer select-none">
          <input
            id={inputId}
            type="checkbox"
            ref={ref}
            required={required}
            className={
              isToggle 
                ? `toggle toggle-primary h-5 w-9 rounded-full border border-slate-300 ${className}` 
                : `rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]/15 h-4 w-4 shrink-0 mt-0.5 ${className}`
            }
            {...props}
          />
          {label && (
            <span className="text-sm font-medium text-[#64748B]">
              {label} {required && <span className="text-[#EF4444]">*</span>}
            </span>
          )}
        </label>
      );
    }

    return (
      <input
        id={inputId}
        type={type}
        ref={ref}
        required={required}
        className={`${baseInputClass} ${borderClass} ${className}`}
        {...props}
      />
    );
  };

  const isCheckboxOrToggle = type === 'checkbox' || type === 'toggle';

  return (
    <div className="flex flex-col w-full gap-1.5">
      {!isCheckboxOrToggle && label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#0F172A] tracking-wide select-none">
          {label} {required && <span className="text-[#EF4444] font-bold">*</span>}
        </label>
      )}

      {renderField()}

      {error && (
        <span className="text-xs text-[#EF4444] font-medium mt-0.5 select-none">
          {error}
        </span>
      )}

      {!error && helperText && (
        <span className="text-xs text-[#64748B]/70 mt-0.5 select-none">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
