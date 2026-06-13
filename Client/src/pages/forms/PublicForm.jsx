import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sparkles, CheckCircle2, Upload, Star, PenTool, Calendar, Lock } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { getPublicForm, submitPublicResponse } from '../../api/publicForms.api';

export const PublicForm = () => {
  const { id, slug } = useParams();
  const { forms, submitResponse } = useFormStore();
  const [formSchema, setFormSchema] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

  // Watch fields to calculate form filling progress and active states
  const watchedValues = watch();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const fetchPublicForm = async () => {
      setLoading(true);
      setErrorMsg(null);
      setErrorStatus(null);
      try {
        const target = slug || id;
        const data = await getPublicForm(target);
        setFormSchema(data);
      } catch (err) {
        console.error(err);
        setErrorStatus(err.response?.status || 500);
        setErrorMsg(err.response?.data?.message || 'Form not found or no longer accepting responses.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicForm();
  }, [slug, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="loading loading-spinner loading-md text-[#4F46E5]"></div>
          <span className="text-xs font-semibold text-[#64748B]">Loading form questions...</span>
        </div>
      </div>
    );
  }

  if (errorStatus === 403) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <div className="mx-auto p-3 bg-slate-50 text-[#64748B] rounded-full mb-3 shrink-0 w-fit">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">Form in Draft Mode</h2>
          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{errorMsg}</p>
          <Link to="/" className="inline-flex items-center justify-center mt-6 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (errorStatus === 400 || errorMsg === 'This form is no longer accepting responses.') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <div className="mx-auto p-3 bg-red-50 text-red-500 rounded-full mb-3 shrink-0 w-fit">
            <Calendar className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">Form No Longer Accepting Responses</h2>
          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{errorMsg}</p>
          <Link to="/" className="inline-flex items-center justify-center mt-6 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!formSchema) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <h2 className="text-lg font-bold text-red-500">Form Not Found</h2>
          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{errorMsg || 'The link you followed is invalid, or the form has been removed by the administrator.'}</p>
          <Link to="/" className="inline-flex items-center justify-center mt-6 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const activeFields = formSchema.fields || [];
  
  // Calculate progress
  const filledFieldsCount = activeFields.filter(field => {
    if (field.type === 'divider') return false;
    const value = watchedValues[`field-${field.id}`];
    if (value === undefined || value === null || value === '') return false;
    if (field.type === 'checkbox') return value === true || (Array.isArray(value) && value.length > 0);
    if (field.type === 'file') return value && value.length > 0;
    return true;
  }).length;

  const inputFieldsCount = activeFields.filter(f => f.type !== 'divider').length;
  const progressPercentage = inputFieldsCount > 0 
    ? Math.round((filledFieldsCount / inputFieldsCount) * 100) 
    : 0;

  const onSubmit = async (data) => {
    const target = slug || id;
    const formattedAnswers = {};
    const receiptAnswers = {};

    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };

    setLoading(true);
    try {
      // Process fields asynchronously to read files
      await Promise.all(
        activeFields.map(async (field) => {
          if (field.type === 'divider') return;
          const value = data[`field-${field.id}`];

          if (field.type === 'file' && value && value.length > 0) {
            const fileObj = value[0];
            const base64Data = await readFileAsBase64(fileObj);
            const filePayload = {
              name: fileObj.name,
              size: fileObj.size,
              type: fileObj.type,
              data: base64Data,
            };
            formattedAnswers[field.id] = filePayload;
            receiptAnswers[field.label || field.id] = filePayload;
          } else {
            formattedAnswers[field.id] = value;
            receiptAnswers[field.label || field.id] = value;
          }
        })
      );

      await submitPublicResponse(target, {
        answers: formattedAnswers,
        completionTime: 0,
      });

      setSubmittedAnswers(receiptAnswers);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    reset();
    setSubmittedAnswers(null);
    setSubmitted(false);
  };

  const renderField = (field) => {
    const registerRules = {
      required: field.required ? 'This field is required' : false
    };

    if (field.type === 'email') {
      registerRules.pattern = {
        value: /^\S+@\S+$/i,
        message: 'Please enter a valid email address'
      };
    }

    const fieldError = errors[`field-${field.id}`];
    const isError = !!fieldError;

    const inputClasses = `w-full bg-white border text-xs text-[#0F172A] rounded-lg px-3 py-2.5 outline-none transition-colors ${
      isError 
        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
        : 'border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            placeholder={field.placeholder || ''}
            className={inputClasses}
            {...register(`field-${field.id}`, registerRules)}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className={inputClasses}
            {...register(`field-${field.id}`, registerRules)}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || ''}
            className={`${inputClasses} min-h-[100px] resize-none`}
            {...register(`field-${field.id}`, registerRules)}
          />
        );
      case 'select':
        return (
          <div className="relative">
            <select
              className={inputClasses}
              defaultValue=""
              {...register(`field-${field.id}`, registerRules)}
            >
              <option disabled value="">Choose an option...</option>
              {field.options?.map((o, idx) => (
                <option key={idx} value={o}>{o}</option>
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
          <div className="space-y-2.5 py-1">
            {field.options?.map((o, idx) => (
              <label key={idx} className="flex items-center gap-2.5 text-xs text-[#0F172A] cursor-pointer">
                <input
                  type="radio"
                  value={o}
                  className="h-4 w-4 border-[#E2E8F0] text-[#4F46E5] focus:ring-0"
                  {...register(`field-${field.id}`, registerRules)}
                />
                <span>{o}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2.5 py-1">
            {field.options?.map((o, idx) => (
              <label key={idx} className="flex items-center gap-2.5 text-xs text-[#0F172A] cursor-pointer">
                <input
                  type="checkbox"
                  value={o}
                  className="h-4 w-4 rounded border-[#E2E8F0] text-[#4F46E5] focus:ring-0"
                  {...register(`field-${field.id}`, registerRules)}
                />
                <span>{o}</span>
              </label>
            ))}
          </div>
        );
      case 'file': {
        const fileList = watchedValues[`field-${field.id}`];
        const fileName = fileList && fileList.length > 0 ? fileList[0].name : '';
        return (
          <div className="border border-dashed border-[#E2E8F0] rounded-xl p-5 bg-slate-50 text-center flex flex-col items-center justify-center gap-2">
            <Upload className={`h-5 w-5 ${fileName ? 'text-green-600' : 'text-[#64748B] opacity-60'}`} />
            <input
              type="file"
              className="hidden"
              id={`file-upload-${field.id}`}
              {...register(`field-${field.id}`, registerRules)}
            />
            {fileName ? (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-800 block">Selected: {fileName}</span>
                <label htmlFor={`file-upload-${field.id}`} className="text-[10px] text-[#4F46E5] hover:underline cursor-pointer font-bold block">
                  Change file
                </label>
              </div>
            ) : (
              <>
                <label htmlFor={`file-upload-${field.id}`} className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer">
                  Click to select a file
                </label>
                <span className="text-[10px] text-[#64748B]">Max size: 10MB</span>
              </>
            )}
          </div>
        );
      }
      case 'rating': {
        const ratingVal = Number(watchedValues[`field-${field.id}`]) || 0;
        return (
          <div className="flex gap-1 py-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setValue(`field-${field.id}`, val, { shouldValidate: true })}
                className="focus:outline-none transition-transform active:scale-95 animate-none"
              >
                <Star 
                  className={`h-7 w-7 transition-colors ${
                    val <= ratingVal 
                      ? 'text-amber-400 fill-amber-400' 
                      : 'text-[#E2E8F0] fill-none'
                  }`} 
                />
              </button>
            ))}
            {/* Hidden field registration */}
            <input
              type="hidden"
              value={ratingVal || ''}
              {...register(`field-${field.id}`, registerRules)}
            />
          </div>
        );
      }
      case 'address':
        return (
          <div className="space-y-2.5 p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
            <input 
              type="text" 
              placeholder="Street Address" 
              className="w-full bg-white border border-[#E2E8F0] rounded px-3 py-2 text-xs outline-none focus:border-[#4F46E5]" 
              {...register(`field-${field.id}-street`, registerRules)}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input 
                type="text" 
                placeholder="City" 
                className="w-full bg-white border border-[#E2E8F0] rounded px-3 py-2 text-xs outline-none focus:border-[#4F46E5]" 
                {...register(`field-${field.id}-city`, registerRules)}
              />
              <input 
                type="text" 
                placeholder="State / Region" 
                className="w-full bg-white border border-[#E2E8F0] rounded px-3 py-2 text-xs outline-none focus:border-[#4F46E5]" 
                {...register(`field-${field.id}-state`, registerRules)}
              />
            </div>
          </div>
        );
      case 'signature':
        return (
          <div className="border border-[#E2E8F0] rounded-lg bg-slate-50 h-24 flex flex-col items-center justify-center p-4 relative">
            <input
              type="text"
              placeholder="Type initials to sign (e.g. J.D.)"
              className="w-full bg-transparent text-center text-sm font-semibold text-[#0F172A] outline-none"
              {...register(`field-${field.id}`, registerRules)}
            />
            <span className="absolute bottom-1.5 right-2 text-[8px] text-[#64748B] opacity-50 flex items-center gap-1">
              <PenTool className="h-2 w-2" />
              Verified Electronic Signature
            </span>
          </div>
        );
      case 'divider':
        return <hr className="border-[#E2E8F0] my-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between select-none font-sans">
      
      {/* Main Form intake panel */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
          
          {submitted ? (
            /* Success submit view */
            <div className="p-8 md:p-12 flex flex-col items-center text-center gap-6">
              <div className="p-4 bg-green-50 text-[#4F46E5] rounded-full shrink-0">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0F172A]">Response Submitted Successfully</h1>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Thank you for submitting this form.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 w-full justify-center">
                <button
                  onClick={handleResetForm}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Response
                </button>
                <Link
                  to="/"
                  className="border border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </Link>
              </div>
            </div>
          ) : (
            /* Unsubmitted form intake */
            <div>
              {/* Top Accent Strip */}
              <div className="h-1.5 w-full bg-[#4F46E5]"></div>
              
              {/* Progress header */}
              {inputFieldsCount > 0 && (
                <div className="bg-slate-50 px-6 py-4 border-b border-[#E2E8F0]">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#64748B] mb-2">
                    <span>Completion Progress</span>
                    <span>{progressPercentage}% ({filledFieldsCount}/{inputFieldsCount} fields)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#4F46E5] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>
              )}

              <div className="p-6 md:p-8 space-y-6">
                
                {/* Title and details */}
                <div className="border-b border-[#E2E8F0] pb-5">
                  <h1 className="text-xl font-bold text-[#0F172A] leading-tight">
                    {formSchema.title}
                  </h1>
                  {formSchema.description && (
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                      {formSchema.description}
                    </p>
                  )}
                </div>

                {/* Form fields rendering */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {activeFields.map((field) => {
                    const hasError = !!errors[`field-${field.id}`];
                    const isHalf = field.width === 'half';

                    return (
                      <div 
                        key={field.id} 
                        className={`flex flex-col gap-1.5 ${isHalf ? 'inline-block w-[calc(50%-8px)] mr-2 align-top' : 'w-full block'}`}
                      >
                        {field.type !== 'divider' && (
                          <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-1">
                            {field.label}
                            {field.required && <span className="text-red-500 font-bold">*</span>}
                          </label>
                        )}
                        
                        {renderField(field)}

                        {hasError && (
                          <span className="text-xs text-red-500 font-medium">
                            {errors[`field-${field.id}`].message}
                          </span>
                        )}
                        {field.helpText && !hasError && (
                          <span className="text-[10px] text-[#64748B]">{field.helpText}</span>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-4 border-t border-[#E2E8F0] mt-6">
                    <button 
                      type="submit" 
                      className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Answers
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="py-6 border-t border-[#E2E8F0] bg-white text-center shrink-0">
        <span className="text-[10px] text-[#64748B] font-medium">Powered by <span className="font-bold text-[#4F46E5]">FormForge</span></span>
      </footer>

    </div>
  );
};

export default PublicForm;
