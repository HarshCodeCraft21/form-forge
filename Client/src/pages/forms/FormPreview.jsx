import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  ArrowLeft, 
  Palette,
  Star,
  PenTool,
  Upload
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { getFormById } from '../../api/forms.api';
import Breadcrumb from '../../components/ui/Breadcrumb';

export const FormPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { forms } = useFormStore();

  const [form, setForm] = useState(null);
  const [device, setDevice] = useState('desktop'); // desktop | tablet | mobile
  const [previewTheme, setPreviewTheme] = useState('light'); // light | slate | indigo

  useEffect(() => {
    const existing = forms.find(f => f.id === id);
    if (existing) {
      setForm(existing);
    } else {
      getFormById(id)
        .then((f) => {
          setForm({
            ...f,
            id: f.id || f._id,
            responsesCount: f.responseCount || 0
          });
        })
        .catch((err) => {
          console.error('Failed to load form preview schema:', err);
          navigate('/forms');
        });
    }
  }, [id, forms, navigate]);


  if (!form) return null;

  // Simulator width class helper
  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return 'max-w-[375px] border-x-[12px] border-t-[36px] border-b-[36px] border-slate-900 rounded-[32px] min-h-[600px] shadow-[0_8px_30px_rgb(0,0,0,0.06)]';
      case 'tablet': return 'max-w-[680px] border-x-[16px] border-t-[40px] border-b-[40px] border-slate-900 rounded-[24px] min-h-[720px] shadow-[0_8px_30px_rgb(0,0,0,0.06)]';
      case 'desktop': 
      default: 
        return 'max-w-full w-full rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] border border-[#E2E8F0]';
    }
  };

  const getThemeClasses = () => {
    switch (previewTheme) {
      case 'indigo':
        return 'bg-white text-[#0F172A] [--theme-primary:#4F46E5] [--theme-primary-hover:#4338CA]';
      case 'slate':
        return 'bg-white text-slate-900 [--theme-primary:#0F172A] [--theme-primary-hover:#1E293B]';
      case 'light':
      default:
        return 'bg-white text-[#0F172A] [--theme-primary:#4F46E5] [--theme-primary-hover:#4338CA]';
    }
  };

  const renderPlaceholderField = (f) => {
    switch (f.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <input
            type="text"
            placeholder={f.placeholder || `Enter ${f.label}`}
            className="w-full bg-white border border-[#E2E8F0] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none transition-colors"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className="w-full bg-white border border-[#E2E8F0] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none transition-colors"
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={f.placeholder || `Enter ${f.label}`}
            className="w-full bg-white border border-[#E2E8F0] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] min-h-[80px] outline-none resize-none transition-colors"
          />
        );
      case 'select':
        return (
          <div className="relative">
            <select defaultValue="" className="w-full bg-white border border-[#E2E8F0] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-primary)]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none appearance-none transition-colors">
              <option value="" disabled>{f.placeholder || 'Choose option...'}</option>
              {f.options?.map((o, idx) => <option key={idx} value={o}>{o}</option>)}
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
            {f.options?.map((o, idx) => (
              <label key={idx} className="flex items-center gap-2.5 text-xs text-[#0F172A] cursor-pointer">
                <input type="radio" name={`field-${f.id}`} className="h-3.5 w-3.5 border-[#E2E8F0] text-[var(--theme-primary)] focus:ring-0" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2 py-1">
            {f.options?.map((o, idx) => (
              <label key={idx} className="flex items-center gap-2.5 text-xs text-[#0F172A] cursor-pointer">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#E2E8F0] text-[var(--theme-primary)] focus:ring-0" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        );
      case 'file':
        return (
          <div className="border border-dashed border-[#E2E8F0] rounded-xl p-5 bg-slate-50 text-center flex flex-col items-center justify-center gap-2">
            <Upload className="h-5 w-5 text-[#64748B] opacity-60" />
            <span className="text-xs font-medium text-[#64748B]">Click or drag file here to upload</span>
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-1 py-1">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} className="h-5 w-5 text-[#E2E8F0] hover:text-amber-400 hover:fill-amber-400 cursor-pointer transition-colors" />
            ))}
          </div>
        );
      case 'address':
        return (
          <div className="space-y-2 p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
            <input type="text" placeholder="Street Address" className="w-full bg-white border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs outline-none" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="City" className="w-full bg-white border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs outline-none" />
              <input type="text" placeholder="State" className="w-full bg-white border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs outline-none" />
            </div>
          </div>
        );
      case 'signature':
        return (
          <div className="border border-[#E2E8F0] rounded-lg bg-slate-50 h-20 flex flex-col items-center justify-center gap-1">
            <PenTool className="h-5 w-5 text-[#64748B] opacity-40" />
            <span className="text-[11px] text-[#64748B] italic">Draw your signature here</span>
          </div>
        );
      case 'divider':
        return <hr className="border-[#E2E8F0] my-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Breadcrumb 
            items={[
              { label: 'Forms Manager', to: '/forms' },
              { label: 'Edit Form', to: `/forms/${id}/edit` },
              { label: 'Simulator Preview' }
            ]} 
          />
          <Link to={`/forms/${id}/edit`} className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] font-semibold border border-[#E2E8F0] hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Builder
          </Link>
        </div>

        {/* Viewport & Theme controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-xl border border-[#E2E8F0]">
          
          {/* Device tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-lg gap-1 shrink-0 self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setDevice('desktop')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${device === 'desktop' ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop View
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${device === 'tablet' ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              <Tablet className="h-3.5 w-3.5" />
              Tablet View
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${device === 'mobile' ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile View
            </button>
          </div>

          {/* Theme selectors */}
          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center">
            <Palette className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
            <span className="text-xs font-semibold text-[#64748B]">Preview Theme:</span>
            <select
              value={previewTheme}
              onChange={(e) => setPreviewTheme(e.target.value)}
              className="border border-[#E2E8F0] focus:border-[#4F46E5] rounded-md px-2 py-1 text-xs font-semibold text-[#0F172A] bg-white outline-none"
            >
              <option value="light">Crisp Indigo (Default)</option>
              <option value="slate">Slate Minimal</option>
            </select>
          </div>

        </div>
      </div>

      {/* Simulator view frame viewport */}
      <div className="flex justify-center p-2">
        <div 
          className={`bg-white border border-[#E2E8F0] transition-all duration-300 relative flex flex-col ${getDeviceWidth()} ${getThemeClasses()}`}
        >
          {/* Simulated Mobile/Tablet camera speaker bar */}
          {device !== 'desktop' && (
            <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 flex justify-center items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
          )}

          <div className="p-6 md:p-8 flex-1 flex flex-col justify-start">
            
            {/* Header info */}
            <div className="border-b border-[#E2E8F0] pb-5 mb-6">
              <h2 className="text-xl font-bold text-[#0F172A] leading-tight">
                {form.title}
              </h2>
              {form.description && (
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  {form.description}
                </p>
              )}
            </div>

            {/* Inputs list */}
            <form className="space-y-4 flex-1" onSubmit={(e) => e.preventDefault()}>
              {form.fields?.map((field) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  {field.type !== 'divider' && (
                    <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-red-500 font-bold">*</span>}
                    </label>
                  )}
                  {renderPlaceholderField(field)}
                  {field.helpText && (
                    <span className="text-[10px] text-[#64748B]">{field.helpText}</span>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                className="w-full mt-6 bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Submit Response
              </button>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
};

export default FormPreview;
