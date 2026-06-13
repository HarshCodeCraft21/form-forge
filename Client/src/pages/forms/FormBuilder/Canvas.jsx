import React from 'react';
import { 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Star, 
  PenTool, 
  MapPin, 
  Asterisk,
  Upload
} from 'lucide-react';

export const Canvas = ({
  fields,
  activeFieldId,
  onSelectField,
  onRemoveField,
  onDuplicateField,
  onMoveField
}) => {

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'date':
        return (
          <input
            type="text"
            disabled
            placeholder={field.placeholder || 'Short answer text...'}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-lg px-3 py-2 text-xs cursor-not-allowed"
          />
        );
      case 'textarea':
        return (
          <textarea
            disabled
            placeholder={field.placeholder || 'Long answer text...'}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-lg px-3 py-2 text-xs min-h-[72px] resize-none cursor-not-allowed"
          />
        );
      case 'select':
        return (
          <div className="relative">
            <select disabled className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-lg px-3 py-2 text-xs appearance-none cursor-not-allowed">
              <option>{field.placeholder || 'Choose an option...'}</option>
              {field.options?.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748B]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2 py-1">
            {field.options && field.options.length > 0 ? (
              field.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-2.5 text-xs text-[#0F172A] cursor-not-allowed">
                  <input type="radio" disabled className="h-3.5 w-3.5 border-[#E2E8F0] text-[#4F46E5] focus:ring-0 cursor-not-allowed" />
                  <span>{opt}</span>
                </label>
              ))
            ) : (
              <span className="text-[11px] text-[#64748B] italic">No options configured. Click to edit options on the right.</span>
            )}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2 py-1">
            {field.options && field.options.length > 0 ? (
              field.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-2.5 text-xs text-[#0F172A] cursor-not-allowed">
                  <input type="checkbox" disabled className="h-3.5 w-3.5 rounded border-[#E2E8F0] text-[#4F46E5] focus:ring-0 cursor-not-allowed" />
                  <span>{opt}</span>
                </label>
              ))
            ) : (
              <span className="text-[11px] text-[#64748B] italic">No options configured. Click to edit options on the right.</span>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="border border-dashed border-[#E2E8F0] rounded-xl p-5 bg-[#F8FAFC] text-center flex flex-col items-center justify-center gap-2">
            <Upload className="h-5 w-5 text-[#64748B] opacity-60" />
            <span className="text-xs font-medium text-[#64748B]">Click or drag file here to upload</span>
            <span className="text-[10px] text-[#64748B]/60">Max file size: 10MB</span>
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-1 py-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-[#E2E8F0] fill-none" />
            ))}
          </div>
        );
      case 'address':
        return (
          <div className="space-y-2 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <input type="text" disabled placeholder="Street Address" className="w-full bg-white border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs cursor-not-allowed" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" disabled placeholder="City" className="w-full bg-white border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs cursor-not-allowed" />
              <input type="text" disabled placeholder="State / Region" className="w-full bg-white border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs cursor-not-allowed" />
            </div>
          </div>
        );
      case 'signature':
        return (
          <div className="border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] h-20 flex flex-col items-center justify-center gap-1 cursor-not-allowed">
            <PenTool className="h-5 w-5 text-[#64748B] opacity-40" />
            <span className="text-[11px] text-[#64748B] italic">User signature placeholder</span>
          </div>
        );
      case 'divider':
        return <hr className="border-[#E2E8F0] my-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const isSelected = field.id === activeFieldId;
        const isHalfWidth = field.width === 'half';

        return (
          <div
            key={field.id}
            onClick={() => onSelectField(field.id)}
            className={`relative p-5 bg-white border transition-all duration-200 cursor-pointer rounded-xl group ${
              isSelected 
                ? 'border-[#4F46E5] ring-4 ring-[#4F46E5]/5 shadow-[0_4px_12px_rgba(79,70,229,0.04)]' 
                : 'border-[#E2E8F0] hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
            } ${isHalfWidth ? 'inline-block w-[calc(50%-8px)] mr-2 align-top' : 'w-full block'}`}
          >
            
            {/* Field Header: Label & Action Controls */}
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-[#0F172A]">
                  {field.label || 'Untitled Question'}
                </span>
                {field.required && (
                  <Asterisk className="h-3 w-3 text-red-500 shrink-0" />
                )}
                <span className="text-[9px] font-medium text-[#64748B] bg-slate-100 px-1.5 py-0.5 rounded uppercase ml-1.5">
                  {field.type}
                </span>
              </div>

              {/* Action Buttons Toolbar: Always visible, clean styled */}
              <div className="flex gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onMoveField(index, 'up'); }}
                  disabled={index === 0}
                  className="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 border border-transparent hover:border-[#E2E8F0] rounded disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onMoveField(index, 'down'); }}
                  disabled={index === fields.length - 1}
                  className="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 border border-transparent hover:border-[#E2E8F0] rounded disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicateField(field.id); }}
                  className="p-1 text-[#64748B] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5 border border-transparent hover:border-[#4F46E5]/10 rounded"
                  title="Duplicate Field"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveField(field.id); }}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded"
                  title="Delete Field"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Field Input Layout Preview */}
            <div className="w-full pointer-events-none">
              {renderFieldPreview(field)}
            </div>

            {/* Helper Text description */}
            {field.helpText && (
              <p className="text-[10px] text-[#64748B] mt-1.5 leading-normal">{field.helpText}</p>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default Canvas;
