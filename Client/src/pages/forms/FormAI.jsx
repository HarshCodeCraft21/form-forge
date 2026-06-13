import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  RotateCcw, 
  Check, 
  ArrowLeft,
  User,
  Layers
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Button from '../../components/ui/Button';

export const FormAI = () => {
  const navigate = useNavigate();
  const { addForm } = useFormStore();
  
  // State hook variables
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am your FormForge AI assistant. Type a prompt like 'Generate an Internship Application Form' or 'Create a Customer Feedback Survey' and I'll build the template structure for you." }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedForm, setGeneratedForm] = useState(null);

  const promptSuggestions = [
    "Generate an Internship Application Form",
    "Create a Birthday Bash RSVP",
    "Course Feedback Survey",
    "Customer Support intake form"
  ];

  const handleSuggestionClick = (promptText) => {
    setPromptInput(promptText);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const query = promptInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setPromptInput('');
    setLoading(true);

    try {
      // Simulate network lag
      await new Promise(resolve => setTimeout(resolve, 1500));

      const queryLower = query.toLowerCase();
      let title = "AI Generated Form";
      let desc = `Form schema generated based on prompt: "${query}"`;
      let fields = [];

      // Keyword matching matching mock generation logic
      if (queryLower.includes('internship') || queryLower.includes('job') || queryLower.includes('candidate')) {
        title = "Internship Intake Application";
        desc = "Intake application form automatically assembled by AI.";
        fields = [
          { id: 'ai-f1', type: 'text', label: 'Candidate Full Name', placeholder: 'Jane Doe', required: true, width: 'half' },
          { id: 'ai-f2', type: 'email', label: 'Primary Email Address', placeholder: 'candidate@email.com', required: true, width: 'half' },
          { id: 'ai-f3', type: 'phone', label: 'Contact Phone Number', placeholder: '+1 (555) 019-2834', required: true, width: 'half' },
          { id: 'ai-f4', type: 'text', label: 'University / Organization', placeholder: 'University name', required: false, width: 'half' },
          { id: 'ai-f5', type: 'select', label: 'Preferred Department', options: ['Engineering', 'Design & UX', 'Marketing', 'Product Management'], required: true, width: 'full' },
          { id: 'ai-f6', type: 'file', label: 'Upload your CV / Resume', required: true, width: 'full' },
          { id: 'ai-f7', type: 'textarea', label: 'Tell us why you are a great fit', placeholder: 'Cover letter...', required: false, width: 'full' }
        ];
      } else if (queryLower.includes('party') || queryLower.includes('rsvp') || queryLower.includes('invite') || queryLower.includes('birthday')) {
        title = "Event & Party RSVP";
        desc = "RSVP invitation and details coordinator assembled by AI.";
        fields = [
          { id: 'ai-f1', type: 'text', label: 'Attendee Full Name', placeholder: 'John Miller', required: true, width: 'full' },
          { id: 'ai-f2', type: 'radio', label: 'Will you attend the event?', options: ['Yes, count me in!', 'No, I cannot attend', 'Maybe, notify me later'], required: true, width: 'full' },
          { id: 'ai-f3', type: 'number', label: 'Number of Additional Guests', placeholder: '0', required: true, defaultValue: '0', width: 'half' },
          { id: 'ai-f4', type: 'select', label: 'Dietary Choice', options: ['No preferences', 'Vegetarian', 'Vegan', 'Gluten Free'], required: false, width: 'half' },
          { id: 'ai-f5', type: 'textarea', label: 'Any song requests for the DJ?', placeholder: 'Song name / Artist...', required: false, width: 'full' }
        ];
      } else if (queryLower.includes('feedback') || queryLower.includes('course') || queryLower.includes('satisfaction') || queryLower.includes('survey')) {
        title = "Satisfaction Feedback Survey";
        desc = "Customer experience evaluation metrics form assembled by AI.";
        fields = [
          { id: 'ai-f1', type: 'rating', label: 'Rate your overall experience with our service', required: true, width: 'full' },
          { id: 'ai-f2', type: 'select', label: 'Which aspect did you find most valuable?', options: ['Speed & Delivery', 'Customer Service', 'Product Quality', 'Affordable Pricing'], required: true, width: 'full' },
          { id: 'ai-f3', type: 'checkbox', label: 'I authorize using my feedback in testimonials', required: false, width: 'full' },
          { id: 'ai-f4', type: 'textarea', label: 'Please elaborate on how we can improve', placeholder: 'Comments...', required: false, width: 'full' }
        ];
      } else {
        // Generic defaults
        title = "Quick Contact Form";
        desc = "Generic customer contact page generated by AI.";
        fields = [
          { id: 'ai-f1', type: 'text', label: 'Full Name', placeholder: 'Your Name', required: true, width: 'half' },
          { id: 'ai-f2', type: 'email', label: 'Email Address', placeholder: 'your@email.com', required: true, width: 'half' },
          { id: 'ai-f3', type: 'textarea', label: 'How can we help you?', placeholder: 'Enter details...', required: true, width: 'full' }
        ];
      }

      setGeneratedForm({ title, description: desc, fields });
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', text: `Success! I have automatically built the structure for "${title}". You can review the field specifications in the preview panel. Click 'Accept Form' to save it to your workspace.` }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (!generatedForm) return;
    const created = addForm(generatedForm);
    if (created) {
      navigate(`/forms/${created.id}/edit`);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => navigate('/forms')}
              className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to forms
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Bot className="h-6 w-6 text-[#64748B]" />
            AI Form Assistant
          </h1>
          <p className="text-xs text-[#64748B] mt-1">Interact with the AI assistant to automatically generate dynamic form structures.</p>
        </div>
      </div>

      {/* Grid: Chat & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Chat UI Panel (6 Columns) */}
        <section className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col h-[600px] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <div className="px-5 py-4 bg-slate-50 border-b border-[#E2E8F0] flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#64748B] shrink-0" />
            <span className="font-semibold text-sm text-[#0F172A]">AI Conversational Box</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 flex flex-col justify-start">
            {messages.map((msg, idx) => {
              const isAI = msg.sender === 'ai';
              return (
                <div key={idx} className={`flex items-start gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${isAI ? 'bg-slate-100 text-[#64748B]' : 'bg-[#4F46E5] text-white'}`}>
                    {isAI ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </div>
                  <div className={`p-3 rounded-lg text-xs leading-relaxed ${isAI ? 'bg-slate-50 border border-[#E2E8F0] text-[#0F172A]' : 'bg-[#4F46E5] text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3 max-w-[85%] self-start">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#64748B] flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs flex items-center gap-2 text-[#64748B]">
                  <span className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 bg-[#64748B] rounded-full animate-bounce"></span>
                    <span className="h-1.5 w-1.5 bg-[#64748B] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 bg-[#64748B] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                  <span>Generating fields...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions footer */}
          {!generatedForm && (
            <div className="px-5 py-3 border-t border-[#E2E8F0] bg-slate-50/50 flex flex-wrap gap-2 justify-start">
              {promptSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-2.5 py-1.5 border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[10px] font-semibold text-[#64748B] hover:text-[#0F172A] rounded-md transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Form input trigger */}
          <form onSubmit={handleGenerate} className="p-4 border-t border-[#E2E8F0] bg-slate-50 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Describe your desired form..."
              value={promptInput}
              disabled={loading}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !promptInput.trim()}
              className="p-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>

        {/* Live Preview Panel (6 Columns) */}
        <section className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl min-h-[480px] overflow-hidden flex flex-col shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[#0F172A] flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#64748B] shrink-0" />
                AI Fields Previews
              </h3>
              {generatedForm && (
                <span className="text-[10px] font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-2 py-0.5 rounded-full">
                  {generatedForm.fields.length} Fields
                </span>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-start">
              {!generatedForm ? (
                <div className="my-auto py-16 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#E2E8F0] rounded-xl bg-slate-50/50">
                  <div className="p-3 bg-[#4F46E5]/5 text-[#4F46E5] rounded-full mb-3 shrink-0">
                    <Bot className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-xs text-[#0F172A]">No AI Form generated yet</h4>
                  <p className="text-[11px] text-[#64748B] max-w-xs mt-1 leading-relaxed">
                    Describe your requirements in the chat assistant panel on the left to review fields configuration previews here.
                  </p>
                </div>
              ) : (
                /* Generated Preview fields list */
                <div className="space-y-4">
                  <div className="border-b border-[#E2E8F0] pb-3">
                    <h3 className="text-base font-semibold text-[#0F172A]">{generatedForm.title}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{generatedForm.description}</p>
                  </div>
                  
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {generatedForm.fields.map((f, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-1.5 py-0.5 rounded uppercase font-mono">{f.type}</span>
                          <span className="font-semibold text-[#0F172A]">{f.label}</span>
                        </div>
                        {f.required && (
                          <span className="text-[10px] text-red-500 font-medium">* Required</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions for generated schema */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E2E8F0] mt-4">
                    <Button
                      onClick={() => setGeneratedForm(null)}
                      variant="outline"
                      size="sm"
                      className="border-[#E2E8F0] hover:bg-slate-50 gap-1.5 normal-case font-semibold text-[#64748B]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                    <Button
                      onClick={handleAccept}
                      variant="primary"
                      size="sm"
                      className="gap-1.5 normal-case font-semibold"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Accept Form
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>

    </div>
  );
};

export default FormAI;
