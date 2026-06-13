import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Share2, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  QrCode, 
  EyeOff, 
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { getFormById } from '../../api/forms.api';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';

export const ShareForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { forms, publishForm, unpublishForm, regenerateFormSlug } = useFormStore();
  const [form, setForm] = useState(null);
  
  const [showQR, setShowQR] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const found = forms.find(f => f.id === id);
    if (found) {
      setForm(found);
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
          console.error('Failed to fetch form info:', err);
          navigate('/forms');
        });
    }
  }, [id, forms, navigate]);


  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  if (!form) return null;

  const publicUrl = `${window.location.origin}/f/${form.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    showToast('Form Link copied to clipboard!');
  };

  const handleUnpublish = () => {
    unpublishForm(form.id);
    showToast('Form unpublished (restored to Draft)');
  };

  const handlePublish = () => {
    publishForm(form.id);
    showToast('Form published successfully!');
  };

  const handleRegenerateSlug = () => {
    if (window.confirm('Are you sure you want to regenerate the share link? The previous link will stop working.')) {
      regenerateFormSlug(form.id);
      showToast('New sharing link generated!');
    }
  };

  return (
    <div className="space-y-6 font-sans relative select-none">
      {/* Toast popup Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] shadow-xl bg-slate-900 text-white py-3 px-5 rounded-lg flex gap-3 items-center border border-slate-800 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-[#4F46E5]" />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs & back link */}
      <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="flex items-center gap-3">
          <Link to="/forms" className="p-1.5 hover:bg-slate-100 rounded-lg text-[#64748B] hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <Breadcrumb 
            items={[
              { label: 'Forms Manager', to: '/forms' },
              { label: form.title, to: `/forms/${form.id}/edit` },
              { label: 'Share Settings' }
            ]} 
          />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Share2 className="h-6 w-6 text-[#64748B]" />
            Share Settings
          </h1>
          <p className="text-xs text-[#64748B] mt-1">Configure access links, download QR codes, and manage public publication status.</p>
        </div>
      </div>

      {/* Main card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left share controls (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-6">
            
            {/* Status section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-[#E2E8F0] rounded-lg">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">Publication Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${form.status === 'published' ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                  <h4 className="font-bold text-sm text-[#0F172A] capitalize">{form.status}</h4>
                </div>
              </div>
              <div className="shrink-0">
                {form.status === 'published' ? (
                  <Button onClick={handleUnpublish} variant="secondary" size="sm" className="gap-1.5 border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 cursor-pointer">
                    <EyeOff className="h-3.5 w-3.5" />
                    Unpublish Form
                  </Button>
                ) : (
                  <Button onClick={handlePublish} variant="primary" size="sm" className="gap-1.5 shadow-sm cursor-pointer">
                    <Send className="h-3.5 w-3.5" />
                    Publish Form
                  </Button>
                )}
              </div>
            </div>

            {/* Public Link details */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">Public Share Link</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Direct link to view and submit answers to this form survey.</p>
              </div>

              {form.status === 'published' ? (
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      readOnly
                      value={publicUrl}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-xs text-[#0F172A] outline-none font-medium"
                      onClick={(e) => e.target.select()}
                    />
                    <Button onClick={handleCopyLink} variant="primary" className="gap-1.5 shadow-sm shrink-0 cursor-pointer">
                      <Copy className="h-3.5 w-3.5" />
                      Copy Link
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-lg transition-colors cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-[#64748B]" />
                      Open Form Link
                    </a>
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#0F172A] rounded-lg transition-colors cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5 text-[#64748B]" />
                      {showQR ? 'Hide QR Code' : 'Generate QR Code'}
                    </button>
                    <button
                      onClick={handleRegenerateSlug}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#64748B] rounded-lg transition-colors cursor-pointer hover:text-[#0F172A]"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-[#64748B]" />
                      Regenerate Link
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-[#E2E8F0] rounded-xl bg-slate-50/50">
                  <EyeOff className="h-6 w-6 text-[#64748B] opacity-50 mx-auto mb-2" />
                  <h4 className="font-semibold text-xs text-[#0F172A]">Link Unavailable</h4>
                  <p className="text-[11px] text-[#64748B] mt-1 max-w-xs mx-auto leading-relaxed">
                    This form is currently a draft. Publish the form to generate a public link for gathering responses.
                  </p>
                </div>
              )}
            </div>

            {/* QR Code section */}
            {showQR && form.status === 'published' && (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-dashed border-[#E2E8F0] rounded-xl bg-slate-50/50">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}`}
                  alt="QR Code"
                  className="h-32 w-32 bg-white border border-[#E2E8F0] rounded-lg p-1 shrink-0"
                />
                <div className="space-y-2.5 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-[#0F172A]">Form QR Code Identifier</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed max-w-sm">
                    Download this unique QR code image to print or paste into presentations, enabling users to scan and open the form directly on their mobile devices.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicUrl)}`);
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = `${form.title.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="inline-flex items-center justify-center border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[11px] font-semibold text-[#0F172A] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Download QR Code PNG
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right metadata panel (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#64748B]">Form Summary Details</h3>
            
            <div className="divide-y divide-[#E2E8F0] text-xs">
              <div className="py-2.5 flex justify-between gap-2">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#64748B]" />
                  Created On
                </span>
                <span className="font-semibold text-[#0F172A]">
                  {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="py-2.5 flex justify-between gap-2">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                  Published On
                </span>
                <span className="font-semibold text-[#0F172A]">
                  {form.publishedAt ? new Date(form.publishedAt).toLocaleDateString() : 'Not published'}
                </span>
              </div>

              <div className="py-2.5 flex justify-between gap-2">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-[#64748B]" />
                  Total Submissions
                </span>
                <span className="font-semibold text-[#0F172A] font-mono">
                  {form.responsesCount || 0}
                </span>
              </div>
            </div>

            {form.expiryDate && (
              <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg space-y-1 text-xs">
                <span className="font-semibold text-[#0F172A] flex items-center gap-1 text-[#64748B]">
                  <Calendar className="h-3.5 w-3.5 text-[#4F46E5]" />
                  Expiration Deadline
                </span>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Responses will close on <span className="font-semibold text-[#0F172A]">{new Date(form.expiryDate).toLocaleDateString()}</span>.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ShareForm;
