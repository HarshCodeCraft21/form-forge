import React from 'react';
import { Settings } from 'lucide-react';
import { TOOLBOX_ELEMENTS } from './Toolbox';

export const PropertiesPanel = ({ 
  selectedField, 
  onUpdateField,
  expiryDate,
  setExpiryDate,
  disableAfterExpiry,
  setDisableAfterExpiry
}) => {
  const [optionsText, setOptionsText] = React.useState('');

  // Sync options text with selectedField, only when selecting a different field
  React.useEffect(() => {
    if (selectedField) {
      setOptionsText(selectedField.options?.join(', ') || '');
    }
  }, [selectedField?.id]);

  if (!selectedField) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden font-sans">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[#0F172A] flex items-center gap-2">
            <Settings className="h-4 w-4 text-[#64748B]" />
            Publish Settings
          </h3>
          <span className="text-[9px] font-bold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded uppercase">
            Form Level
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="form-control w-full space-y-1">
            <label className="text-xs font-semibold text-[#0F172A] select-none">Expiration Date (Optional)</label>
            <input
              type="date"
              value={expiryDate || ''}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="input input-bordered w-full text-xs h-9"
            />
          </div>

          <label className="flex items-center justify-between bg-slate-50 border border-[#E2E8F0] p-3 rounded-lg mt-2 cursor-pointer select-none">
            <span className="text-xs font-semibold text-[#0F172A] leading-tight pr-2">Stop accepting responses after expiry</span>
            <input
              type="checkbox"
              checked={!!disableAfterExpiry}
              onChange={(e) => setDisableAfterExpiry(e.target.checked)}
              className="rounded border-[#E2E8F0] text-[#4F46E5] h-3.5 w-3.5 focus:ring-[#4F46E5]/15"
            />
          </label>

          <hr className="border-[#E2E8F0] my-2" />

          <div className="flex flex-col items-center justify-center text-center py-4 bg-slate-50/50 rounded-xl border border-dashed border-[#E2E8F0]">
            <p className="text-[10px] text-[#64748B]/70 max-w-[180px] leading-relaxed">
              Click on any element in the live workspace canvas to modify its fields and settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleTextChange = (propName, val) => {
    onUpdateField(selectedField.id, { [propName]: val });
  };

  const handleCheckboxChange = (propName, checked) => {
    onUpdateField(selectedField.id, { [propName]: checked });
  };

  const handleOptionsChange = (val) => {
    setOptionsText(val);
    const opts = val.split(',').map(o => o.trim()).filter(Boolean);
    onUpdateField(selectedField.id, { options: opts });
  };

  const showOptionsInput = ['select', 'radio', 'checkbox'].includes(selectedField.type);
  const elementConfig = TOOLBOX_ELEMENTS.find(el => el.type === selectedField.type);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden font-sans">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <h3 className="font-semibold text-sm text-[#0F172A] flex items-center gap-2">
          <Settings className="h-4 w-4 text-[#64748B]" />
          Field Settings
        </h3>
        <span className="text-[9px] font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-2 py-0.5 rounded uppercase">
          {elementConfig?.label || selectedField.type}
        </span>
      </div>

      <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        
        {/* Label Field */}
        <div className="form-control w-full space-y-1">
          <label className="text-xs font-semibold text-[#0F172A] select-none">Question Label</label>
          <input
            type="text"
            value={selectedField.label || ''}
            onChange={(e) => handleTextChange('label', e.target.value)}
            className="input input-bordered w-full text-xs h-9"
          />
        </div>

        {/* Placeholder - Hide for divider */}
        {selectedField.type !== 'divider' && (
          <div className="form-control w-full space-y-1">
            <label className="text-xs font-semibold text-[#0F172A] select-none">Placeholder Hint</label>
            <input
              type="text"
              value={selectedField.placeholder || ''}
              onChange={(e) => handleTextChange('placeholder', e.target.value)}
              className="input input-bordered w-full text-xs h-9"
            />
          </div>
        )}

        {/* Options list for Selects/Radios/Checkboxes */}
        {showOptionsInput && (
          <div className="form-control w-full space-y-1">
            <label className="text-xs font-semibold text-[#0F172A] select-none">Options (separated by comma)</label>
            <textarea
              value={optionsText}
              onChange={(e) => handleOptionsChange(e.target.value)}
              className="textarea textarea-bordered w-full text-xs h-20 leading-relaxed py-2"
              placeholder="e.g. Option 1, Option 2, Option 3"
            />
            <span className="text-[10px] text-[#64748B]/70 mt-1 block">Separate answers with a comma.</span>
          </div>
        )}

        {/* Help text */}
        {selectedField.type !== 'divider' && (
          <div className="form-control w-full space-y-1">
            <label className="text-xs font-semibold text-[#0F172A] select-none">Supporting Help Text</label>
            <input
              type="text"
              value={selectedField.helpText || ''}
              onChange={(e) => handleTextChange('helpText', e.target.value)}
              className="input input-bordered w-full text-xs h-9"
            />
          </div>
        )}

        {/* Width selection */}
        <div className="form-control w-full space-y-1">
          <label className="text-xs font-semibold text-[#0F172A] select-none">Layout Width</label>
          <select
            value={selectedField.width || 'full'}
            onChange={(e) => handleTextChange('width', e.target.value)}
            className="select select-bordered w-full text-xs h-9"
          >
            <option value="full">Full Width (100%)</option>
            <option value="half">Half Width (50%)</option>
          </select>
        </div>

        {/* Required Toggle */}
        {selectedField.type !== 'divider' && (
          <label className="flex items-center justify-between bg-slate-50 border border-[#E2E8F0] p-3 rounded-lg mt-2 cursor-pointer select-none">
            <span className="text-xs font-semibold text-[#0F172A]">Required answer</span>
            <input
              type="checkbox"
              checked={!!selectedField.required}
              onChange={(e) => handleCheckboxChange('required', e.target.checked)}
              className="rounded border-[#E2E8F0] text-[#4F46E5] h-3.5 w-3.5 focus:ring-[#4F46E5]/15"
            />
          </label>
        )}

      </div>
    </div>
  );
};

export default PropertiesPanel;
