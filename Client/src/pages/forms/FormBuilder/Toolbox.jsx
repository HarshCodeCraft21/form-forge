import React from 'react';
import { 
  Type, 
  AlignLeft, 
  Mail, 
  Phone, 
  Binary, 
  Calendar, 
  ChevronDown, 
  List, 
  CheckSquare, 
  Upload, 
  Star, 
  MapPin, 
  PenTool, 
  Minus 
} from 'lucide-react';

// human friendly labels mapping
export const TOOLBOX_ELEMENTS = [
  { type: 'text', label: 'Short Answer', icon: Type },
  { type: 'textarea', label: 'Long Answer', icon: AlignLeft },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'phone', label: 'Phone Number', icon: Phone },
  { type: 'number', label: 'Number', icon: Binary },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'select', label: 'Dropdown', icon: ChevronDown },
  { type: 'radio', label: 'Multiple Choice', icon: List },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  { type: 'file', label: 'File Upload', icon: Upload },
  { type: 'rating', label: 'Rating', icon: Star },
  { type: 'address', label: 'Address', icon: MapPin },
  { type: 'signature', label: 'Signature', icon: PenTool },
  { type: 'divider', label: 'Section Divider', icon: Minus }
];

export const Toolbox = ({ onAddElement }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0]">
        <h3 className="font-semibold text-sm text-[#0F172A]">Field Library</h3>
        <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">Click to add fields to the live form preview.</p>
      </div>
      
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2 overflow-y-auto max-h-[60vh] md:max-h-none">
        {TOOLBOX_ELEMENTS.map((el) => {
          const Icon = el.icon;
          return (
            <button
              key={el.type}
              onClick={() => onAddElement(el.type)}
              className="inline-flex items-center gap-3 border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold text-[#0F172A] py-2 px-3 rounded-lg transition-all text-left w-full select-none cursor-pointer"
            >
              <div className="p-1.5 bg-slate-50 border border-[#E2E8F0] text-[#64748B] rounded">
                <Icon className="h-4 w-4" />
              </div>
              {el.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Toolbox;
