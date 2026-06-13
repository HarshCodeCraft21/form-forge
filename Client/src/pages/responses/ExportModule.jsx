import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Download, 
  ArrowLeft, 
  History, 
  FileSpreadsheet, 
  FileText, 
  FileDown,
  CheckCircle2
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

export const ExportModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { forms, responses, exportHistory, addExportRecord, fetchForms, fetchResponses } = useFormStore();

  const [form, setForm] = useState(null);
  const [exporting, setExporting] = useState(null); // 'CSV' | 'Excel' | 'PDF' | null
  const [alertMsg, setAlertMsg] = useState('');
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
    const existing = forms.find(f => f.id === id);
    if (existing) {
      setForm(existing);
    } else {
      navigate('/responses');
    }
  }, [id, forms, navigate, loading]);


  if (!form) return null;

  const formResponses = responses.filter(r => r.formId === id);
  const recordsCount = formResponses.length;

  const handleExport = async (format) => {
    if (recordsCount === 0) {
      setAlertMsg('Cannot export empty list. Submit a response first.');
      setTimeout(() => setAlertMsg(''), 2500);
      return;
    }

    setExporting(format);
    try {
      // Simulate payload packaging delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Save record in Zustand
      addExportRecord(format, form.title, recordsCount);
      
      setAlertMsg(`Success! ${format} file downloaded.`);
      setTimeout(() => setAlertMsg(''), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6 select-none relative font-sans">
      
      {/* Toast popup Alert */}
      {alertMsg && (
        <div className="fixed top-6 right-6 z-[200] shadow-xl bg-slate-900 text-white py-3 px-5 rounded-lg flex gap-3 items-center border border-slate-800">
          <CheckCircle2 className="h-5 w-5 text-[#4F46E5]" />
          <span className="font-semibold text-xs">{alertMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Breadcrumb 
            items={[
              { label: 'Submissions', to: '/responses' },
              { label: form.title, to: `/responses/${id}` },
              { label: 'Export Console' }
            ]} 
          />
          <Link to={`/responses/${id}`} className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] font-semibold border border-[#E2E8F0] hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Spreadsheet
          </Link>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Download className="h-6 w-6 text-[#64748B]" />
            Export Console
          </h1>
          <p className="text-xs text-[#64748B] mt-1">Convert intake data grids into production sheets or downloadable file formats.</p>
        </div>
      </div>

      {/* Export Options Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CSV Card */}
        <Card className="hover:border-slate-300">
          <Card.Body className="p-6 flex flex-col justify-between items-center text-center gap-4 min-h-[240px]">
            <div className="p-4 bg-slate-50 text-green-600 border border-[#E2E8F0] rounded-xl shrink-0">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Comma Separated (CSV)</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Lightweight plaintext file suitable for scripting or database imports.</p>
            </div>
            <Button
              onClick={() => handleExport('CSV')}
              loading={exporting === 'CSV'}
              variant="neutral"
              size="sm"
              className="w-full gap-1.5 font-semibold text-xs border-[#E2E8F0] hover:bg-slate-50"
            >
              Export CSV ({recordsCount} rows)
            </Button>
          </Card.Body>
        </Card>

        {/* Excel Card */}
        <Card className="hover:border-slate-300">
          <Card.Body className="p-6 flex flex-col justify-between items-center text-center gap-4 min-h-[240px]">
            <div className="p-4 bg-slate-50 text-blue-600 border border-[#E2E8F0] rounded-xl shrink-0">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Excel Spreadsheet</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Complete spreadsheet workbook matching standard data processing formats.</p>
            </div>
            <Button
              onClick={() => handleExport('Excel')}
              loading={exporting === 'Excel'}
              variant="neutral"
              size="sm"
              className="w-full gap-1.5 font-semibold text-xs border-[#E2E8F0] hover:bg-slate-50"
            >
              Export Excel ({recordsCount} rows)
            </Button>
          </Card.Body>
        </Card>

        {/* PDF Card */}
        <Card className="hover:border-slate-300">
          <Card.Body className="p-6 flex flex-col justify-between items-center text-center gap-4 min-h-[240px]">
            <div className="p-4 bg-slate-50 text-red-500 border border-[#E2E8F0] rounded-xl shrink-0">
              <FileDown className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">PDF Document Report</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Formatted layout grid summarizing aggregate responses and submission times.</p>
            </div>
            <Button
              onClick={() => handleExport('PDF')}
              loading={exporting === 'PDF'}
              variant="neutral"
              size="sm"
              className="w-full gap-1.5 font-semibold text-xs border-[#E2E8F0] hover:bg-slate-50"
            >
              Export PDF ({recordsCount} rows)
            </Button>
          </Card.Body>
        </Card>

      </section>

      {/* Export History Table */}
      <section className="space-y-4">
        <h3 className="font-semibold text-sm text-[#0F172A] flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-[#64748B] shrink-0" />
          Export History Logs
        </h3>
        
        <Table headers={['Export ID', 'Format', 'Form Title', 'Total Records', 'Download Date', 'Status']}>
          {exportHistory.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 border-b border-[#E2E8F0]">
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

export default ExportModule;
