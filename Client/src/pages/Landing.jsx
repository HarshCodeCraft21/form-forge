import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Layout, 
  Layers, 
  Cpu, 
  BarChart3, 
  Download, 
  Smartphone,
  ChevronDown,
  Check
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export const Landing = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    { title: 'Drag & Drop Builder', desc: 'Add, edit, and arrange form fields visually. No technical knowledge required.', icon: Layout },
    { title: 'Form Templates', desc: 'Pick from our list of pre-built form structures for event RSVPs, registrations, and contacts.', icon: Layers },
    { title: 'AI Form Generator', desc: 'Describe the form you want in plain words, and our assistant creates it instantly.', icon: Cpu },
    { title: 'Response Analytics', desc: 'Analyze incoming submissions in real-time with easy-to-read charts.', icon: BarChart3 },
    { title: 'Export Responses', desc: 'Export your form response logs as clean CSV, Excel, or PDF files in one click.', icon: Download },
    { title: 'Mobile Friendly', desc: 'Forms render perfectly on mobile, tablet, and desktop viewports.', icon: Smartphone }
  ];

  const templatesList = [
    { title: 'Event Registration', desc: 'Collect guest RSVPs, meal choices, and contact info.' },
    { title: 'Customer Feedback', desc: 'Learn what your customers think with short rating templates.' },
    { title: 'Contact Form', desc: 'Standard contact block containing name, email, and inquiry fields.' },
    { title: 'Job Application', desc: 'Intake applicant files, resume uploads, and cover letters.' },
    { title: 'Student Admission Form', desc: 'Gather student registry details for classes and registrations.' }
  ];

  const faqs = [
    { q: 'How does the AI form generator work?', a: 'You simply type a prompt, like "Create a customer feedback survey with ratings," and the AI structures the form template fields for you automatically. You can then edit it manually.' },
    { q: 'Can I export responses to Excel or PDF?', a: 'Yes. Every form database has direct export buttons for CSV, Excel spreadsheets, and PDF documents.' },
    { q: 'Do my forms look good on mobile phones?', a: 'Absolutely. FormForge designs render responsively across all desktop, tablet, and mobile screens.' },
    { q: 'Is there a limit to the number of responses?', a: 'Our plans accommodate everything from simple personal links to scaling corporate data intake channels.' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#4F46E5] selection:text-white">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] px-6 py-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold tracking-tight text-[#0F172A]">
              FormForge
            </span>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#64748B]">
              <a href="#features" className="hover:text-[#0F172A] transition-colors">Features</a>
              <a href="#templates" className="hover:text-[#0F172A] transition-colors">Templates</a>
              <a href="#pricing" className="hover:text-[#0F172A] transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-[#0F172A] transition-colors">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-3 py-1.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="font-semibold shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-6 text-center max-w-[1280px] mx-auto flex flex-col items-center gap-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-3xl leading-tight">
          Create Forms Without Writing Code
        </h1>
        <p className="text-lg text-[#64748B] max-w-2xl leading-relaxed">
          Build registration forms, surveys, applications, and feedback forms in minutes. Clear responses spreadsheets, real-time analytics charts, and exports included.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 shrink-0">
          <Link to="/register">
            <Button variant="primary" size="lg" className="font-semibold shadow-md gap-1.5 w-full sm:w-auto">
              Create Your First Form
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <a href="#templates">
            <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">
              Explore Templates
            </Button>
          </a>
        </div>

        {/* Calm, Clean Dashboard Preview Mock */}
        <div className="mt-16 w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="bg-slate-50 border-b border-[#E2E8F0] px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <span className="text-xs text-[#64748B] font-medium font-mono">dashboard_preview.png</span>
            <div className="w-6" />
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left bg-[#F8FAFC]">
            <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-lg space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Responses</span>
              <div className="text-2xl font-bold text-[#0F172A]">1,248</div>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-lg space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Forms Created</span>
              <div className="text-2xl font-bold text-[#0F172A]">12</div>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-4.5 rounded-lg space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Completion Rate</span>
              <div className="text-2xl font-bold text-[#0F172A]">84.6%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-[#E2E8F0] px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Simple Features, Deep Value</h2>
            <p className="text-sm text-[#64748B]">Everything you need to collect user inputs, secure answers, and review stats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-6.5 space-y-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow">
                  <div className="p-2.5 bg-[#4F46E5]/10 text-[#4F46E5] rounded-lg w-fit">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A] text-base">{feat.title}</h3>
                    <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section id="templates" className="py-20 px-6 max-w-[1280px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Browse Form Templates</h2>
          <p className="text-sm text-[#64748B]">Deploy dynamic structures instantly. Filter by category, customize labels, and edit details.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesList.map((tpl, i) => (
            <Card key={i} className="flex flex-col justify-between">
              <Card.Body className="p-6 gap-3">
                <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider bg-[#4F46E5]/10 px-2 py-0.5 rounded w-fit">
                  Template
                </span>
                <div>
                  <h4 className="font-semibold text-base text-[#0F172A]">{tpl.title}</h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{tpl.desc}</p>
                </div>
              </Card.Body>
              <Card.Footer className="px-6 py-3.5 bg-slate-50 border-t border-[#E2E8F0]">
                <Link to="/login" className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1">
                  Use this template
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 bg-white border-y border-[#E2E8F0] px-6">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Submission Analytics</h2>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Track submissions and understand responses. We structure incoming answer sheets, compile weekday totals, and render minimal, readable dashboard analytics charts automatically.
            </p>
            <Link to="/login">
              <Button variant="primary" size="sm" className="font-semibold shadow-sm mt-2">
                Open Analytics Console
              </Button>
            </Link>
          </div>
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] pb-2 border-b border-[#E2E8F0]">
              <span>weekly_submissions_trend.svg</span>
              <span className="text-[#22C55E]">● Active analytics</span>
            </div>
            {/* Visual preview list mock */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span>Monday</span>
                <div className="h-4 bg-[#4F46E5] rounded w-2/3" />
                <span className="font-bold text-[#0F172A]">48 responses</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Wednesday</span>
                <div className="h-4 bg-[#4F46E5] rounded w-5/6" />
                <span className="font-bold text-[#0F172A]">82 responses</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Friday</span>
                <div className="h-4 bg-[#4F46E5] rounded w-1/2" />
                <span className="font-bold text-[#0F172A]">35 responses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 px-6 max-w-[800px] mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Frequently Asked Questions</h2>
          <p className="text-sm text-[#64748B]">Clear answers regarding form setups, exports, and analytics.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="border border-[#E2E8F0] bg-white rounded-lg overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.01)]"
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="flex justify-between items-center w-full p-4.5 text-left font-semibold text-sm text-[#0F172A] hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-[#64748B] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4.5 border-t border-[#E2E8F0] bg-slate-50/50 text-xs text-[#64748B] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-[#E2E8F0] text-center px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-base font-bold tracking-tight text-[#0F172A]">
            FormForge
          </span>
          <span className="text-xs text-[#64748B] font-medium">
            © {new Date().getFullYear()} FormForge Inc. Notion-style minimal dynamic forms builder.
          </span>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
