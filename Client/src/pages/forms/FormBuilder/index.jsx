import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  Sparkles,
  Info,
  Layers,
  FileCheck,
  Send,
  Share2
} from 'lucide-react';
import { useFormStore } from '../../../store/useFormStore';
import { getFormById } from '../../../api/forms.api';
import Toolbox from './Toolbox';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

export const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { forms, addForm, updateForm, publishForm } = useFormStore();

  const isEditMode = !!id;

  // Form level states
  const [formTitle, setFormTitle] = useState('New Dynamic Form');
  const [formDescription, setFormDescription] = useState('Describe the purpose of this form survey...');
  const [fields, setFields] = useState([]);
  const [activeFieldId, setActiveFieldId] = useState(null);
  
  // Expiry states
  const [expiryDate, setExpiryDate] = useState('');
  const [disableAfterExpiry, setDisableAfterExpiry] = useState(false);

  // Modals & UI States
  const [toastMessage, setToastMessage] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState('');
  const [showQRBox, setShowQRBox] = useState(false);

  // Load existing form on Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const existing = forms.find(f => f.id === id);
      if (existing) {
        setFormTitle(existing.title);
        setFormDescription(existing.description || '');
        setFields(existing.fields || []);
        setExpiryDate(existing.expiryDate || '');
        setDisableAfterExpiry(!!existing.disableAfterExpiry);
        if (existing.fields && existing.fields.length > 0) {
          setActiveFieldId(existing.fields[0].id);
        }
      } else {
        // Fetch from API directly using centralized forms.api wrapper to support refresh
        getFormById(id)
          .then((form) => {
            setFormTitle(form.title);
            setFormDescription(form.description || '');
            setFields(form.fields || []);
            setExpiryDate(form.expiryDate || '');
            setDisableAfterExpiry(!!form.disableAfterExpiry);
            if (form.fields && form.fields.length > 0) {
              setActiveFieldId(form.fields[0].id);
            }
          })
          .catch((err) => {
            console.error('Failed to load form by ID:', err);
            navigate('/forms');
          });
      }
    }
  }, [id, isEditMode, forms, navigate]);


  // Toolbox actions
  const handleAddElement = (type) => {
    const newId = `field-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const defaults = {
      text: { label: 'Short Answer Input', placeholder: 'Enter single line answer...' },
      textarea: { label: 'Long Answer Input', placeholder: 'Enter long comment answer...' },
      email: { label: 'Email Address', placeholder: 'your@email.com' },
      phone: { label: 'Phone Number', placeholder: '+1 (555) 000-0000' },
      number: { label: 'Number Input', placeholder: 'Enter numeric value...' },
      date: { label: 'Date Picker', placeholder: 'Select date' },
      select: { label: 'Dropdown Select', placeholder: 'Select choice...', options: ['Choice 1', 'Choice 2', 'Choice 3'] },
      radio: { label: 'Multiple Choice Radio', options: ['Option A', 'Option B'] },
      checkbox: { label: 'Checkbox Select', options: ['Accept Option'] },
      file: { label: 'File Upload', placeholder: 'Click to select files...' },
      rating: { label: 'Rate satisfaction' },
      address: { label: 'Mailing Address' },
      signature: { label: 'Please sign here' },
      divider: { label: 'Divider Section' }
    }[type] || { label: 'Custom Element' };

    const newField = {
      id: newId,
      type,
      required: false,
      width: 'full',
      ...defaults
    };

    setFields(prev => [...prev, newField]);
    setActiveFieldId(newId);
  };

  // Canvas field management
  const handleRemoveField = (fieldId) => {
    setFields(prev => prev.filter(f => f.id !== fieldId));
    if (activeFieldId === fieldId) {
      setActiveFieldId(null);
    }
  };

  const handleDuplicateField = (fieldId) => {
    const targetIdx = fields.findIndex(f => f.id === fieldId);
    if (targetIdx === -1) return;

    const source = fields[targetIdx];
    const clone = {
      ...source,
      id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: `${source.label} (Copy)`
    };

    const updated = [...fields];
    updated.splice(targetIdx + 1, 0, clone);
    setFields(updated);
    setActiveFieldId(clone.id);
  };

  const handleMoveField = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fields.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...fields];
    
    // Swap elements
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setFields(updated);
  };

  // Property panel modifications
  const handleUpdateField = (fieldId, updatedProps) => {
    setFields(prev => prev.map(f => 
      f.id === fieldId ? { ...f, ...updatedProps } : f
    ));
  };

  // Save/Publish handlers
  const handleSaveForm = () => {
    const existing = isEditMode ? forms.find(f => f.id === id) : null;
    const formStatus = existing ? existing.status : 'draft';
    const formSlug = existing ? existing.slug : null;
    const formPublishedAt = existing ? existing.publishedAt : null;

    const formSchema = {
      title: formTitle,
      description: formDescription,
      fields,
      status: formStatus,
      slug: formSlug,
      expiryDate: expiryDate || null,
      disableAfterExpiry: !!disableAfterExpiry,
      publishedAt: formPublishedAt
    };

    if (isEditMode) {
      updateForm(id, formSchema).then(() => {
        showToast('Form template changes saved!');
        setTimeout(() => navigate('/forms'), 1000);
      }).catch(err => console.error(err));
    } else {
      addForm(formSchema).then((created) => {
        showToast('New form workspace created!');
        setTimeout(() => navigate(`/forms/${created._id || created.id}/edit`), 1000);
      }).catch(err => console.error(err));
      return;
    }
  };

  const handlePublishForm = () => {
    if (fields.length === 0) {
      showToast('Cannot publish an empty form. Please add at least one field.');
      return;
    }

    const existing = isEditMode ? forms.find(f => f.id === id) : null;
    let targetSlug = existing ? existing.slug : null;
    const formPublishedAt = (existing && existing.publishedAt) || new Date().toISOString();

    const formSchema = {
      title: formTitle,
      description: formDescription,
      fields,
      status: 'published',
      expiryDate: expiryDate || null,
      disableAfterExpiry: !!disableAfterExpiry,
      publishedAt: formPublishedAt
    };

    if (isEditMode) {
      updateForm(id, formSchema).then(async () => {
        await publishForm(id, { expiresAt: expiryDate || null });
        // Retrieve updated slug/config
        const updated = forms.find(f => f.id === id);
        targetSlug = updated ? updated.slug : targetSlug;
        setPublishedSlug(targetSlug);
        setShowPublishModal(true);
        showToast('Form published successfully!');
      }).catch(err => console.error(err));
    } else {
      addForm({ ...formSchema, status: 'published' }).then(async (created) => {
        await publishForm(created._id || created.id, { expiresAt: expiryDate || null });
        targetSlug = created.slug;
        setPublishedSlug(targetSlug);
        setShowPublishModal(true);
        showToast('Form published successfully!');
        // Replace with edit route inside browser history to allow direct refresh
        navigate(`/forms/${created._id || created.id}/edit`, { replace: true });
      }).catch(err => console.error(err));
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const activeField = fields.find(f => f.id === activeFieldId);

  return (
    <div className="space-y-6 select-none relative font-sans">
      
      {/* Toast Alert pop */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] shadow-xl bg-slate-900 text-white py-3 px-5 rounded-lg flex gap-3 items-center border border-slate-800 animate-bounce">
          <FileCheck className="h-5 w-5 text-[#4F46E5]" />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header breadcrumb & navigation actions */}
      <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Breadcrumb 
            items={[
              { label: 'Forms Manager', to: '/forms' },
              { label: isEditMode ? 'Edit Form' : 'New Form Workspace' }
            ]} 
          />
          <div className="flex gap-2 shrink-0">
            {isEditMode && (
              <>
                <Link to={`/forms/${id}/share`} className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#64748B] rounded-lg transition-colors">
                  <Share2 className="h-3.5 w-3.5" />
                  Share Settings
                </Link>
                <Link to={`/forms/${id}/preview`} className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#64748B] rounded-lg transition-colors">
                  <Eye className="h-3.5 w-3.5" />
                  Live Preview
                </Link>
              </>
            )}
            <Button 
              onClick={handleSaveForm}
              variant="secondary"
              size="sm"
              className="gap-1.5 normal-case font-semibold border-slate-200"
            >
              <Save className="h-3.5 w-3.5 text-[#64748B]" />
              Save changes
            </Button>
            <Button 
              onClick={handlePublishForm}
              variant="primary"
              size="sm"
              className="gap-1.5 normal-case font-semibold shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              Publish Form
            </Button>
          </div>
        </div>

        {/* Inputs for Title and Description */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-white p-5 rounded-xl border border-[#E2E8F0]">
          <div className="md:col-span-4 flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">Workspace Form Name</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 rounded-lg px-3 py-2 text-xs font-semibold text-[#0F172A] outline-none transition-colors"
              placeholder="e.g. Workshop Registration"
            />
          </div>
          <div className="md:col-span-8 flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">Form Description</label>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none transition-colors"
              placeholder="Describe the usage requirements..."
            />
          </div>
        </div>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Elements Toolbox (3 columns) */}
        <section className="lg:col-span-3">
          <Toolbox onAddElement={handleAddElement} />
        </section>

        {/* Center Live Canvas Workspace (6 columns) */}
        <section className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden min-h-[500px] flex flex-col shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[#0F172A] flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#64748B]" />
                Live Form Canvas Workspace
              </h3>
              <span className="text-[10px] font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-2 py-0.5 rounded-full">
                {fields.length} Elements
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-start">
              {fields.length > 0 && (
                <div className="bg-slate-50 border border-[#E2E8F0] text-xs py-3 px-4 rounded-lg mb-4 flex gap-2.5 items-start text-[#64748B]">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-[#4F46E5]" />
                  <div>
                    <span className="font-semibold block text-[#0F172A]">Editor Tip</span>
                    <p className="leading-relaxed mt-0.5 text-[#64748B]">Click any field in the workspace to open its label, placeholder, and validation rules in the settings panel on the right.</p>
                  </div>
                </div>
              )}
              {fields.length === 0 ? (
                <div className="my-auto py-16 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#E2E8F0] rounded-xl bg-slate-50/50">
                  <div className="p-3 bg-[#4F46E5]/5 text-[#4F46E5] rounded-full mb-3 shrink-0">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-xs text-[#0F172A]">Your Canvas is Empty</h4>
                  <p className="text-[11px] text-[#64748B] max-w-xs mt-1 leading-relaxed">
                    Select form items from the left elements toolbox to start building your custom form fields.
                  </p>
                </div>
              ) : (
                <Canvas
                  fields={fields}
                  activeFieldId={activeFieldId}
                  onSelectField={setActiveFieldId}
                  onRemoveField={handleRemoveField}
                  onDuplicateField={handleDuplicateField}
                  onMoveField={handleMoveField}
                />
              )}
            </div>
          </div>
        </section>

        {/* Right properties configuration panel (3 columns) */}
        <section className="lg:col-span-3">
          <PropertiesPanel
            selectedField={activeField}
            onUpdateField={handleUpdateField}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            disableAfterExpiry={disableAfterExpiry}
            setDisableAfterExpiry={setDisableAfterExpiry}
          />
        </section>

      </div>

      {/* Publish Success Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Form Published Successfully"
      >
        <div className="space-y-5 py-1">
          <p className="text-xs text-[#64748B] leading-relaxed">
            Your form is now live and ready to collect responses. Anyone with the public link can view and submit answers.
          </p>

          {/* Public Link display */}
          <div className="flex flex-col gap-1.5 bg-slate-50 border border-[#E2E8F0] p-3.5 rounded-lg">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">Public Share Link</span>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/f/${publishedSlug}`}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/f/${publishedSlug}`);
                  showToast('Form Link copied to clipboard!');
                }}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Sharing actions grid */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`${window.location.origin}/f/${publishedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors text-center"
            >
              Open Form
            </a>
            <button
              onClick={() => setShowQRBox(!showQRBox)}
              className="inline-flex items-center justify-center gap-1.5 border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer text-center"
            >
              {showQRBox ? 'Hide QR Code' : 'Generate QR Code'}
            </button>
            
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Please fill out this form: ${window.location.origin}/f/${publishedSlug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-[#E2E8F0] hover:bg-slate-50 text-green-700 text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors text-center"
            >
              Share via WhatsApp
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(`Form: ${formTitle}`)}&body=${encodeURIComponent(`Please fill out this form by visiting this link: ${window.location.origin}/f/${publishedSlug}`)}`}
              className="inline-flex items-center justify-center gap-1.5 border border-[#E2E8F0] hover:bg-slate-50 text-blue-700 text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors text-center"
            >
              Share via Email
            </a>
          </div>

          {/* QR Code expansion */}
          {showQRBox && (
            <div className="flex flex-col items-center justify-center border border-dashed border-[#E2E8F0] rounded-xl p-4 bg-slate-50/50 space-y-3.5">
              <span className="text-xs font-bold text-[#0F172A]">{formTitle} QR Code</span>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${window.location.origin}/f/${publishedSlug}`)}`}
                alt="QR Code"
                className="h-32 w-32 bg-white border border-[#E2E8F0] rounded-lg p-1"
              />
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/f/${publishedSlug}`)}`);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = `${formTitle.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="border border-[#E2E8F0] hover:bg-white text-[10px] font-semibold text-[#64748B] px-2.5 py-1 rounded transition-colors cursor-pointer"
              >
                Download QR Code Image
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowPublishModal(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default FormBuilder;
