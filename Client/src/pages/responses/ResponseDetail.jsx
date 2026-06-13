import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Trash2,
  CheckCircle,
  FileCheck,
  Download
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Button from '../../components/ui/Button';

export const ResponseDetail = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const { forms, responses, deleteResponse, fetchForms, fetchResponses } = useFormStore();
  const [response, setResponse] = useState(null);
  const [form, setForm] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (forms.length === 0 || responses.length === 0) {
        await Promise.all([fetchForms(), fetchResponses()]);
      }
      setLoading(false);
    };
    loadData();
  }, [fetchForms, fetchResponses, forms.length, responses.length]);

  useEffect(() => {
    if (loading) return;
    const foundResponse = responses.find(r => r.id === responseId);
    if (foundResponse) {
      setResponse(foundResponse);
      const foundForm = forms.find(f => f.id === foundResponse.formId);
      setForm(foundForm);
    } else {
      navigate('/responses');
    }
  }, [responseId, responses, forms, navigate, loading]);

  if (!response || !form) return null;

  const dateStr = new Date(response.submittedAt).toLocaleDateString() + ' ' + new Date(response.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleDelete = () => {
    deleteResponse(response.id);
    setToastMessage('Submission record successfully deleted.');
    setTimeout(() => {
      navigate(response.formId ? `/responses/${response.formId}` : '/responses');
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-3xl mx-auto">
      
      {/* Toast Alert pop */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] shadow-xl bg-slate-900 text-white py-3 px-5 rounded-lg flex gap-3 items-center border border-slate-800">
          <FileCheck className="h-5 w-5 text-red-500" />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header back navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] font-semibold border border-[#E2E8F0] hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>

        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 px-3 py-1.5 rounded-lg font-semibold transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete Record
        </button>
      </div>

      {/* Response Details Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        
        {/* Card Header info */}
        <div className="p-6 border-b border-[#E2E8F0] bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-[#4F46E5] rounded-lg border border-indigo-100">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Submission Details</span>
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#0F172A]">{form.title}</h1>
            {form.description && (
              <p className="text-xs text-[#64748B] mt-0.5">{form.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-[11px] text-[#64748B] pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Response ID: <span className="font-semibold text-[#0F172A] font-mono">{response.id}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Submitted on: <span className="font-semibold text-[#0F172A]">{dateStr}</span>
            </span>
          </div>
        </div>

        {/* Detailed Answers Content */}
        <div className="p-6 md:p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-dashed border-[#E2E8F0] pb-2">
            Recorded Form Answers
          </h3>

          <div className="space-y-6">
            {form.fields && form.fields.filter(f => f.type !== 'divider').map((field, index) => {
              const answerVal = response.answers[field.label];
              const isFile = answerVal && typeof answerVal === 'object' && answerVal.name && answerVal.data;

              return (
                <div key={field.id} className="space-y-1.5">
                  <div className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5">
                    <span className="text-[10px] bg-slate-100 text-[#64748B] px-1.5 py-0.5 rounded font-bold uppercase">
                      Q{index + 1}
                    </span>
                    <span>{field.label}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] leading-relaxed break-words font-medium">
                    {isFile ? (
                      <a
                        href={answerVal.data}
                        download={answerVal.name}
                        className="inline-flex items-center gap-2 text-[#4F46E5] hover:underline font-bold"
                      >
                        <Download className="h-4 w-4 text-green-600 shrink-0" />
                        Download {answerVal.name} ({Math.round(answerVal.size / 1024)} KB)
                      </a>
                    ) : answerVal !== undefined && answerVal !== null && answerVal !== '' ? (
                      answerVal === true ? 'Yes' : answerVal === false ? 'No' : String(answerVal)
                    ) : (
                      <span className="text-[#64748B]/50 italic">No response submitted.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>

    </div>
  );
};

export default ResponseDetail;
