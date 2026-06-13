import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Inbox, 
  FileText,
  MoreVertical,
  Share2,
  Copy,
  QrCode,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export const FormList = () => {
  const navigate = useNavigate();
  const { forms, deleteForm, fetchForms } = useFormStore();
  
  // State variables
  const [viewMode, setViewMode] = useState('card'); // card | table
  const [searchQuery, setSearchQuery] = useState('');
  const [formToDelete, setFormToDelete] = useState(null);
  const [qrForm, setQrForm] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch forms on mount
  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Filters logic
  const filteredForms = forms.filter((form) => {
    return form.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (form.description || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDeleteConfirm = () => {
    if (formToDelete) {
      deleteForm(formToDelete.id);
      setFormToDelete(null);
      showToast('Form template deleted');
    }
  };

  const handleShowQR = (form) => {
    setQrForm(form);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    showToast('Form Link copied!');
  };


  return (
    <div className="space-y-8 select-none font-sans relative">
      
      {/* Toast Alert pop */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] shadow-xl bg-slate-900 text-white py-3 px-5 rounded-lg flex gap-3 items-center border border-slate-800 animate-bounce">
          <FileCheck className="h-5 w-5 text-[#4F46E5]" />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[#0F172A] font-bold text-3xl leading-tight">My Forms</h1>
          <p className="text-sm text-[#64748B] mt-1">Browse, preview, and share dynamic intake templates.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/forms/templates">
            <Button variant="secondary" size="sm" className="font-semibold border-slate-200 cursor-pointer">
              Browse Templates
            </Button>
          </Link>
          <Link to="/forms/new">
            <Button variant="primary" size="sm" className="font-semibold shadow-sm gap-1 cursor-pointer">
              <Plus className="h-4 w-4" />
              New Blank Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Grid modes */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.01)]">
        
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search forms by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered focus:input-primary pl-10 w-full text-sm h-10"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]/60 h-4 w-4" />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          
          {/* Toggle View mode */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-[#E2E8F0] gap-0.5">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'card' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              title="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Forms content rendering */}
      {filteredForms.length === 0 ? (
        <EmptyState
          title="No forms found"
          description="Create your first form and start collecting responses."
          icon={FileText}
          actionText="Create Form"
          onAction={() => navigate('/forms/new')}
        />
      ) : viewMode === 'card' ? (
        /* Card Layout view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="relative flex flex-col justify-between hover:border-slate-350">
              
              {/* Form card details */}
              <Card.Body className="p-6 gap-3.5">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">ID: {form.id.substring(0, 8)}</span>
                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      form.status === 'published' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {form.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    
                    {/* Actions Dropdown */}
                    <div className="dropdown dropdown-end relative z-30">
                      <div tabIndex={0} role="button" className="p-1 hover:bg-slate-100 rounded-lg text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                      </div>
                      <ul tabIndex={0} className="dropdown-content menu p-1.5 shadow-lg bg-white border border-[#E2E8F0] rounded-lg w-40 z-50 text-xs font-semibold text-[#0F172A]">
                        <li>
                          <button onClick={() => navigate(`/forms/${form.id}/edit`)} className="px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 rounded-md cursor-pointer text-left w-full block">
                            <Edit className="h-3.5 w-3.5 text-[#64748B]" />
                            Edit Form
                          </button>
                        </li>

                        <li>
                          <button onClick={() => navigate(`/forms/${form.id}/preview`)} className="px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 rounded-md cursor-pointer text-left w-full block">
                            <Eye className="h-3.5 w-3.5 text-[#64748B]" />
                            Preview
                          </button>
                        </li>
                        <li>
                          <button onClick={() => navigate(`/forms/${form.id}/share`)} className="px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 rounded-md cursor-pointer text-left w-full block">
                            <Share2 className="h-3.5 w-3.5 text-[#64748B]" />
                            Share Form
                          </button>
                        </li>
                        <li>
                          <button onClick={() => setFormToDelete(form)} className="px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-md cursor-pointer text-left w-full block">
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 
                    onClick={() => navigate(`/forms/${form.id}/edit`)}
                    className="font-bold text-base text-[#0F172A] hover:text-[#4F46E5] transition-colors cursor-pointer"
                  >
                    {form.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">{form.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-center">
                  <div className="p-2 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                    <div className="text-sm font-bold text-[#0F172A]">{form.fields?.length || 0}</div>
                    <div className="text-[9px] text-[#64748B] font-bold uppercase">Questions</div>
                  </div>
                  <div className="p-2 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                    <div className="text-sm font-bold text-[#0F172A]">{form.responsesCount || 0}</div>
                    <div className="text-[9px] text-[#64748B] font-bold uppercase">Submissions</div>
                  </div>
                </div>
              </Card.Body>

              {/* Form card actions */}
              <Card.Footer className="px-5 py-3 bg-slate-50 border-t border-[#E2E8F0] flex justify-between items-center gap-2">
                <button
                  onClick={() => navigate(`/responses/${form.id}`)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B] hover:text-[#4F46E5] transition-colors cursor-pointer"
                >
                  <Inbox className="h-3.5 w-3.5 text-[#64748B]" />
                  Responses ({form.responsesCount || 0})
                </button>
                {form.status === 'published' ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleCopyLink(`${window.location.origin}/f/${form.slug}`)}
                      className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 border border-[#E2E8F0] text-[10px] font-bold text-[#0F172A] px-2.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      <Copy className="h-3 w-3 text-[#64748B]" />
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleShowQR(form)}
                      className="inline-flex items-center justify-center p-1.5 border border-[#E2E8F0] bg-white hover:bg-slate-100 rounded-lg text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                      title="Generate QR Code"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/forms/${form.id}/share`)}
                    className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 border border-[#E2E8F0] text-[10px] font-bold text-[#64748B] hover:text-[#0F172A] px-2.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <Share2 className="h-3 w-3 text-[#64748B]" />
                    Share Draft
                  </button>
                )}
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        /* Table Layout view */
        <Table headers={['Form Name', 'Status', 'Questions', 'Submissions', 'Created On', 'Actions']}>
          {filteredForms.map((form) => (
            <tr key={form.id} className="hover:bg-slate-50/50">
              <td className="px-5 py-3.5">
                <div 
                  onClick={() => navigate(`/forms/${form.id}/edit`)}
                  className="font-bold text-[#0F172A] hover:text-[#4F46E5] cursor-pointer transition-colors"
                >
                  {form.title}
                </div>
                <div className="text-xs text-[#64748B] truncate max-w-[300px] mt-0.5">{form.description}</div>
              </td>
              <td className="px-5 py-3.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  form.status === 'published' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {form.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="px-5 py-3.5 font-semibold text-center">{form.fields?.length || 0}</td>
              <td className="px-5 py-3.5 font-mono text-xs font-semibold text-center">{form.responsesCount || 0}</td>
              <td className="px-5 py-3.5 text-xs text-[#64748B]">
                {new Date(form.createdAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/forms/${form.id}/edit`)} className="btn btn-xs btn-outline font-semibold normal-case cursor-pointer">Edit</button>
                  {form.status === 'published' && (
                    <button onClick={() => handleCopyLink(`${window.location.origin}/f/${form.slug}`)} className="btn btn-xs btn-outline btn-secondary font-semibold normal-case cursor-pointer">Copy Link</button>
                  )}
                  <button onClick={() => navigate(`/forms/${form.id}/share`)} className="btn btn-xs btn-outline btn-secondary font-semibold normal-case cursor-pointer">Share</button>
                  <button onClick={() => navigate(`/responses/${form.id}`)} className="btn btn-xs btn-outline btn-secondary font-semibold normal-case text-primary cursor-pointer">View Responses</button>
                  <button onClick={() => setFormToDelete(form)} className="btn btn-xs btn-ghost text-[#EF4444] hover:bg-red-50 font-semibold normal-case cursor-pointer">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!formToDelete}
        onClose={() => setFormToDelete(null)}
        title="Delete Form Template"
      >
        <div className="space-y-4 font-sans">
          <p className="text-sm text-[#64748B] leading-relaxed">
            Are you sure you want to delete <span className="font-extrabold text-[#EF4444]">"{formToDelete?.title}"</span>? This will permanently erase all configuration data and all user submissions database records.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setFormToDelete(null)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="error" size="sm" onClick={handleDeleteConfirm} className="cursor-pointer">
              Wipe Form
            </Button>
          </div>
        </div>
      </Modal>

      {/* QR Code Modal Overlay */}
      <Modal
        isOpen={!!qrForm}
        onClose={() => setQrForm(null)}
        title="Form QR Code Support"
      >
        {qrForm && (
          <div className="space-y-5 py-1 text-center font-sans">
            <div>
              <h4 className="font-bold text-sm text-[#0F172A]">{qrForm.title}</h4>
              <p className="text-xs text-[#64748B] mt-0.5">Scan to open and submit responses to the public form.</p>
            </div>

            <div className="flex justify-center p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl w-fit mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/f/${qrForm.slug}`)}`}
                alt="Form QR Code"
                className="h-40 w-40 bg-white border border-[#E2E8F0] rounded-lg p-1"
              />
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/f/${qrForm.slug}`)}`);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = `${qrForm.title.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                    showToast('QR Code download initialized');
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="btn btn-sm btn-primary font-semibold normal-case gap-1.5 cursor-pointer"
              >
                Download QR Code
              </button>
              <button
                onClick={() => {
                  handleCopyLink(`${window.location.origin}/f/${qrForm.slug}`);
                  setQrForm(null);
                }}
                className="btn btn-sm btn-outline font-semibold normal-case gap-1.5 cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default FormList;
