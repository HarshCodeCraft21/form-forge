import React, { useState, useEffect } from 'react';
import { 
  Download, 
  History, 
  FileSpreadsheet, 
  FileText, 
  FileDown,
  CheckCircle2
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

export const GeneralExport = () => {
  const { forms, responses, exportHistory, addExportRecord, fetchForms, fetchResponses } = useFormStore();
  const [exporting, setExporting] = useState(null); // { formId, format } | null
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    if (forms.length === 0) fetchForms();
    if (responses.length === 0) fetchResponses();
  }, [fetchForms, fetchResponses, forms.length, responses.length]);


  const handleExport = async (formId, formTitle, format) => {
    const formResponses = responses.filter(r => r.formId === formId);
    const recordsCount = formResponses.length;

    if (recordsCount === 0) {
      setAlertMsg(`Cannot export "${formTitle}". There are no submissions recorded for this form yet.`);
      setTimeout(() => setAlertMsg(''), 3000);
      return;
    }

    setExporting({ formId, format });
    try {
      // Simulate payload packaging delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Save record in Zustand store
      addExportRecord(format, formTitle, recordsCount);
      
      setAlertMsg(`Success! ${format} export file generated and downloaded.`);
      setTimeout(() => setAlertMsg(''), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6 select-none relative font-sans">
      
      {/* Toast Alert */}
      {alertMsg && (
        <div className="fixed top-6 right-6 z-[200] shadow-xl bg-slate-900 text-white py-3 px-5 rounded-lg flex gap-3 items-center border border-slate-800 max-w-md">
          <CheckCircle2 className="h-5 w-5 text-[#4F46E5] shrink-0" />
          <span className="font-semibold text-xs leading-relaxed">{alertMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <Download className="h-6 w-6 text-[#64748B]" />
          Exports Center
        </h1>
        <p className="text-xs text-[#64748B] mt-1">Convert collected form response datasets into downloadable spreadsheets or report documents.</p>
      </div>

      {/* Active Forms list for Exports */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="px-5 py-4 bg-slate-50 border-b border-[#E2E8F0]">
          <h3 className="font-semibold text-sm text-[#0F172A]">Export Available Datasets</h3>
          <p className="text-[11px] text-[#64748B] mt-0.5">Select a form dataset to download responses in CSV, Excel, or PDF formats.</p>
        </div>

        {forms.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50">
            <span className="text-xs text-[#64748B] font-semibold">No active forms available. Create a form first.</span>
          </div>
        ) : (
          <Table headers={['Form Name', 'Total Records', 'Download Form Data']}>
            {forms.map((form) => {
              const count = responses.filter(r => r.formId === form.id).length;
              return (
                <tr key={form.id} className="border-b border-[#E2E8F0] hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-xs text-[#0F172A] block">{form.title}</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5 truncate max-w-[240px]">{form.description || 'No description provided.'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#0F172A] font-semibold">
                    {count} response{count !== 1 ? 's' : ''}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => handleExport(form.id, form.title, 'CSV')}
                        loading={exporting?.formId === form.id && exporting?.format === 'CSV'}
                        variant="neutral"
                        size="xs"
                        className="gap-1 border-[#E2E8F0] hover:bg-slate-100 py-1 px-2.5"
                      >
                        <FileText className="h-3 w-3 text-[#64748B]" />
                        CSV
                      </Button>
                      <Button
                        onClick={() => handleExport(form.id, form.title, 'Excel')}
                        loading={exporting?.formId === form.id && exporting?.format === 'Excel'}
                        variant="neutral"
                        size="xs"
                        className="gap-1 border-[#E2E8F0] hover:bg-slate-100 py-1 px-2.5"
                      >
                        <FileSpreadsheet className="h-3 w-3 text-blue-600" />
                        Excel
                      </Button>
                      <Button
                        onClick={() => handleExport(form.id, form.title, 'PDF')}
                        loading={exporting?.formId === form.id && exporting?.format === 'PDF'}
                        variant="neutral"
                        size="xs"
                        className="gap-1 border-[#E2E8F0] hover:bg-slate-100 py-1 px-2.5"
                      >
                        <FileDown className="h-3 w-3 text-red-500" />
                        PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </section>

      {/* Global export history logs */}
      <section className="space-y-4">
        <h3 className="font-semibold text-sm text-[#0F172A] flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-[#64748B] shrink-0" />
          Export History logs
        </h3>
        
        <Table headers={['Export ID', 'Format', 'Form Title', 'Total Records', 'Download Date', 'Status']}>
          {exportHistory.map((item) => (
            <tr key={item.id} className="border-b border-[#E2E8F0] hover:bg-slate-50/50">
              <td className="px-5 py-3 font-mono text-[10px] text-[#64748B]">{item.id}</td>
              <td className="px-5 py-3">
                <span className={`text-[9px] px-2 py-0.5 font-bold rounded uppercase border ${
                  item.format === 'Excel' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                  item.format === 'PDF' ? 'bg-red-50 text-red-700 border-red-200' : 
                  'bg-green-50 text-green-700 border-green-200'
                }`}>
                  {item.format}
                </span>
              </td>
              <td className="px-5 py-3 font-semibold text-xs text-[#0F172A]">{item.formTitle}</td>
              <td className="px-5 py-3 font-mono text-xs text-[#0F172A]">{item.records} rows</td>
              <td className="px-5 py-3 text-xs text-[#64748B]">{item.date}</td>
              <td className="px-5 py-3">
                <span className="text-[9px] px-2 py-0.5 font-bold rounded bg-green-50 text-green-700 border border-green-200 uppercase">
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      </section>

    </div>
  );
};

export default GeneralExport;
