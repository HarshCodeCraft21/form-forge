import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Inbox, 
  Search, 
  Trash2, 
  Download, 
  LayoutGrid, 
  List, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export const ResponseList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { forms, responses, deleteResponse, fetchForms, fetchResponses } = useFormStore();

  // State hooks
  const [selectedFormId, setSelectedFormId] = useState(id || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // table | card
  const [responseToDelete, setResponseToDelete] = useState(null);

  // Fetch initial data on mount
  useEffect(() => {
    fetchForms();
    fetchResponses();
  }, [fetchForms, fetchResponses]);

  // Keep selectedFormId updated if URL parameter changes
  useEffect(() => {
    if (id) {
      setSelectedFormId(id);
    }
  }, [id]);


  const activeForm = forms.find(f => f.id === selectedFormId);

  // Filter responses
  const filteredResponses = responses.filter((resp) => {
    const matchesForm = selectedFormId === 'all' || resp.formId === selectedFormId;
    
    // Search answers content
    const answerValuesString = Object.values(resp.answers || {})
      .map(val => String(val).toLowerCase())
      .join(' ');
    const matchesSearch = answerValuesString.includes(searchQuery.toLowerCase());

    return matchesForm && matchesSearch;
  });

  const handleDeleteConfirm = () => {
    if (responseToDelete) {
      deleteResponse(responseToDelete.id);
      setResponseToDelete(null);
    }
  };

  // Get table header labels based on selected form fields
  const getTableHeaders = () => {
    if (selectedFormId === 'all' || !activeForm) {
      return ['Form Name', 'Submitted Date', 'Answers Snapshot', 'Actions'];
    }
    const labels = activeForm.fields
      .filter(f => f.type !== 'divider')
      .slice(0, 3)
      .map(f => f.label);
    return [...labels, 'Submitted Date', 'Actions'];
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Inbox className="h-6 w-6 text-[#64748B]" />
            Submissions Console
          </h1>
          <p className="text-xs text-[#64748B] mt-1">Review client answers, browse data spreadsheet grids, and manage reports.</p>
        </div>
        

      </div>

      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        
        <div className="flex flex-col sm:flex-row flex-1 gap-3 items-stretch sm:items-center">
          
          {/* Select Form selector */}
          <select
            value={selectedFormId}
            onChange={(e) => {
              setSelectedFormId(e.target.value);
              navigate(e.target.value === 'all' ? '/responses' : `/responses/${e.target.value}`);
            }}
            className="border border-[#E2E8F0] focus:border-[#4F46E5] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] bg-white outline-none shrink-0"
          >
            <option value="all">All Submissions</option>
            {forms.map(f => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>

          {/* Search bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search answers content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#0F172A] outline-none transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]/60 h-3.5 w-3.5" />
          </div>

        </div>

        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
          
          {/* Export link */}
          {selectedFormId !== 'all' && (
            <Link 
              to={`/responses/${selectedFormId}/export`} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#64748B] rounded-lg transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-green-600" />
              Export
            </Link>
          )}

          {/* Table/Card toggle */}
          <div className="inline-flex bg-slate-100 p-1 rounded-lg gap-1 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'table' ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              title="Spreadsheet mode"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'card' ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              title="Card grid mode"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Grid rendering content */}
      {filteredResponses.length === 0 ? (
        <EmptyState
          title="No responses found"
          description="There are no responses recorded for the selected search parameters."
          icon={Inbox}
        />
      ) : viewMode === 'table' ? (
        /* Spreadsheet View mode */
        <Table headers={getTableHeaders()}>
          {filteredResponses.map((resp) => {
            const dateStr = new Date(resp.submittedAt).toLocaleDateString() + ' ' + new Date(resp.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const formObj = forms.find(f => f.id === resp.formId);

            if (selectedFormId === 'all') {
              // Generic layout for cross-form table
              const answersSummary = Object.entries(resp.answers || {})
                .map(([lbl, val]) => `${lbl}: ${val}`)
                .slice(0, 2)
                .join(' | ');

              return (
                <tr key={resp.id} className="hover:bg-slate-50/50 border-b border-[#E2E8F0]">
                  <td className="px-5 py-3.5 font-semibold text-xs text-[#0F172A]">
                    <Link to={`/responses/submission/${resp.id}`} className="hover:text-[#4F46E5] hover:underline">
                      {formObj?.title || 'Unknown Form'}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#64748B]">{dateStr}</td>
                  <td className="px-5 py-3.5 text-xs text-[#64748B] max-w-xs truncate">{answersSummary || 'No data'}</td>
                  <td className="px-5 py-3.5 text-xs">
                    <button 
                      onClick={() => setResponseToDelete(resp)}
                      className="text-red-500 hover:text-red-700 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            }

            // Columns mapped to specific fields for selected form
            const columns = activeForm.fields
              .filter(f => f.type !== 'divider')
              .slice(0, 3);

            return (
              <tr key={resp.id} className="hover:bg-slate-50/50 border-b border-[#E2E8F0]">
                {columns.map((col, idx) => {
                  const val = resp.answers[col.label];
                  const renderVal = val && typeof val === 'object' && val.name 
                    ? val.name 
                    : (val === true ? 'Yes' : val === false ? 'No' : String(val || ''));

                  return (
                    <td key={idx} className="px-5 py-3.5 text-xs text-[#0F172A] max-w-[150px] truncate">
                      {idx === 0 ? (
                        <Link to={`/responses/submission/${resp.id}`} className="font-semibold hover:text-[#4F46E5] hover:underline">
                          {renderVal}
                        </Link>
                      ) : (
                        renderVal
                      )}
                    </td>
                  );
                })}
                <td className="px-5 py-3.5 text-xs text-[#64748B]">{dateStr}</td>
                <td className="px-5 py-3.5 text-xs">
                  <button 
                    onClick={() => setResponseToDelete(resp)}
                    className="text-red-500 hover:text-red-700 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </Table>
      ) : (
        /* Card Layout View mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResponses.map((resp) => {
            const formObj = forms.find(f => f.id === resp.formId);
            return (
              <div key={resp.id} className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col justify-between overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Link to={`/responses/submission/${resp.id}`} className="font-semibold text-xs text-[#0F172A] hover:text-[#4F46E5] hover:underline">
                        {formObj?.title || 'Unknown Form'}
                      </Link>
                    </div>
                    <span className="text-[10px] text-[#64748B] font-mono">ID: {resp.id.substring(0, 8)}</span>
                  </div>

                  <div className="space-y-2 py-1 text-xs">
                    {Object.entries(resp.answers || {}).map(([lbl, val], idx) => {
                      const renderVal = val && typeof val === 'object' && val.name 
                        ? val.name 
                        : (val === true ? 'Yes' : val === false ? 'No' : String(val || ''));
                      
                      return (
                        <div key={idx} className="flex justify-between items-start gap-3 border-b border-dashed border-[#E2E8F0] pb-1.5">
                          <span className="text-[#64748B] shrink-0">{lbl}:</span>
                          <span className="font-semibold text-[#0F172A] text-right max-w-[200px] truncate">
                            {renderVal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-[#E2E8F0] flex justify-between items-center shrink-0">
                  <span className="text-[10px] text-[#64748B] font-semibold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                    {new Date(resp.submittedAt).toLocaleString()}
                  </span>
                  <div className="flex gap-3 items-center">
                    <Link
                      to={`/responses/submission/${resp.id}`}
                      className="text-xs font-semibold text-[#4F46E5] hover:underline"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setResponseToDelete(resp)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!responseToDelete}
        onClose={() => setResponseToDelete(null)}
        title="Delete Response Log"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#64748B] leading-relaxed">
            Are you sure you want to permanently delete this submission record? This operation is irreversible.
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setResponseToDelete(null)}>
              Cancel
            </Button>
            <Button variant="error" size="sm" onClick={handleDeleteConfirm}>
              Wipe Record
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ResponseList;
