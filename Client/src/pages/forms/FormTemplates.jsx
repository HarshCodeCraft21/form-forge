import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { FORM_TEMPLATES, TEMPLATE_CATEGORIES } from '../../utils/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export const FormTemplates = () => {
  const navigate = useNavigate();
  const { addForm } = useFormStore();
  
  // State hook variables
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates
  const filteredTemplates = FORM_TEMPLATES.filter((tpl) => {
    const matchesSearch = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    // Clone template fields with safe random IDs
    const clonedForm = {
      title: template.title,
      description: template.description,
      status: 'published',
      fields: template.fields.map(field => ({
        ...field,
        id: `field-${Math.random().toString(36).substring(2, 9)}`
      }))
    };
    
    const created = addForm(clonedForm);
    if (created) {
      navigate(`/forms/${created.id}/edit`);
    }
  };

  return (
    <div className="space-y-8 select-none font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/forms')}
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </button>
        </div>
        <div>
          <h1 className="text-[#0F172A] font-bold text-3xl leading-tight">Form Templates Gallery</h1>
          <p className="text-sm text-[#64748B] mt-1">Start collecting data immediately using pre-built form layouts.</p>
        </div>
      </div>

      {/* Categories & Search Filter row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.01)]">
        
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search templates by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered focus:input-primary pl-10 w-full text-sm h-10"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]/60 h-4 w-4" />
        </div>

        {/* Categories Tabs */}
        <div className="flex bg-slate-50 p-1 rounded-lg border border-[#E2E8F0] shrink-0 self-start sm:self-auto gap-0.5">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-white text-[#0F172A] shadow-sm' 
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col justify-between hover:border-slate-350">
            <Card.Body className="p-6 gap-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider bg-[#4F46E5]/10 px-2.5 py-0.5 rounded">
                    {TEMPLATE_CATEGORIES.find(c => c.id === template.category)?.name || template.category}
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B]">
                    {template.fields.length} questions
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">
                    {template.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{template.description}</p>
                </div>
              </div>

              {/* Predesigned fields summary */}
              <div className="space-y-2 mt-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B] opacity-50">Included Fields:</span>
                <div className="flex flex-wrap gap-1.5">
                  {template.fields.slice(0, 3).map((f, idx) => (
                    <span key={idx} className="bg-slate-100 border border-[#E2E8F0] text-[10px] py-1 px-2 rounded font-medium text-[#64748B]">
                      {f.label}
                    </span>
                  ))}
                  {template.fields.length > 3 && (
                    <span className="text-[10px] text-[#64748B] py-1 px-1 font-semibold">
                      +{template.fields.length - 3} more
                    </span>
                  )}
                </div>
              </div>

            </Card.Body>

            <Card.Footer className="px-6 py-4 bg-slate-50 border-t border-[#E2E8F0] shrink-0">
              <Button
                onClick={() => handleUseTemplate(template)}
                variant="primary"
                size="sm"
                className="w-full gap-1 font-semibold"
              >
                Use Template
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default FormTemplates;
