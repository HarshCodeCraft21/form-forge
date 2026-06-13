import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Bot, 
  ArrowRight,
  Inbox,
  FileText
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { 
    forms, 
    responses, 
    dashboardStats, 
    fetchDashboardStats, 
    fetchForms, 
    fetchResponses 
  } = useFormStore();

  // Load all dashboard metrics on component mount
  useEffect(() => {
    fetchDashboardStats();
    fetchForms();
    fetchResponses();
  }, [fetchDashboardStats, fetchForms, fetchResponses]);

  // Compute metrics dynamically from the store
  const totalForms = forms.length;
  const totalResponses = dashboardStats?.totalResponses ?? responses.length;
  const publishedForms = dashboardStats?.publishedForms ?? forms.filter(f => f.status === 'published').length;
  const draftForms = dashboardStats?.draftForms ?? forms.filter(f => f.status !== 'published').length;

  const cards = [
    { title: 'Total Forms Workspace', value: totalForms, icon: FileText },
    { title: 'Total Submissions Logged', value: totalResponses, icon: Inbox },
    { title: 'Published Intake Forms', value: publishedForms, icon: FileText },
    { title: 'Pending Form Drafts', value: draftForms, icon: FileText },
  ];

  // Quick activity tables limit 3 items
  const recentForms = forms.slice(0, 3);
  const recentResponses = responses.slice(0, 3);

  return (
    <div className="space-y-8 select-none font-sans">
      
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[#0F172A] font-bold text-3xl leading-tight">Dashboard Overview</h1>
          <p className="text-sm text-[#64748B] mt-1">Review forms metrics, submission velocities, and templates options.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/forms/new">
            <Button variant="primary" size="sm" className="font-semibold shadow-sm gap-1">
              <Plus className="h-4 w-4" />
              Create Form
            </Button>
          </Link>
          <Link to="/forms/ai">
            <Button variant="secondary" size="sm" className="font-semibold gap-1">
              <Bot className="h-4 w-4 text-[#4F46E5]" />
              Generate with AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Most Active Form Highlight Alert if exists */}
      {dashboardStats?.mostActiveForm && (
        <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#0F172A]">
          <div>
            <span className="font-extrabold text-[#4F46E5] uppercase tracking-wider block text-[10px] mb-0.5">Most Active Intake Form</span>
            <p className="leading-relaxed font-semibold">
              "{dashboardStats.mostActiveForm.title}" has received <span className="font-black text-indigo-700">{dashboardStats.mostActiveForm.responseCount}</span> submissions.
            </p>
          </div>
          <button 
            onClick={() => navigate(`/responses/${dashboardStats.mostActiveForm.id}`)}
            className="btn btn-xs btn-outline btn-primary font-bold normal-case shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Review Submissions
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx}>
              <Card.Body className="p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{card.title}</span>
                  <div className="text-3xl font-black tracking-tight text-[#0F172A]">{card.value}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-[#E2E8F0] text-[#64748B] rounded-lg shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </section>

      {/* Grid: Recent Forms & Recent Responses */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Forms */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#0F172A] text-base">Recent Forms</h3>
            <Link to="/forms" className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <Table headers={['Form Name', 'Responses', 'Created']}>
            {recentForms.map((form) => (
              <tr key={form.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-[#0F172A]">{form.title}</div>
                  <div className="text-xs text-[#64748B] truncate max-w-[180px]">{form.description}</div>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs font-semibold">
                  {form.responsesCount || 0}
                </td>
                <td className="px-5 py-3.5 text-xs text-[#64748B]">
                  {new Date(form.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </Table>
        </div>

        {/* Recent Responses */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#0F172A] text-base">Recent Responses</h3>
            <Link to="/responses" className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <Table headers={['Form Link', 'Date Submitted', 'Summary Answers']}>
            {recentResponses.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-xs text-[#64748B] font-medium">
                  No submissions yet. Submit a response first.
                </td>
              </tr>
            ) : (
              recentResponses.map((resp) => {
                const targetForm = forms.find(f => f.id === resp.formId);
                const answersSummary = Object.entries(resp.answers || {})
                  .map(([lbl, val]) => {
                    const displayVal = val && typeof val === 'object' && val.name ? val.name : val;
                    return `${lbl}: ${displayVal}`;
                  })
                  .slice(0, 2)
                  .join(' | ');

                return (
                  <tr key={resp.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#0F172A] truncate max-w-[150px]">{targetForm?.title || 'Form'}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#64748B]">
                      {new Date(resp.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#64748B] truncate max-w-[180px]">
                      {answersSummary || 'No data'}
                    </td>
                  </tr>
                );
              })
            )}
          </Table>
        </div>

      </section>

    </div>
  );
};

export default DashboardOverview;
