import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className="overflow-x-auto w-full border border-[#E2E8F0] rounded-lg bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <table className={`table-auto w-full text-left border-collapse ${className}`}>
        <thead>
          <tr className="bg-slate-50 border-b border-[#E2E8F0]">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="text-xs font-semibold uppercase tracking-wider text-[#64748B] py-3.5 px-5 select-none"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A] text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
